'use strict'

/**
 * @return {Function} Middleware.
 */
const factory = () => (req, res, next) => {
  req.onBehalfOf = req.headers['x-on-behalf-of']
  next()
}

module.exports = { factory }
