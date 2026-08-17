const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function initialize() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      done BOOLEAN NOT NULL DEFAULT FALSE
    )
  `);

  const { rows } = await pool.query('SELECT COUNT(*) AS count FROM tasks');
  const count = Number(rows[0].count);

  if (count === 0) {
    await pool.query(
      `INSERT INTO tasks (title, done) VALUES
        ('Buy milk', false),
        ('Walk the dog', false),
        ('Finish assignment', true)`
    );
  }
}

const ready = initialize();

async function findAll() {
  const { rows } = await pool.query('SELECT * FROM tasks ORDER BY id');
  return rows;
}

async function findById(id) {
  const { rows } = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
  return rows[0] || null;
}

async function create({ title, done }) {
  const { rows } = await pool.query(
    'INSERT INTO tasks (title, done) VALUES ($1, $2) RETURNING *',
    [title, done]
  );
  return rows[0];
}

async function update(id, changes) {
  const existing = await findById(id);
  if (!existing) return null;

  const merged = { ...existing, ...changes };

  const { rows } = await pool.query(
    'UPDATE tasks SET title = $1, done = $2 WHERE id = $3 RETURNING *',
    [merged.title, merged.done, id]
  );
  return rows[0];
}

async function remove(id) {
  const result = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
  return result.rowCount > 0;
}

module.exports = { findAll, findById, create, update, remove, ready };