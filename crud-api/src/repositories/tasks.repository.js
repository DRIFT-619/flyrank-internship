const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, '..', '..', 'tasks.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done INTEGER NOT NULL DEFAULT 0
  )
`);

const row = db.prepare('SELECT COUNT(*) AS count FROM tasks').get();
if (row.count === 0) {
  const insertSeed = db.prepare('INSERT INTO tasks (title, done) VALUES (?, ?)');
  insertSeed.run('Buy milk', 0);
  insertSeed.run('Walk the dog', 0);
  insertSeed.run('Finish assignment', 1);
}

function toTask(row) {
  return { id: row.id, title: row.title, done: Boolean(row.done) };
}

function findAll() {
  const rows = db.prepare('SELECT * FROM tasks').all();
  return rows.map(toTask);
}

function findById(id) {
  const row = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  return row ? toTask(row) : null;
}

function create({ title, done }) {
  const result = db
    .prepare('INSERT INTO tasks (title, done) VALUES (?, ?)')
    .run(title, done ? 1 : 0);

  return findById(result.lastInsertRowid);
}

function update(id, changes) {
  const existing = findById(id);
  if (!existing) return null;

  const merged = { ...existing, ...changes };

  db.prepare('UPDATE tasks SET title = ?, done = ? WHERE id = ?')
    .run(merged.title, merged.done ? 1 : 0, id);

  return findById(id);
}

function remove(id) {
  const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  return result.changes > 0;
}

module.exports = { findAll, findById, create, update, remove };