'use strict'

const HttpError = require('../errors/http-error')
const ValidationError = require('../errors/validation-error')

const factory = () => (err, req, res, next) => {
  if ((err instanceof ValidationError) === false) {
    return next(err)
  }

  return next(new HttpError.UnprocessableEntity({
    message: err.message,
    validations: err.errors
  }))
}

module.exports = { factory }
