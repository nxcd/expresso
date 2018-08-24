'use strict'

const HttpError = require('../http-error')

const STATUS = 403
const DEFAULT_CODE = 'forbidden'

class Forbidden extends HttpError {
  /**
   * @param {String}  optinos.message Error message.
   * @param {String}  options.code    Error code.
   */
  constructor ({ message, code = DEFAULT_CODE }) {
    super(STATUS, code, message)
  }
}

module.exports = Forbidden
module.exports.STATUS = STATUS
module.exports.DEFAULT_CODE = DEFAULT_CODE
