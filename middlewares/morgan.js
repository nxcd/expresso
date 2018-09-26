'use strict'

const env = require('sugar-env')
const morgan = require('morgan')
const merge = require('lodash.merge')

const factory = ({ format, ...config }, environment) => {
  const options = merge(config, { skip: () => { return environment === env.TEST } })

  return morgan(format, options)
}

module.exports = { factory }
