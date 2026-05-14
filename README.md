# JobDairy

Personal Job Application Tracker and Career CRM built with Next.js, TypeScript, TanStack Query/Table, React Hook Form, Zod, DaisyUI, and Cloudflare-ready backend assets.

## Features Implemented

- GitHub OAuth authentication via Auth.js (NextAuth)
- Protected app routes with middleware
- Dark mode first UX with DaisyUI themes (`business` + `corporate`)
- Theme persistence in `localStorage` and no-flicker initialization script
- Dashboard metrics and lazy-loaded charts
- Companies CRUD + archive + tags + priorities
- Jobs CRUD and status tracking
- Applications CRUD and stage progression
- Resume library CRUD (URL-based file record for now)
- Analytics page with conversion KPIs and resume performance table
- Kanban board with drag-and-drop stage updates
- API route protection with session validation
- Cloudflare Worker + D1 + Drizzle schema/migration scaffolding

## Stack

- Frontend: Next.js App Router, TypeScript, Tailwind CSS v4, DaisyUI
- Forms/Validation: React Hook Form + Zod
- Data layer: TanStack Query + REST route handlers
- Tables: TanStack Table
- Charts: Recharts
- DnD: dnd-kit
- Auth: next-auth (GitHub provider)
- Cloudflare backend scaffold: Hono Worker + D1 + Drizzle + Wrangler

## Project Structure

- `src/app/*`: App Router pages and Next.js API routes
- `src/components/*`: UI, dashboard, and layout primitives
- `src/lib/*`: API client, hooks, validators, auth options, utilities
- `src/lib/server/*`: in-app store, error handling, auth guard
- `worker/src/index.ts`: Cloudflare Hono worker entrypoint
- `drizzle/schema.ts`: Drizzle schema
- `migrations/0001_initial.sql`: SQL migration
- `wrangler.toml`: Worker + D1 + R2 binding config

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create env file:

```bash
cp .env.example .env.local
```

3. Fill required values in `.env.local`:

- `AUTH_GITHUB_ID`
- `AUTH_GITHUB_SECRET`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

4. Start app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Cloudflare Setup (D1 + Worker)

1. Create D1 database:

```bash
wrangler d1 create jobdairy-db
```

2. Update `wrangler.toml` with your real `database_id` and `bucket_name`.

3. Apply migration locally:

```bash
npm run db:migrate
```

4. Apply migration remotely:

```bash
npm run db:migrate:remote
```

5. Run worker locally:

```bash
npm run worker:dev
```

6. Deploy worker:

```bash
npm run worker:deploy
```

## Notes on Current Architecture

- The web app currently uses Next.js route handlers as the active API runtime for local end-to-end usage.
- A Cloudflare Worker API scaffold is included in `worker/` for production migration.
- Resume uploads are represented as stored file URLs today; R2 upload flow can be added with signed upload endpoints.

## Quality Commands

```bash
npm run lint
npm run typecheck
```
