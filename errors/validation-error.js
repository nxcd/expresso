'use strict'

const Error = require('./error')

class ValidationError extends Error {
  /**
   * @param  {String          message Error message.
   * @param  {Array<Object>}  errors  Descriptive error for each failed
   *                                  validation.
   */
  constructor (message, errors) {
    super(message)

    this.errors = errors
  }
}

module.exports = ValidationError
