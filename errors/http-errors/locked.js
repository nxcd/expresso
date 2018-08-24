'use strict'

const HttpError = require('../http-error')

const STATUS = 423
const DEFAULT_CODE = 'locked'

class Locked extends HttpError {
  /**
   * @param {String}  optinos.message Error message.
   * @param {String}  options.code    Error code.
   */
  constructor ({ message, code = DEFAULT_CODE }) {
    super(STATUS, code, message)
  }
}

module.exports = Locked
module.exports.STATUS = STATUS
module.exports.DEFAULT_CODE = DEFAULT_CODE
