const express = require('express')
const logger = require('morgan')
const apiErrorHandler = require('./errors/api-error-handler');

module.exports = (router) => {
  const app = express()

  app.use(express.json())
  app.use(logger('common'))
  app.use(express.static('public'))
  app.use(router)
  app.use(apiErrorHandler);
  return app
}