'use strict'

const HttpError = require('../http-error')

const STATUS = 404
const DEFAULT_CODE = 'not_found'

class NotFound extends HttpError {
  /**
   * @param  {String} options.message Error message.
   * @param  {String} options.code    Error code.
   */
  constructor ({ message, code = DEFAULT_CODE }) {
    super(STATUS, code, message)
  }
}

module.exports = NotFound
module.exports.STATUS = STATUS
module.exports.DEFAULT_CODE = DEFAULT_CODE
