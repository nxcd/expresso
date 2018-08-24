'use strict'

const HttpError = require('../http-error')

const STATUS = 503
const DEFAULT_CODE = 'service_unavailable'

class ServiceUnavailable extends HttpError {
  /**
   * @param {String}  optinos.message Error message.
   * @param {String}  options.code    Error code.
   */
  constructor ({ message, code = DEFAULT_CODE }) {
    super(STATUS, code, message)
  }
}

module.exports = ServiceUnavailable
module.exports.STATUS = STATUS
module.exports.DEFAULT_CODE = DEFAULT_CODE
