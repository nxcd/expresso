'use strict'

const env = require('sugar-env')
const merge = require('lodash.merge')

function makeConfig (options, environment) {
  return merge({
    name: env.get(['APP_NAME', 'npm_package_name'], 'app'),
    version: env.get('GIT_RELEASE'),
    deeptrace: {
      dsn: env.get('DEEPTRACE_DSN'),
      shouldSendCallback: () => true,
      timeout: parseInt(env.get('DEEPTRACE_TIMEOUT', 3000)),
      tags: {
        environment,
        service: env.get('DEEPTRACE_TAGS_SERVICE', options.name),
        commit: env.get(['DEEPTRACE_TAGS_COMMIT', 'GIT_COMMIT']),
        release: env.get(['DEEPTRACE_TAGS_RELEASE', 'GIT_RELEASE'])
      }
    },
    morgan: {
      format: ':method :url :status :: :response-time ms :: :res[deeptrace-id]'
    },
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      preflightContinue: false,
      optionsSuccessStatus: 204
    }
  }, options)
}

module.exports = makeConfig
