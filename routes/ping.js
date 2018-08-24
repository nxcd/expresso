'use strict'

const env = require('sugar-env')

const factory = (config) => (req, res) => {
  if (env.is(env.DEVELOPMENT)) {
    res.append('x-config', JSON.stringify(config))
  }

  res.status(200)
    .send('Pong!')
    .end()
}

module.exports = { factory }
