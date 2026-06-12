# WakeelHub Pakistan

WakeelHub Pakistan is a production-oriented legal marketplace for Pakistan: clients find verified advocates, book paid consultations, message securely, track cases, download receipts, and use role-based dashboards. Lawyers manage bookings, cases, verification, earnings, payouts, profile settings, and notifications. Admins manage users, lawyer verification, reports, payments, and platform commission.

## Repository Layout

```txt
web/                 Next.js 16 App Router web app
mobile/              Expo React Native mobile app
supabase/            Shared Supabase schema, seed data, migrations, functions
packages/
  types/             Shared TypeScript domain types
  utils/             Shared formatting and commission helpers
  config/            Shared app constants and environment names
  ui/                Shared design tokens
docs/                Product and integration notes
```

## Stack

- Web: Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Radix, Framer Motion, lucide-react
- Mobile: Expo React Native, TypeScript, lucide-react-native, Expo-friendly service layer
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

Configure the mobile app with the same Supabase project:

```bash
cp mobile/.env.example mobile/.env
```

Apply the Supabase database scripts in order:

```bash
psql "$DATABASE_URL" -f supabase/schema.sql
psql "$DATABASE_URL" -f supabase/seed.sql
```

`supabase/schema.sql` is the production schema with RLS policies. `supabase/seed.sql` should be used for reference and development data only.

## Scripts

```bash
npm run web:dev        # Next.js dev server for /web
npm run web:build      # Production web build
npm run web:start      # Start built web app
npm run web:lint       # Lint web app
npm run web:typecheck  # Type-check web app

npm run mobile:dev        # Expo dev server for /mobile
npm run mobile:lint       # Lint mobile app
npm run mobile:typecheck  # Type-check mobile app

npm run lint       # Current default: web lint
npm run typecheck  # Current default: web typecheck
```

## Architecture Notes

- Web routes are grouped into marketing, auth, client dashboard, lawyer dashboard, and admin dashboard segments inside `web/src/app`.
- `web/src/proxy.ts` performs fast Supabase session refresh and role-aware redirects, while dashboard layouts call server-side guards for defense in depth.
- Production dashboard metrics are read from Supabase-scoped data modules. Empty states render when no records exist instead of fake numbers.
- Payment and commission data is modeled for gross amount, platform commission percentage and amount, lawyer net amount, gateway fee, payment status, payout status, transaction reference, receipt number, and invoice number.
- Mobile uses the same Supabase project and role model. The v1 app is a single WakeelHub app that switches client and lawyer flows after auth; admin mobile dashboards are intentionally out of scope for v1.

## Supabase

The shared backend lives in `supabase/`:

- `schema.sql`: tables, enums, indexes, triggers, RLS policies, storage buckets, and safe public views
- `seed.sql`: reference/development seed data
- `migrations/`: future migration files
- `functions/`: future Supabase Edge Functions

Never rely on client-side role checks alone. RLS, server-side guards, and scoped queries should all remain in place.
