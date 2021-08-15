const express = require('express')
const logger = require('morgan')

module.exports = (router) => {
  const app = express()
  app.use(express.json())
  app.use(logger('common'))
  app.use(router)
  return app
}