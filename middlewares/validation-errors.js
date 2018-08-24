'use strict'

const HttpError = require('../errors/http-error')

const factory = () => (err, req, res, next) => {
  if (err.name !== 'JsonSchemaValidation') {
    return next(err)
  }

  return next(new HttpError.UnprocessableEntity({
    message: err.message,
    validations: err.validations
  }))
}

module.exports = { factory }
