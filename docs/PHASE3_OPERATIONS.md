# Phase 3 Operations

WakeelHub now has versioned Supabase migrations, deterministic local/staging seed data, and a Playwright smoke test for the client booking/payment path.

## Supabase Migrations

The canonical schema remains `supabase/schema.sql` for SQL Editor bootstrap, and the same schema is split into:

- `supabase/migrations/202606110001_foundation.sql`
- `supabase/migrations/202606110002_application_schema.sql`
- `supabase/migrations/202606110003_reference_data.sql`

Apply them with the Supabase CLI in a disposable local/staging project:

```bash
supabase db reset
```

## Seed Data

`supabase/seed.sql` creates fake, deterministic local/staging users:

- Client: `client.e2e@wakeelhub.test` / `WakeelHub123!`
- Lawyer: `lawyer.e2e@wakeelhub.test` / `WakeelHub123!`
- Admin: `admin.e2e@wakeelhub.test` / `WakeelHub123!`

The seed also creates a verified active lawyer, public directory data, and a confirmed unpaid booking for sandbox payment testing. Do not run this seed against production.

## E2E Smoke

Install the Playwright browser once:

```bash
npx playwright install chromium
```

Run the smoke test:

```bash
npm run test:e2e
```

The test expects:

- The Supabase database has been reset/seeded.
- `PAYMENT_PROVIDER=sandbox`.
- `NEXT_PUBLIC_APP_URL` points at the app URL used by Playwright.
