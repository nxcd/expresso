'use strict'

const env = require('sugar-env')
const helmet = require('helmet')
const express = require('express')
const merge = require('lodash.merge')
const bodyParser = require('body-parser')

const routes = require('./routes')
const middlewares = require('./middlewares')

module.exports = (fn) => {
  return async (options, environment) => {
    if (environment !== env.TEST) {
      process.on('unhandledRejection', (err) => {
        console.error(err)
        process.exit(1)
      })
    }

    const config = merge({
      name: env.get(['APP_NAME', 'npm_package_name'], 'app'),
      version: env.get('GIT_RELEASE'),
      morgan: {
        format: ':method :url :status :: :response-time ms',
      }
    }, options)

    const app = express()

    app.use(helmet())
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(middlewares.morgan.factory(config.morgan))

    app.get('/ping', routes.ping.factory(config))
    app.get('/teapot', routes.teapot.factory())

    await fn(app, config, environment)

    app.use('*', routes.unmatched.factory())

    app.use(middlewares.stderr.factory())
    app.use(middlewares.normalizer.factory())
    app.use(middlewares.validationErrors.factory())
    app.use(middlewares.renderer.factory(environment))

    return app
  }
}

module.exports.server = require('./server')
module.exports.HttpError = require('./errors/http-error')
module.exports.express = express
