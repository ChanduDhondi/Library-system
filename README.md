# Fullstack Library (Express + Prisma + Postgres + React + Tailwind)

## Quickstart (without Docker)

### Backend

1. cd backend
2. cp .env.example .env and edit if needed
3. npm install
4. npx prisma generate
5. npx prisma migrate dev --name init
6. npm run prisma:seed
7. npm run dev

API: http://localhost:4001/api

### Frontend

1. cd frontend
2. npm install
3. npm run dev

Open http://localhost:3000

Seeded users:

- admin@example.com / adminpass
- user@example.com / userpass

## Quickstart (Docker Compose)

Run from repo root:
