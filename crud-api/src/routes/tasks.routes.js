// ROUTE (HTTP) LAYER — the thin translator between HTTP and the service.
// Each handler does only three things: read what it needs from the request,
// call the service, and shape the HTTP response (status code + JSON). No
// business rules, no data access. If the service throws, we hand the error
// to Express with next(err) and the error-handler middleware sets the status.

const express = require('express');
const service = require('../services/tasks.service');

const router = express.Router();

router.get('/tasks', (req, res, next) => {
  try {
    const tasks = service.listTasks();
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

router.get('/tasks/:id', (req, res, next) => {
  try {
    const task = service.getTask(Number(req.params.id));
    res.json(task);
  } catch (err) {
    next(err);
  }
});

router.post('/tasks', (req, res, next) => {
  try {
    const task = service.createTask(req.body ?? {});
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

router.put('/tasks/:id', (req, res, next) => {
  try {
    const task = service.updateTask(Number(req.params.id), req.body ?? {});
    res.json(task);
  } catch (err) {
    next(err);
  }
});

router.delete('/tasks/:id', (req, res, next) => {
  try {
    service.deleteTask(Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;