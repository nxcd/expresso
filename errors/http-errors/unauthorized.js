'use strict'

const HttpError = require('../http-error')

const STATUS = 401
const DEFAULT_CODE = 'unauthorized'

class Unauthorized extends HttpError {
  /**
   * @param  {String} options.message Error message.
   * @param  {String} options.code    Error code.
   */
  constructor ({ message, code = DEFAULT_CODE }) {
    super(STATUS, code, message)
  }
}

module.exports = Unauthorized
module.exports.STATUS = STATUS
module.exports.DEFAULT_CODE = DEFAULT_CODE
