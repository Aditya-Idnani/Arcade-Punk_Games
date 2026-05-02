# Arcade Games

Premium browser-based arcade platform with a dark neon cyberpunk aesthetic. Built with Next.js App Router (frontend), Express + Prisma (backend), and PostgreSQL.

## Stack

- Frontend: Next.js, Tailwind CSS, Framer Motion, Zustand
- Backend: Node.js, Express, Prisma ORM, JWT auth
- Database: PostgreSQL

## Features

- 15 playable mini games (required 10 included + optional extras)
- Dark neon UI with glassmorphism and animated particles
- JWT auth + guest mode
- Save scores, profile history, achievements
- Global leaderboard + cached leaderboard endpoint
- Quick Play random launch
- Responsive layout + keyboard/mouse game controls

## Monorepo Structure

- `frontend/` Next.js app
- `backend/` Express API + Prisma schema/migrations/seed

## Environment

1. Copy env examples:
   - `cp backend/.env.example backend/.env`
   - `cp frontend/.env.example frontend/.env.local`
2. Ensure PostgreSQL is running and `DATABASE_URL` is valid.

## Backend Setup

1. `cd backend`
2. `npm install`
3. `npx prisma generate`
4. `npx prisma migrate dev --name init`
5. `npm run prisma:seed`
6. `npm run dev`

Runs at `http://localhost:4000`.

## Frontend Setup

1. `cd frontend`
2. `npm install`
3. `npm run dev`

Runs at `http://localhost:3000`.

## API Endpoints

- Auth:
  - `POST /auth/register`
  - `POST /auth/login`
- Games:
  - `GET /games`
  - `GET /games/:id`
- Scores:
  - `POST /scores` (auth required)
  - `GET /scores/:gameId`
  - `GET /leaderboard`
- User:
  - `GET /profile` (auth required)
  - `GET /history` (auth required)

## Deployment

- Frontend ready for Vercel
- Backend + Postgres ready for Railway/Supabase

