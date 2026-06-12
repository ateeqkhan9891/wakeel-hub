# WakeelHub Pakistan - Production Schema Notes

`schema.sql` is a **single, idempotent, copy-paste script** for the Supabase
SQL Editor. Paste the whole file, run it once on a fresh project, done.
It contains **no demo/seed data** - only reference master data (provinces,
cities, practice areas, courts).

---

## 1. How to deploy

1. Create a fresh Supabase project.
2. Open **SQL Editor → New query**.
3. Paste the entire contents of `supabase/schema.sql` and **Run**.
4. (Optional) Re-run any time - it is safe and idempotent.

`seed.sql` is intentionally empty (documentation only). Reference data is
created by `schema.sql`.

No SQL setup is needed for Storage - the script creates the four buckets
and their policies automatically.

---

## 2. What changed from the old schema (migration notes)

| Area | Old | New (production) | Why |
|---|---|---|---|
| **Identity table** | `users` with separate `id` + `auth_user_id` FK | `profiles` with `id` = `auth.users.id` (1:1) | Canonical Supabase pattern; every RLS check becomes a fast `auth.uid() = id` instead of a subquery. |
| **clients / lawyers PK** | own `id` + `user_id` FK | `id` **is** the profile id (`clients.id = lawyers.id = profiles.id = auth.uid()`) | Scoping bookings/cases/payments becomes `lawyer_id = auth.uid()`. |
| **Lawyer verified flag** | `verified` | `is_verified` (+ `is_active`) | Consistency, supports soft-disable. |
| **Settings** | none | new `lawyer_settings` (fees, availability, visibility, notification prefs) | Matches the lawyer **Settings** page; `online_consultation_fee` defaults to **2000**. |
| **Bookings** | `mode`/`status` Title-case, no payment/notes/reason fields | full set: `issue_summary`, `mode`, `payment_status`, `lawyer_notes`, `client_notes`, `cancellation_reason`, `reschedule_reason`, `meeting_link` | Matches lawyer **Bookings** page. |
| **Messaging** | flat `messages` with `thread_id` | `conversations` + `messages` + `message_attachments` | Proper threading scoped to a client+lawyer (optionally a booking/case). |
| **Cases** | basic | adds `opposing_party`, `priority`, `case_notes` (private), richer `hearing_dates`, polymorphic `documents` | Matches lawyer **Cases** page. |
| **Payments** | single `amount`, `payer/payee` | `total_amount` + `paid_amount` + generated `remaining_amount`, `payment_type`, `method`, `due_date`, `created_by/updated_by` | Real-world editable ledger; matches **Payments** page. |
| **Invoices** | none | new `invoices` table | Invoice/reference numbering. |
| **Notifications** | `description`, `read` | `body`, `is_read`, `related_entity_type/id`, adds `hearing`/`verification` types | Matches **Notifications** page. |
| **Verification** | `verification_requests` only | adds `verification_documents`, `enrollment_number`, `bar_council_name`, `chamber_address`, `not_submitted` status, `rejection_reason` | CNIC/license/chamber-proof uploads. |
| **Reference data** | cities/provinces as free text | normalized `provinces`, `cities`, `courts` tables | Real master data. |
| **Public access** | public `select` directly on `lawyers` | `lawyer_directory` **view** (safe columns, PII-aware) | Never leaks `email`/`phone` unless the lawyer opted in. |
| **Storage** | not defined | 4 buckets + RLS | Private docs by default. |
| **Seed/demo data** | 2 admins, 4 clients, 4 lawyers, bookings, cases, payments... | **removed entirely** | Production requirement. |

### Enum value changes (important for the app's string literals)

The DB now uses lowercase `snake_case` enum values. The app's current
**mock** TypeScript literals use different casing. When you wire the UI to
the DB, map between them (or update the literals):

| Concept | App mock literal(s) | DB enum value |
|---|---|---|
| Consultation mode | `"Online"`, `"In-person"`, `"Video"`, `"Phone"` | `online`, `in_person`, `phone` |
| Booking status | `"new-request"`, `"confirmed"`, `"completed"`, `"cancelled"` | `pending`, `confirmed`, `completed`, `cancelled`, `rejected`, `rescheduled` |
| Case status | `"in-progress"`, `"active"`, `"won"`, `"lost"`, `"adjourned"`, `"closed"`, `"pending"`, `"archived"` | `in_progress` (hyphen → underscore); rest match |
| Payment status | `"partially-paid"`, `"overdue"` | `partially_paid`, `overdue` (hyphen → underscore) |
| Payment method | `"bank-transfer"` | `bank_transfer` |
| Payment type | `"consultation-fee"`, `"case-fee"`, ... | `consultation_fee`, `case_fee`, ... (hyphen → underscore) |
| Verification status | `"not-submitted"`, `"pending-review"`, `"verified"`, `"rejected"` | `not_submitted`, `pending`, `approved`, `rejected` |

