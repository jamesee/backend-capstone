const express = require('express')
const Task = require('../models/task')

module.exports = (db) => {
  const router = express.Router()
  function isInteger(n) { return /^\+?(0|[1-9]\d*)$/.test(n); } 

  router.get('/:todo_id/tasks/:task_id', async (req, res, next) => {
    const {uid, username } = req
    console.log(req.params)
    res.status(200).json(req.params)
  })

  return router
}