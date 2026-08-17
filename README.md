# FlyRank Backend AI Engineering Internship

This repository contains my weekly assignments, projects, and learning progress completed during the FlyRank Backend Internship.

## Weekly Assignments

| Assignment | Storage | Status |
|---|---|---|
| [CRUD API using Node.js & Express](./crud-api) | In-memory | Completed |
| [Connected the API to a SQLite database](./crud-api) | SQLite | Completed |
| [Containerized the stack with Postgres + Docker](./crud-api) | PostgreSQL (Docker) | Completed |

All three assignments live in the same `crud-api` folder — same API, same
endpoints, three different storage backends swapped in underneath it.
See that project's own README for the full breakdown.

## Repository Structure

```
flyrank-internship
│
├── crud-api
│
└── final-capstone
```
Each week's assignment is self-contained with its own README and package configuration.

## Tech Stack

- JavaScript, Node.js, Express
- PostgreSQL (containerized via Docker) — current storage layer
- SQLite (via `better-sqlite3`) — used in an earlier assignment
- Docker + Docker Compose
- REST APIs, Swagger UI (via `swagger-ui-express`)
- Layered architecture (routes → services → repositories)
- Git & GitHub (branching, pull requests)


## Author

Ayush Saxena <br/>
FlyRank Backend AI Engineering Intern