A tiny mapping helper (e.g. `slug.replace(/-/g, "_")` plus an explicit map
for the `new-request → pending` / `verified → approved` cases) keeps the UI
labels untouched.

---

## 3. App code already updated for the new schema

- **`src/lib/supabase/auth.ts`** - `getCurrentAppUser()` now reads
  `from("profiles")` filtered by `id = auth.user.id` (was `from("users")`
  by `auth_user_id`). `signUp()` metadata is unchanged and is consumed by
  the new `handle_new_user()` trigger.
- **`src/lib/supabase/types.ts`** - regenerated typed surface for
  `profiles`, `lawyers`, `lawyer_settings`, `bookings`, `cases`,
  `payments`, `notifications`, the `lawyer_directory` view, the `is_admin`
  function, and all enums.

Both compile cleanly (`npx tsc --noEmit` passes).

---

## 4. App code still TODO (services/queries to wire up)

These pages currently render from **mock data** and must be pointed at
Supabase (each query MUST be scoped by the authenticated user):

- **`src/lib/lawyer-dashboard-data.ts`** → replace
  `getCurrentLawyerDashboardData()` with real queries:
  ```ts
  const { data: { user } } = await supabase.auth.getUser();
  // user.id === lawyers.id === profiles.id
  const lawyerId = user.id;

  const [profile, settings, bookings, cases, payments, notifications, convos] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", lawyerId).single(),
      supabase.from("lawyer_settings").select("*").eq("lawyer_id", lawyerId).single(),
      supabase.from("bookings").select("*").eq("lawyer_id", lawyerId).order("scheduled_date"),
      supabase.from("cases").select("*").eq("lawyer_id", lawyerId),
      supabase.from("payments").select("*").eq("lawyer_id", lawyerId),
      supabase.from("notifications").select("*").eq("user_id", lawyerId).eq("is_read", false),
      supabase.from("conversations").select("*, messages(count)").eq("lawyer_id", lawyerId),
    ]);
  ```
  RLS already guarantees a lawyer can only read their own rows, but always
  filter explicitly anyway. A brand-new lawyer returns empty arrays for
  every list and a `lawyer_settings` row with `online_consultation_fee = 2000`
  → the existing empty-state UI renders unchanged.

- **Client dashboard** (`src/app/dashboard/client/*`) → same pattern with
  `eq("client_id", user.id)` / `eq("user_id", user.id)`.

- **Admin dashboard** (`src/app/dashboard/admin/*`) → admins pass `is_admin()`
  RLS, so unfiltered selects return everything (e.g.
  `supabase.from("verification_requests").select("*, lawyers(...)")`).

- **Public pages** (`/find-lawyers`, `/lawyers/[slug]`) → read the
  **`lawyer_directory`** view (works for anon users), e.g.
  `supabase.from("lawyer_directory").select("*").eq("slug", slug).single()`.

- **Lawyer profile + practice areas/courts** → write through
  `lawyer_practice_areas` / `lawyer_courts` join tables.

- **Document/avatar uploads** → upload to the matching Storage bucket using
  a path that starts with the user's uid, e.g.
  `supabase.storage.from("case-documents").upload(`${user.id}/${file.name}`, file)`.
  Storage RLS enforces the `<uid>/...` prefix.

---

## 5. Security model summary

- **profiles / clients / lawyers (base rows):** owner + admin only.
  Public lawyer data is served exclusively through the
  `lawyer_directory` view (safe columns; email/phone only if opted in).
- **bookings / cases / payments / conversations:** readable only by the
  linked client, the linked lawyer, or an admin.
- **case_notes:** lawyer-only - clients can **never** read them.
- **messages:** only the two conversation participants (and admins).
- **notifications:** only the owner.
- **documents / verification documents:** private by default; Storage
  policies require the `<auth.uid()>/...` path prefix; admins may read all.
- **reference data (provinces/cities/practice_areas/courts):** world-readable,
  admin-writable.
- **admins** (`profiles.role = 'admin'`, checked via the
  `SECURITY DEFINER` `is_admin()` helper) can manage everything.

> First admin: sign the account up normally, then promote it once:
> `update public.profiles set role = 'admin' where email = 'you@domain.com';`
> (or set `role: 'admin'` in the signup metadata for that one account).
