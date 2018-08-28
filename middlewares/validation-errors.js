'use strict'

const HttpError = require('../errors/http-error')

const factory = () => (err, req, res, next) => {
  if (err.name !== 'JsonSchemaValidation') {
    return next(err)
  }

  const validations = Object.keys(err.validations)
    .reduce((result, key) => {
      const validation = err.validations[key]
      result.push(...validation)
      return result
    }, [])

  return next(new HttpError.UnprocessableEntity({
    message: err.message,
    validations
  }))
}

module.exports = { factory }
