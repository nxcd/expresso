'use strict'

const HttpError = require('../errors/http-error')

const ERR_MESSAGE = 'requested resource was not found'

/**
 * @return {Function} Middleware
 */
const factory = () => {
  return (req, res, next) => {
    return next(new HttpError.NotFound({ message: ERR_MESSAGE }))
  }
}

module.exports = { factory }
