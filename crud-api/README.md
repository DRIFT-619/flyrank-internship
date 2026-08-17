# Task API — CRUD Assignment

A REST API for managing a to-do list, built with Node.js and Express as
part of the FlyRank AI Backend Engineering internship (Backend Track).

Supports full CRUD (Create, Read, Update, Delete) on a task list. Storage
has evolved across three assignments in this same repo:

| Assignment | Storage | Status |
|---|---|---|
| A1 | In-memory array | Gone on restart |
| A2 | SQLite (`tasks.db`) | Survives restart, single file |
| A3 | PostgreSQL, containerized | Survives restart, real database server |

The API and its behavior never changed across any of these — only the
`repositories/tasks.repository.js` file did, each time.

## Tech stack

- Node.js + Express
- PostgreSQL 16, running in Docker
- `pg` (node-postgres) as the database driver
- Docker + Docker Compose for one-command startup
- Swagger UI (via `swagger-ui-express`) for interactive API docs

## Project Structure

```
crud-api/
│
├── src/
│   ├── app.js
│   ├── server.js
│   ├── errors.js
│   │
│   ├── routes/
│   │   ├── meta.routes.js
│   │   └── tasks.routes.js
│   │
│   ├── services/
│   │   └── tasks.service.js
│   │
│   ├── repositories/
│   │   └── tasks.repository.js
│   │
│   └── middleware/
│       └── error-handler.js
│
├── openapi.json
├── package.json
├── package-lock.json
├── Dockerfile
├── compose.yaml
├── .dockerignore
├── .env.example
├── README.md
└── .gitignore
```
> `.env` (real secrets) and `tasks.db` (leftover from A2) are git-ignored.
> `.env.example` is committed with placeholder values.

## Architecture

This project follows a layered architecture:

- **routes/** — thin HTTP handlers (read request, call service, shape response)
- **services/** — business rules and validation
- **repositories/** — data access (currently PostgreSQL)
- **errors.js** + **middleware/** — typed domain errors mapped to HTTP status codes

Each storage swap (memory → SQLite → Postgres) only ever required changing
`repositories/tasks.repository.js`. The routes and services layers have
been untouched since the original layered refactor, because they only
call `findAll` / `findById` / `create` / `update` / `remove` and never
cared what was behind them.

## How to run it

**Requirements:** Docker Desktop (or Podman) installed and running.

```bash
git clone <repository-url>
cd flyrank-internship/crud-api
docker compose up
```

That's it — one command starts both the API and its Postgres database.
The `tasks` table and 3 seed tasks are created automatically on first run.

Server runs on `http://localhost:3000`.

To stop everything:

```bash
docker compose down
```

(Add `-v` to also delete the database volume and start completely fresh
next time: `docker compose down -v`.)

## Configuration

Database connection details are read from environment variables. Copy the
example file and adjust if needed:

```bash
cp .env.example .env
```

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection string |

`.env` is git-ignored — real credentials are never committed. When running
via `docker compose up`, the `DATABASE_URL` is set directly in
`compose.yaml` instead (pointing at the `db` service by name), so `.env`
is only needed if running the app outside Docker.

## Running without Docker (optional)

If you'd rather run Postgres yourself and the app directly with Node:

```bash
docker run --name taskdb -e POSTGRES_PASSWORD=dev -e POSTGRES_DB=tasks -p 5433:5432 -v taskdata:/var/lib/postgresql/data -d postgres:16
```

Update `.env` to point at whichever port you used, then:

```bash
npm install
npm start
```

## Endpoints

| Method | Path          | Description                        |
|--------|---------------|-------------------------------------|
| GET    | `/`           | API info                           |
| GET    | `/health`     | Health check                       |
| GET    | `/tasks`      | List all tasks                     |
| GET    | `/tasks/:id`  | Get a single task by id             |
| POST   | `/tasks`      | Create a new task                  |
| PUT    | `/tasks/:id`  | Update a task's title and/or done  |
| DELETE | `/tasks/:id`  | Delete a task                      |

## Example request

```bash
curl -i -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d "{\"title\":\"Buy milk\"}"
```

## Database

Tasks are stored in PostgreSQL, running as its own container (not a file
on disk, unlike the SQLite version in A2). Data persists across restarts
via a named Docker volume (`taskdata`) — the container itself can be
deleted and recreated, and the data survives as long as the volume isn't
also removed.

**Why Postgres in Docker:** no local Postgres install required, no version
conflicts between machines, and it behaves identically whether it's
running on my machine or anyone else's — the exact problem containers are
built to solve.

**Persistence proof:** created a task, ran `docker compose down` (which
fully removes both containers), then `docker compose up` again — the
task was still there, because the volume, not the container, is what
holds the data.

### Example query

```sql
SELECT * FROM tasks;
```

Run via `docker exec -it crud-api-db-1 psql -U postgres -d tasks -c "SELECT * FROM tasks;"` —
returned all tasks, confirming the API and a direct database query see
identical data.

![Database showing the tasks table](./db-screenshot.png)

## Swagger UI

Interactive docs available at `http://localhost:3000/docs` once the server is running.

![Swagger UI showing all Task API endpoints](./swagger-ui-screenshot.png)

## Author

Ayush Saxena <br/>
FlyRank Backend AI Engineering Intern