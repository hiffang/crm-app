# Atlas CRM

Lightweight CRM built with Next.js, Prisma, and SQLite. Includes authentication, lead management, notes, dashboard metrics, and filters.

## Requirements

- Node.js 20+
- npm

## Setup

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

## Test Account

- Email: `admin@example.com`
- Password: `password123`

## Useful Commands

- `npx prisma db seed` - re-seed the database
- `npx prisma studio` - browse the database
- `npm run lint` - lint the project
