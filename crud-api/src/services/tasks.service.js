// SERVICE LAYER — the business rules. Storage-agnostic and HTTP-agnostic.
// This is where the *decisions* live: what makes input valid, what "not
// found" means. It never touches req/res (that's the route's job) and never
// touches the tasks array directly (that's the repository's job) — it just
// calls the repository and throws domain errors when a rule is broken.

const repo = require('../repositories/tasks.repository');
const { NotFoundError, ValidationError } = require('../errors');

function listTasks() {
  return repo.findAll();
}

function getTask(id) {
  const task = repo.findById(id);
  if (!task) {
    throw new NotFoundError(`Task ${id} not found`);
  }
  return task;
}

function createTask(body = {}) {
  const { title } = body;

  if (!title || title.trim() === "") {
    throw new ValidationError("title is required and cannot be empty");
  }

  return repo.create({ title: title.trim(), done: false });
}

function updateTask(id, body = {}) {
  const { title, done } = body;

  const invalidTitle = title !== undefined && title.trim() === "";
  const invalidDone = done !== undefined && typeof done !== "boolean";

  if (invalidTitle || invalidDone) {
    throw new ValidationError("Invalid task data");
  }

  const changes = {};
  if (title !== undefined) changes.title = title.trim();
  if (done !== undefined) changes.done = done;

  const updated = repo.update(id, changes);
  if (!updated) {
    throw new NotFoundError(`Task ${id} not found`);
  }
  return updated;
}

function deleteTask(id) {
  const removed = repo.remove(id);
  if (!removed) {
    throw new NotFoundError(`Task ${id} not found`);
  }
}

module.exports = { listTasks, getTask, createTask, updateTask, deleteTask };