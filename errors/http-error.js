'use strict'

const Error = require('./error')

class HttpError extends Error {
  /**
   * @param  {Number} status  HTTP status code.
   * @param  {String} code    Custom error code.
   * @param  {String} message Error message.
   */
  constructor (status, code, message) {
    super(message)

    this.code = code
    this.status = status
  }
}

module.exports = HttpError
module.exports.Locked = require('./http-errors/locked')
module.exports.Conflict = require('./http-errors/conflict')
module.exports.NotFound = require('./http-errors/not-found')
module.exports.Forbidden = require('./http-errors/forbidden')
module.exports.Unauthorized = require('./http-errors/unauthorized')
module.exports.InternalError = require('./http-errors/internal-error')
module.exports.ServiceUnavailable = require('./http-errors/service-unavailable')
module.exports.UnprocessableEntity = require('./http-errors/unprocessable-entity')
