'use strict'

const HttpError = require('../http-error')

const STATUS = 409
const DEFAULT_CODE = 'duplicated'

class Conflict extends HttpError {
  /**
   * @param {String}  optinos.message Error message.
   * @param {String}  options.code    Error code.
   */
  constructor ({ message, code = DEFAULT_CODE }) {
    super(STATUS, code, message)
  }
}

module.exports = Conflict
module.exports.STATUS = STATUS
module.exports.DEFAULT_CODE = DEFAULT_CODE
