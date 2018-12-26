'use strict'

const { format } = require('util')
const jwksRsa = require('jwks-rsa')
const expressJwt = require('express-jwt')
const HttpError = require('./errors/http-error')

const isPathInScope = (path, scope, { separator = '.', wildcard = '*', wildcardIsRoot = true } = {}) => {
  return path.split(separator)
    .reduce((possibilities, segment) => {
      const possibility = possibilities.slice(-1).length
        ? `${possibilities.slice(-1)[0]}${separator}${segment}`
        : segment

      possibilities.push(possibility)
      return possibilities
    }, [])
    .map(possibility => (possibility !== path) || wildcardIsRoot ? `${possibility}${separator}${wildcard}` : possibility)
    .concat([wildcard, path])
    .reduce((result, possibility) => result || scope.includes(possibility), false)
}

/**
 * @param   {string|array.<string>} expected  Expected types (user and/or service).
 * @returns {Function}                        Middleware
 */
const types = (expected) => {
  if (!Array.isArray(expected)) {
    return types(expected.split(' '))
  }

  /**
   * @param   {Object}    req           Request object.
   * @param   {Object}    res           Response object.
   * @param   {Function}  next          Next middleware in command chain.
   * @throws  {HttpError.Unauthorized}  If request is unauthorized.
   */
  return (req, res, next) => {
    if (!req.user || typeof req.user.type !== 'string') {
      return next(new HttpError.Unauthorized({
        message: 'authorization token is missing or has an invalid subject type',
        code: 'unauthorized'
      }))
    }

    const hasExpectedType = expected.map(type => type.toLowerCase())
                                    .includes(req.user.type.toLowerCase())

    if (!hasExpectedType) {
      return next(new HttpError.Unauthorized({
        message: format('one of the following types is required: %s', expected.join(' ')),
        code: 'invalid_type'
      }))
    }

    next()
  }
}

/**
 * @param   {string|array.<string>} expected  Array of expected scopes.
 * @returns {Function}                        Scopes validation middleware.
 */
const scopes = (expected, shouldHaveAllScopes = true) => {
  if (!Array.isArray(expected)) {
    return scopes(expected.split(' '))
  }

  /**
   * @param   {Object}    req           Request object.
   * @param   {Object}    res           Response object.
   * @param   {Function}  next          Next middleware in command chain.
   * @throws  {HttpError.Unauthorized}  If request is unauthorized.
   */
  return (req, res, next) => {
    if (!req.user || !Array.isArray(req.user.scopes)) {
      return next(new HttpError.Unauthorized({
        message: 'authorization token is missing or has an invalid scope grant',
        code: 'unauthorized'
      }))
    }

    const matchedScopes = shouldHaveAllScopes ? expected.filter((scope) => !isPathInScope(scope, req.user.scopes)) : expected.filter((scope) => isPathInScope(scope, req.user.scopes))

    if ((matchedScopes.length > 0 && shouldHaveAllScopes) || (matchedScopes.length <= 0  && !shouldHaveAllScopes)) {
      return next(new HttpError.Unauthorized({
        message: format('the following permissions are required: %s', matchedScopes.join(' ')),
        code: 'insufficient_permissions'
      }))
    }

    next()
  }
}

scopes.or = (expected) => scopes(expected, false)
scopes.and = (expected) => scopes(expected, true)

/**
 * @param   {String}  options.jwks.uri
 * @param   {String}  options.jwks.cache
 * @param   {String}  options.jwks.rateLimit
 * @param   {String}  options.jwks.requestsPerMinute
 * @param   {String}  options.jwt.audience
 * @param   {String}  options.jwt.issuer
 * @returns {Object}
 */
const factory = (options) => {
  const { jwt: { audience, issuer, algorithms = [ 'RS256' ] } } = options
  const { jwks: { uri: jwksUri, cache = true, rateLimit = true } } = options
  const { jwks: { requestsPerMinute: jwksRequestsPerMinute = 6 } } = options

  const jwks = jwksRsa.expressJwtSecret(
    { cache, rateLimit, jwksRequestsPerMinute, jwksUri }
  )

  const jwt = [
    /**
     * Authentication handler
     */
    expressJwt({ secret: jwks, audience, issuer, algorithms }),

    /**
     * Moes
     */
    (req, res, next) => {
      const { scope, sub } = { ...req.user }

      if (!/urn:(user|sa):([a-f\d]{24})/i.test(sub)) {
        return next(new HttpError.Unauthorized({
          message: 'an unacceptable identity urn was given',
          code: 'invalid_identity_urn'
        }))
      }

      const [ urn, type, id ] = /urn:(user|sa):([a-f\d]{24})/i.exec(sub)

      Object.defineProperty(req, 'user', {
        value: { id, type, urn, scopes: scope.split(' ') },
        writable: false
      })

      next()
    },

    /**
     * Error handler
     */
    (err, req, res, next) => {
      if (err instanceof expressJwt.UnauthorizedError) {
        return next(new HttpError.Unauthorized({
          message: err.message.toLowerCase(),
          code: 'unauthorized'
        }))
      }

      next(err)
    }
  ]

  return { jwt, scopes, types }
}

module.exports = { factory, scopes, types }
