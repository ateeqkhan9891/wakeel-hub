# WakeelHub Pakistan

WakeelHub Pakistan is a production-oriented legal marketplace for Pakistan: clients find verified advocates, book paid consultations, message securely, track cases, download receipts, and use role-based dashboards. Lawyers manage bookings, cases, verification, earnings, payouts, profile settings, and notifications. Admins manage users, lawyer verification, reports, payments, and platform commission.

## Repository Layout

```txt
web/                 Next.js 16 App Router web app
supabase/            Production Supabase schema, migrations, and Edge Functions
docs/                Product and integration notes
```

## Stack

- Web: Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Radix, Framer Motion, lucide-react
- Backend: one Supabase project for Auth, Postgres, Storage, RLS, profiles, bookings, payments, messages, cases, documents, notifications, and admin data
- Forms and validation: React Hook Form + Zod

## Setup

Install root dependencies:

```bash
npm install
```

Configure the web app:

```bash
cp web/.env.example web/.env.local
```

Apply the Supabase database scripts in order:

```bash
psql "$DATABASE_URL" -f supabase/schema.sql
```

`supabase/schema.sql` is the production schema with RLS policies and reference data.

## Scripts

```bash
npm run web:dev        # Next.js dev server for /web
npm run web:build      # Production web build
npm run web:start      # Start built web app
npm run web:lint       # Lint web app
npm run web:typecheck  # Type-check web app

npm run lint       # Current default: web lint
npm run typecheck  # Current default: web typecheck
```

## Architecture Notes

- Web routes are grouped into marketing, auth, client dashboard, lawyer dashboard, and admin dashboard segments inside `web/src/app`.
- `web/src/proxy.ts` performs fast Supabase session refresh and role-aware redirects, while dashboard layouts call server-side guards for defense in depth.
- Production dashboard metrics are read from Supabase-scoped data modules. Empty states render when no records exist instead of fake numbers.
- Payment and commission data is modeled for gross amount, platform commission percentage and amount, lawyer net amount, gateway fee, payment status, payout status, transaction reference, receipt number, and invoice number.
## Supabase

The shared backend lives in `supabase/`:

- `schema.sql`: tables, enums, indexes, triggers, RLS policies, storage buckets, and safe public views
- `migrations/`: versioned database migrations
- `functions/`: Supabase Edge Functions

Never rely on client-side role checks alone. RLS, server-side guards, and scoped queries should all remain in place.
