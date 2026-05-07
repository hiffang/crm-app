# Torch CRM

A lightweight lead management system built for small sales teams. Torch CRM lets you manage leads, track pipeline progress, add notes, and view dashboard metrics — all behind a secure login.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Database | SQLite (via Prisma ORM) |
| Authentication | NextAuth.js (credentials + JWT) |
| Styling | Tailwind CSS |

---

## Features

- Email/password authentication with protected routes
- Full lead CRUD — create, view, edit, and delete leads
- Inline status updates directly from the lead detail page
- Lead notes with author name and timestamp
- Dashboard with pipeline metrics and deal value charts
- Filter leads by status, lead source, and assigned salesperson
- Search leads by name, company, or email

---

## How to Run Locally

**1. Clone the repository**

```bash
git clone https://github.com/your-username/crm-app.git
cd crm-app
```

**2. Install dependencies**

```bash
npm install
```

**3. Set up environment variables**

```bash
cp .env.example .env
```

Open `.env` and fill in the values (see Environment Variables below).

**4. Run database migrations**

```bash
npx prisma migrate dev --name init
```

**5. Seed the database**

```bash
npx prisma db seed
```

**6. Start the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create a `.env` file at the project root with the following values:

```
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret-here"
```

To generate a secure `NEXTAUTH_SECRET`, run:

```bash
openssl rand -base64 32
```

---

## Test Login Credentials

```
Email:    admin@example.com
Password: password123
```

---

## Database Setup

The app uses Prisma with SQLite for local development. The database is stored as a single file (`dev.db`) in the project root.

The schema is defined in `prisma/schema.prisma` and includes three models:

- `User` — stores salesperson accounts
- `Lead` — stores lead records with all pipeline fields
- `Note` — stores internal notes linked to a lead and author

After running `prisma migrate dev`, the database file is created automatically. Running `prisma db seed` populates it with one admin user and three sample leads.

**Useful Prisma commands:**

```bash
npx prisma studio          # Browse the database in a UI
npx prisma migrate reset   # Wipe and re-run all migrations
npx prisma db seed         # Re-seed sample data
```

---

## Project Structure

```
app/
├── api/
│   ├── auth/[...nextauth]/   # NextAuth handler
│   ├── dashboard/            # Dashboard stats endpoint
│   ├── leads/                # Lead CRUD endpoints
│   │   └── [id]/notes/       # Notes endpoint
│   └── users/                # Users list endpoint
├── components/               # Shared UI components
├── dashboard/                # Dashboard page
├── leads/                    # Lead list, detail, create, edit pages
├── login/                    # Login page
└── settings/                 # Settings page
lib/
├── auth.ts                   # NextAuth configuration
└── prisma.ts                 # Prisma client singleton
prisma/
├── schema.prisma             # Database schema
└── seed.ts                   # Seed script
```

---

## Known Limitations

- SQLite works well for local development but is not suitable for a deployed multi-user environment. A production deployment should use PostgreSQL or MySQL via a hosted provider such as Supabase or PlanetScale.
- There is currently no role-based access control. Any authenticated user can edit or delete any lead.
- The lead source field accepts free text input. A future improvement would be to enforce a fixed dropdown of sources for cleaner filtering and reporting.
- No email notifications or reminders are implemented.

---

## Reflection

The main goal of this project was to build a CRM that reflects how a real sales team would actually use one — not just a CRUD demo. That meant focusing on the workflow: a lead has a status, an assigned owner, a source, and a running log of notes from calls and follow-ups.

The most interesting technical challenge was handling Next.js 15's async `params` in dynamic route segments, which is a change from earlier versions. Another decision worth noting is using server components for the leads list and dashboard pages — data is fetched directly from Prisma on the server rather than via client-side fetch calls, which keeps the data always fresh without needing client state management.

If I were to extend this further, I would add a Kanban view for the pipeline, lead aging indicators for stale leads, and a CSV export for reporting.

---

## Demo Video

[Add your demo video link here]

## Deployed Application

[https://crm-app-five-psi.vercel.app/](https://crm-app-five-psi.vercel.app/)
