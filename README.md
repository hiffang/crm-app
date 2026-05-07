# Torch CRM

A lightweight lead management system built for small sales teams. Torch CRM lets you manage leads, track pipeline progress, add notes, and view dashboard metrics — all behind a secure login.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma 7 |
| Database Adapter | `@prisma/adapter-pg` |
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

**4. Push the schema to your database**

```bash
npx prisma db push
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
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres"
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret-here"
```

To generate a secure `NEXTAUTH_SECRET`, run:

```bash
openssl rand -base64 32
```

### Getting Your Supabase URLs

1. Go to [supabase.com](https://supabase.com) and create a free project
2. Navigate to **Settings → Database**
3. Under **Connection string**, copy the **URI** for `DATABASE_URL` (port 6543)
4. Under **Direct connection**, copy the URI for `DIRECT_URL` (port 5432)

---

## Test Login Credentials

```
Email:    admin@example.com
Password: password123
```

---

## Database Setup

The app uses Prisma 7 with PostgreSQL via Supabase. The schema is defined in `prisma/schema.prisma` and includes three models:

- `User` — stores salesperson accounts
- `Lead` — stores lead records with all pipeline fields
- `Note` — stores internal notes linked to a lead and author

**Initial setup:**

```bash
npx prisma db push       # Push schema to your database
npx prisma db seed       # Create admin user and sample leads
```

**Other useful commands:**

```bash
npx prisma studio        # Browse the database in a UI
npx prisma db push       # Sync schema changes to the database
npx prisma db seed       # Re-seed sample data
```

---

## Deploying to Vercel

**1. Push your code to a public GitHub repository**

**2. Import the project on [vercel.com](https://vercel.com)**

**3. Add the following environment variables in Vercel → Settings → Environment Variables:**

| Name | Value |
|---|---|
| `DATABASE_URL` | Your Supabase pooler URL (port 6543) |
| `DIRECT_URL` | Your Supabase direct URL (port 5432) |
| `NEXTAUTH_URL` | Your Vercel app URL e.g. `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | A long random string (generate with `openssl rand -base64 32`) |

> Important: `NEXTAUTH_URL` must not have a trailing slash.

**4. Redeploy**

Vercel will automatically run `prisma generate` via the `postinstall` script during the build.

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
└── login/                    # Login page
lib/
├── auth.ts                   # NextAuth configuration
└── prisma.ts                 # Prisma client singleton with pg adapter
prisma/
├── schema.prisma             # Database schema
└── seed.ts                   # Seed script
```

---

## Known Limitations

- There is currently no role-based access control. Any authenticated user can edit or delete any lead.
- Adding more users requires manually inserting them into the database via Supabase's SQL Editor or Prisma Studio.
- No email notifications or reminders are implemented.

---

## Reflection

The main goal of this project was to build a CRM that reflects how a real sales team would actually use one — not just a CRUD demo. That meant focusing on the workflow: a lead has a status, an assigned owner, a source, and a running log of notes from calls and follow-ups.

The most interesting technical challenge was working with Prisma 7, which introduced breaking changes to how database connections are configured — URLs must now be passed via a driver adapter rather than directly in the schema file. Migrating to PostgreSQL on Supabase for production also required careful handling of connection pooling versus direct connections, and understanding why `export const dynamic = "force-dynamic"` is necessary on data pages to prevent Next.js from attempting to pre-render them at build time before the database is reachable.

If I were to extend this further, I would add a Kanban view for the pipeline, lead aging indicators for stale leads, and a CSV export for reporting.

---

## Demo Video

[Demo Video](https://youtu.be/-BALG3u8BvI)

## Deployed Application

[https://crm-app-five-psi.vercel.app](https://crm-app-five-psi.vercel.app)
