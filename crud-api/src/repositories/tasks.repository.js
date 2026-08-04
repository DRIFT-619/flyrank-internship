// REPOSITORY LAYER — the ONLY file that knows *where* tasks are stored.
// Right now that's a list in memory. This is the single file we will rewrite
// for Assignment 2 (SQLite) — the routes and the service will NEVER change,
// because they only ever call findAll / findById / create / update / remove.

const SEED_TASKS = [
  { id: 1, title: "Buy milk", done: false },
  { id: 2, title: "Walk the dog", done: false },
  { id: 3, title: "Finish assignment", done: true }
];

let tasks = SEED_TASKS.map((task) => ({ ...task }));

function findAll() {
  return tasks.map((task) => ({ ...task }));
}

function findById(id) {
  const task = tasks.find((t) => t.id === id);
  return task ? { ...task } : null;
}

function create({ title, done }) {
  const nextId = tasks.length > 0
    ? Math.max(...tasks.map((t) => t.id)) + 1
    : 1;

  const task = { id: nextId, title, done };
  tasks.push(task);
  return { ...task };
}

function update(id, changes) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return null;
  Object.assign(task, changes);
  return { ...task };
}

function remove(id) {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return false;
  tasks.splice(index, 1);
  return true;
}

module.exports = { findAll, findById, create, update, remove };