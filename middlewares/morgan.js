'use strict'

const morgan = require('morgan')

const factory = ({ format, ...config }) => {
  return morgan(format, config)
}

module.exports = { factory }
