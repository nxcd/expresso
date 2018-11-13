'use strict'

const http = require('http')
const path = require('path')
const env = require('sugar-env')
const cfonts = require('cfonts')
const merge = require('lodash.merge')
const { makeConfig } = require(path.join(__dirname, 'index.js'))

/**
 * @param  {Function} appFactory  App factory.
 * @param  {Object}   options     Config object.
 */
const start = async (appFactory, options) => {
  const config = merge(
    { server: { binding: { ip: env.get('SERVER_BINDING_IP', '0.0.0.0') } } },
    { server: { binding: { port: parseInt(env.get('SERVER_BINDING_PORT', 3000)) } } },
    makeConfig(options, env.current)
  )

  const server = http.createServer(await appFactory(config, env.current))

  server.on('listening', () => {
    const addr = server.address()

    cfonts.say('expresso', {
      font: 'simple3d',
      colors: ['green'],
      letterSpacing: 0,
      align: 'center',
      space: false,
      lineHeight: 0
    })

    const { string: name } = cfonts.render(config.name, { font: 'console', colors: ['green'] })
    const { string: info } = cfonts.render(`${config.name} server listening at http://${addr.address}:${addr.port}`, {
      font: 'console',
      align: 'center',
      // space: false,
      lineHeight: 1
    })

    console.log(info.replace(config.name, name.trim()))
  })

  server.listen(config.server.binding.port, config.server.binding.ip)
}

module.exports = { start }
