'use strict'

const HttpError = require('../errors/http-error')

/**
 * @param   {Error} err Instance of error.
 * @return  {Boolean}   Whether validation errors should be displayed.
 */
const shouldDisplayValidationErrors = (err) => {
  return err instanceof HttpError.UnprocessableEntity &&
      err.validations.length > 0
}

/**
 * @param   {String}  environment Current environment name.
 * @return  {Boolean}             Whether error stack should be displayed.
 */
const shouldDisplayErrorStack = (environment) => {
  return environment !== 'production'
}

/**
 * @param  {String}   environment Current environment name.
 * @return {Function}             Middleware.
 */
const factory = (environment) => {
  return (err, req, res, next) => {
    const { code, message, status } = err

    const validations = shouldDisplayValidationErrors(err)
      ? err.validations
      : undefined

    const stack = shouldDisplayErrorStack(environment)
      ? err.stack
      : undefined

    res.status(status)
      .json({ status, error: { code, message, stack, validations } })
  }
}

module.exports = { factory }
