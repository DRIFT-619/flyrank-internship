const express = require('express');
const service = require('../services/tasks.service');

const router = express.Router();

router.get('/tasks', async (req, res, next) => {
  try {
    const tasks = await service.listTasks();
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

router.get('/tasks/:id', async (req, res, next) => {
  try {
    const task = await service.getTask(Number(req.params.id));
    res.json(task);
  } catch (err) {
    next(err);
  }
});

router.post('/tasks', async (req, res, next) => {
  try {
    const task = await service.createTask(req.body ?? {});
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

router.put('/tasks/:id', async (req, res, next) => {
  try {
    const task = await service.updateTask(Number(req.params.id), req.body ?? {});
    res.json(task);
  } catch (err) {
    next(err);
  }
});

router.delete('/tasks/:id', async (req, res, next) => {
  try {
    await service.deleteTask(Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;