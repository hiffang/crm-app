# Torch CRM

Torch CRM is a lightweight lead-management system built with Next.js, Prisma, and SQLite. It includes authentication, lead CRUD, notes, dashboard metrics, and filtering for a small sales team workflow.

## Project Overview

This app lets a sales user sign in, manage leads, update pipeline status, add internal notes, and review a simple dashboard with pipeline metrics.

## Tech Stack

- Next.js 16
- React 19
- Prisma ORM
- SQLite for local development
- NextAuth credentials login
- Tailwind CSS

## Features Implemented

- Email/password authentication with a test user
- Lead creation, viewing, editing, and deletion
- Lead status updates across the sales pipeline
- Lead notes with author and timestamp
- Dashboard metrics for lead counts and deal value
- Search and filtering by status, source, assigned salesperson, and text query

## How to Run Locally

1. Install dependencies

```bash
npm install
```

2. Create your environment file

```bash
cp .env.example .env
```

3. Run migrations and seed the database

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Set these values in `.env`:

- `DATABASE_URL` - local SQLite connection string
- `NEXTAUTH_URL` - the app URL, such as `http://localhost:3000`
- `NEXTAUTH_SECRET` - a long random secret used by NextAuth

## Test Login Credentials

- Email: `admin@example.com`
- Password: `password123`

## Database Setup

The app uses Prisma with SQLite during development. The schema is in [prisma/schema.prisma](prisma/schema.prisma). After installing dependencies, run Prisma migrate and seed to create the database and sample data.

## Known Limitations

- SQLite is fine for local development, but a hosted database is a better production choice for a Vercel deployment.
- The repository includes the required test account, but you should reset or replace seeded data before real use.
- If you deploy to Vercel, make sure `DATABASE_URL`, `NEXTAUTH_URL`, and `NEXTAUTH_SECRET` are set in the Vercel project environment variables.

## Reflection

This project focused on building a practical CRM workflow rather than a demo-only UI. The main challenge was keeping the app simple enough for the assessment while still covering authentication, CRUD, notes, filtering, and dashboard reporting.

The most useful design choice was keeping the lead and note flows close to real sales-team behavior: a lead has a status, an owner, a source, and a timeline of notes. The biggest tradeoff is that SQLite is fine for local development, but a hosted production database would be a better long-term choice for deployment.

## Demo Video

Add your public demo video link here before submission.

## Deployed Application

[https://crm-app-five-psi.vercel.app/](https://crm-app-five-psi.vercel.app/)

## Useful Commands

- `npx prisma db seed` - re-seed the database
- `npx prisma studio` - browse the database
- `npm run lint` - lint the project
