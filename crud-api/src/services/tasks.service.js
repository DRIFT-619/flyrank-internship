const repo = require('../repositories/tasks.repository');
const { NotFoundError, ValidationError } = require('../errors');

async function listTasks() {
  return repo.findAll();
}

async function getTask(id) {
  const task = await repo.findById(id);
  if (!task) {
    throw new NotFoundError(`Task ${id} not found`);
  }
  return task;
}

async function createTask(body = {}) {
  const { title } = body;

  if (!title || title.trim() === "") {
    throw new ValidationError("title is required and cannot be empty");
  }

  return repo.create({ title: title.trim(), done: false });
}

async function updateTask(id, body = {}) {
  const { title, done } = body;

  const invalidTitle = title !== undefined && title.trim() === "";
  const invalidDone = done !== undefined && typeof done !== "boolean";

  if (invalidTitle || invalidDone) {
    throw new ValidationError("Invalid task data");
  }

  const changes = {};
  if (title !== undefined) changes.title = title.trim();
  if (done !== undefined) changes.done = done;

  const updated = await repo.update(id, changes);
  if (!updated) {
    throw new NotFoundError(`Task ${id} not found`);
  }
  return updated;
}

async function deleteTask(id) {
  const removed = await repo.remove(id);
  if (!removed) {
    throw new NotFoundError(`Task ${id} not found`);
  }
}

module.exports = { listTasks, getTask, createTask, updateTask, deleteTask };