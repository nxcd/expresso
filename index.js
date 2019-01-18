'use strict'

const cors = require('cors')
const env = require('sugar-env')
const helmet = require('helmet')
const express = require('express')
const routes = require('./routes')
const bodyParser = require('body-parser')
const makeConfig = require('./makeConfig')
const middlewares = require('./middlewares')

/**
 * @param  {Function} fn  Function to expresso user can handle the app express instance
 */
module.exports = (fn) => {
  return async (options, environment) => {
    if (environment !== env.TEST) {
      process.on('unhandledRejection', (err) => {
        console.error(err)
        process.exit(1)
      })
    }

    const config = makeConfig(options, environment)

    const app = express()

    app.use(middlewares.deeptrace.factory(config.deeptrace))
    app.use(helmet())
    app.use(cors(config.cors))
    app.use(bodyParser.json())
    app.use(middlewares.onBehalfOf.factory())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(middlewares.morgan.factory(config.morgan, environment))

    app.get('/ping', routes.ping.factory(config))
    app.get('/teapot', routes.teapot.factory())

    await fn(app, config, environment)

    app.use('*', routes.unmatched.factory())

    app.use(middlewares.validationErrors.factory())
    app.use(middlewares.normalizer.factory())
    app.use(middlewares.stderr.factory())
    app.use(middlewares.renderer.factory(environment))

    return app
  }
}

module.exports.express = express
module.exports.makeConfig = makeConfig
module.exports.auth = require('./auth')
module.exports.server = require('./server')
module.exports.HttpError = require('./errors/http-error')
module.exports.validate = middlewares.validationSchema.factory
