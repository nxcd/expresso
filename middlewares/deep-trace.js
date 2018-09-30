'use strict'

const DeepTrace = require('deeptrace-express')

/**
 * @param   {Object}  config  DeepTrace's configuration object.
 * @return {Function}         Middleware.
 */
const factory = (config) => {
  return DeepTrace.middleware(config)
}

module.exports = { factory }
