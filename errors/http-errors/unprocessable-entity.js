'use strict'

const HttpError = require('../http-error')

const STATUS = 422
const DEFAULT_CODE = 'unacceptable_payload_schema'

class UnprocessableEntity extends HttpError {
  /**
   * @param  {String}         optinos.message     Error message.
   * @param  {String}         options.code        Error code.
   * @param  {Array<Object>}  options.validaitons Descriptive array of failed
   *                                              validations.
   */
  constructor ({ message, code = DEFAULT_CODE, validations = [] }) {
    super(STATUS, code, message)

    this.validations = validations
  }
}

module.exports = UnprocessableEntity
module.exports.STATUS = STATUS
module.exports.DEFAULT_CODE = DEFAULT_CODE
