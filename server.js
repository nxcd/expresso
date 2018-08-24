'use strict'

const http = require('http')
const debug = require('debug')
const env = require('sugar-env')
const merge = require('lodash.merge')

/**
 * @param  {Function} appFactory  App factory.
 * @param  {Object}   options     Config object.
 */
const start = async (appFactory, options) => {
  const config = merge(
    { server: { binding: { ip: env.get('SERVER_BINDING_IP', '0.0.0.0') } } },
    { server: { binding: { port: parseInt(env.get('SERVER_BINDING_PORT', 3000)) } } },
    options
  )

  const server = http.createServer(await appFactory(config, env.current))

  server.on('listening', () => {
    const addr = server.address()
    debug(`expresso:server`)(`Listening on http://${addr.address}:${addr.port}/`)
  })

  server.listen(config.server.binding.port, config.server.binding.ip)
}

module.exports = { start }
