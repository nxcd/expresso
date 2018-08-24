'use strict'

const HttpError = require('../http-error')

const STATUS = 500
const DEFAULT_CODE = 'internal_error'

class InternalError extends HttpError {
  /**
   * @param  {String} options.message Error message.
   * @param  {String} options.stack   Error stack.
   */
  constructor ({ message, stack }) {
    super(STATUS, DEFAULT_CODE, message)

    this.stack = stack
  }
}

module.exports = InternalError
module.exports.STATUS = STATUS
module.exports.DEFAULT_CODE = DEFAULT_CODE
