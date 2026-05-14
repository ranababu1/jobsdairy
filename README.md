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
