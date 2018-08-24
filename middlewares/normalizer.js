'use strict'

const HttpError = require('../errors/http-error')

/**
 * @return {Function} Middleware.
 */
const factory = () => {
  return (err, req, res, next) => {
    if ((err instanceof HttpError) === false) {
      return next(new HttpError.InternalError({ message: err.message, stack: err.stack }))
    }

    return next(err)
  }
}

module.exports = { factory }
