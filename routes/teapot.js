'use strict'

const factory = () => {
  return (req, res) => {
    res.status(418)
      .send("I'm a teapot")
      .end()
  }
}

module.exports = { factory }
