-- =====================================================================
-- WakeelHub Pakistan - Application schema
-- Generated from supabase/schema.sql sections 4-17.
-- =====================================================================

-- 4. REFERENCE / MASTER DATA TABLES
-- =====================================================================

create table if not exists public.provinces (
  id    smallint generated always as identity primary key,
  slug  text not null unique,
  name  text not null
);

create table if not exists public.cities (
  id           smallint generated always as identity primary key,
  slug         text not null unique,
  name         text not null,
  province_id  smallint not null references public.provinces (id)
);

create index if not exists cities_province_idx on public.cities (province_id);

create table if not exists public.practice_areas (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  name         text not null,
  description  text,
  icon         text,
  is_active    boolean not null default true,
  sort_order   smallint not null default 0
);

create table if not exists public.courts (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  city_id    smallint references public.cities (id),
  court_type text,
  unique (name, city_id)
);

create index if not exists courts_city_idx on public.courts (city_id);


-- =====================================================================
-- 5. IDENTITY TABLES
-- =====================================================================
-- profiles.id == auth.users.id  (1:1).  This is the canonical Supabase
-- pattern and makes every RLS policy a simple `auth.uid()` comparison.
-- =====================================================================

create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text not null default '',
  email       text not null,
  phone       text,
  role        user_role not null default 'client',
  avatar_url  text,
  city        text,
  province    text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles (role);
create index if not exists profiles_city_idx on public.profiles (city);

-- Clients: 1:1 with a profile (client.id == profile.id == auth uid).
create table if not exists public.clients (
  id                  uuid primary key references public.profiles (id) on delete cascade,
  preferred_language  text,
  notes               text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Lawyers: 1:1 with a profile (lawyer.id == profile.id == auth uid).
create table if not exists public.lawyers (
  id                  uuid primary key references public.profiles (id) on delete cascade,
  slug                text not null unique,
  gender              gender,
  bar_council_number  text unique,
  bar_council_name    text,
  is_verified         boolean not null default false,
  verified_at         timestamptz,
  is_active           boolean not null default true,
  experience_years    integer not null default 0 check (experience_years >= 0 and experience_years <= 70),
  education           text[] not null default '{}',
  languages           text[] not null default '{}',
  about               text,
  headline            text,
  response_time       text,
  cases_handled       integer not null default 0,
  success_rate        numeric(5,2) not null default 0 check (success_rate >= 0 and success_rate <= 100),
  rating              numeric(3,2) not null default 0 check (rating >= 0 and rating <= 5),
  review_count        integer not null default 0,
  is_featured         boolean not null default false,
  joined_date         date not null default current_date,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists lawyers_verified_idx on public.lawyers (is_verified, is_active);
create index if not exists lawyers_slug_idx on public.lawyers (slug);

-- Extended public-facing lawyer profile content.
create table if not exists public.lawyer_profiles (
  lawyer_id     uuid primary key references public.lawyers (id) on delete cascade,
  photo_url     text,
  cover_url     text,
  social_links  jsonb not null default '{}'::jsonb,
  updated_at    timestamptz not null default now()
);

-- Per-lawyer settings (fees, availability, visibility, notifications).
-- A new lawyer is auto-provisioned a row with online fee defaulting to 2000.
create table if not exists public.lawyer_settings (
  lawyer_id                        uuid primary key references public.lawyers (id) on delete cascade,
  online_consultation_fee          numeric(12,2) not null default 2000 check (online_consultation_fee >= 0),
  in_person_consultation_fee       numeric(12,2) not null default 0 check (in_person_consultation_fee >= 0),
  follow_up_consultation_fee       numeric(12,2) check (follow_up_consultation_fee is null or follow_up_consultation_fee >= 0),
  consultation_duration_minutes    integer not null default 30 check (consultation_duration_minutes between 5 and 480),
  availability_days                text[] not null default '{}',
  availability_hours               text,
  accepts_online_consultations     boolean not null default true,
  accepts_in_person_consultations  boolean not null default false,
  show_phone_publicly              boolean not null default false,
  show_email_publicly              boolean not null default false,
  notify_bookings                  boolean not null default true,
  notify_messages                  boolean not null default true,
  notify_payments                  boolean not null default true,
  hearing_reminders                boolean not null default true,
  created_at                       timestamptz not null default now(),
  updated_at                       timestamptz not null default now()
);


-- =====================================================================
-- 6. LAWYER RELATIONSHIP TABLES
-- =====================================================================

create table if not exists public.lawyer_practice_areas (
  lawyer_id        uuid not null references public.lawyers (id) on delete cascade,
  practice_area_id uuid not null references public.practice_areas (id) on delete cascade,
  primary key (lawyer_id, practice_area_id)
);

create index if not exists lawyer_practice_areas_area_idx on public.lawyer_practice_areas (practice_area_id);

create table if not exists public.lawyer_courts (
  lawyer_id  uuid not null references public.lawyers (id) on delete cascade,
  court_id   uuid not null references public.courts (id) on delete cascade,
  primary key (lawyer_id, court_id)
);

create index if not exists lawyer_courts_court_idx on public.lawyer_courts (court_id);


-- =====================================================================
-- 7. VERIFICATION
-- =====================================================================

create table if not exists public.verification_requests (
  id                  uuid primary key default gen_random_uuid(),
  lawyer_id           uuid not null references public.lawyers (id) on delete cascade,
  enrollment_number   text not null,
  bar_council_name    text,
  chamber_address     text,
  status              verification_status not null default 'pending',
  reviewed_by         uuid references public.profiles (id),
  reviewed_at         timestamptz,
  rejection_reason    text,
  submitted_at        timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists verification_requests_lawyer_idx on public.verification_requests (lawyer_id);
create index if not exists verification_requests_status_idx on public.verification_requests (status);

create table if not exists public.verification_documents (
  id                       uuid primary key default gen_random_uuid(),
  verification_request_id  uuid not null references public.verification_requests (id) on delete cascade,
  doc_type                 verification_doc_type not null,
  storage_path             text not null,
  uploaded_at              timestamptz not null default now()
);

create index if not exists verification_documents_request_idx on public.verification_documents (verification_request_id);


-- =====================================================================
-- 8. BOOKINGS & CONSULTATIONS
-- =====================================================================

create table if not exists public.bookings (
  id                  uuid primary key default gen_random_uuid(),
  client_id           uuid not null references public.clients (id) on delete cascade,
  lawyer_id           uuid not null references public.lawyers (id) on delete cascade,
  practice_area_id    uuid references public.practice_areas (id),
  -- Denormalized snapshots taken at booking time so each party can see the
  -- other's name/contact without a cross-profile RLS read.
  client_name         text,
  client_phone        text,
  client_city         text,
  lawyer_name         text,
  practice_area_name  text,
  issue_summary       text,
  mode                consultation_mode not null default 'online',
  scheduled_date      date,
  scheduled_time      time,
  fee_amount          numeric(12,2) not null default 0 check (fee_amount >= 0),
  payment_status      payment_status not null default 'pending',
  status              booking_status not null default 'pending',
  meeting_link        text,
  lawyer_notes        text,
  client_notes        text,
  cancellation_reason text,
  reschedule_reason   text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Upgrade existing installs (no-op on a fresh database).
alter table public.bookings add column if not exists client_name        text;
alter table public.bookings add column if not exists client_phone       text;
alter table public.bookings add column if not exists client_city        text;
alter table public.bookings add column if not exists lawyer_name        text;
alter table public.bookings add column if not exists practice_area_name text;

-- Free-text courts the lawyer maintains on their own profile.
alter table public.lawyers add column if not exists courts text[] not null default '{}';

-- Extended lawyer profile fields (basic, professional, office, JSONB lists).
alter table public.lawyers add column if not exists date_of_birth        date;
alter table public.lawyers add column if not exists professional_title   text;
alter table public.lawyers add column if not exists office_name          text;
alter table public.lawyers add column if not exists office_address       text;
alter table public.lawyers add column if not exists google_maps_link     text;
alter table public.lawyers add column if not exists bar_enrollment_year  integer;
alter table public.lawyers add column if not exists license_number       text;
alter table public.lawyers add column if not exists education_entries    jsonb not null default '[]'::jsonb;
alter table public.lawyers add column if not exists experience           jsonb not null default '[]'::jsonb;
alter table public.lawyers add column if not exists achievements         jsonb not null default '[]'::jsonb;
alter table public.lawyers add column if not exists publications         jsonb not null default '[]'::jsonb;
alter table public.lawyers add column if not exists total_consultations  integer not null default 0;
alter table public.lawyers add column if not exists response_rate        numeric(5,2) not null default 0;

-- Subscription / billing gating: a lawyer is only public to clients once
-- their subscription is active (Pro paid, or commission plan chosen).
alter table public.lawyers add column if not exists subscription_plan       text;            -- null | 'pro' | 'commission'
alter table public.lawyers add column if not exists subscription_period     text;            -- null | 'monthly' | 'annual' | 'commission'
alter table public.lawyers add column if not exists subscription_status     text not null default 'inactive'; -- 'inactive' | 'active'
alter table public.lawyers add column if not exists subscription_started_at timestamptz;
alter table public.lawyers add column if not exists subscription_expires_at timestamptz;

-- Subscription payment / invoice history for advocates.
create table if not exists public.subscription_payments (
  id               uuid primary key default gen_random_uuid(),
  lawyer_id        uuid not null references public.lawyers (id) on delete cascade,
  plan             text not null,
  period           text not null,
  amount           numeric(12,2) not null default 0,
  reference_number text not null unique default ('SUB-' || to_char(now(),'YYYY') || '-' || upper(substr(gen_random_uuid()::text,1,8))),
  invoice_number   text not null unique default ('INV-SUB-' || to_char(now(),'YYYY') || '-' || upper(substr(gen_random_uuid()::text,1,8))),
  status           text not null default 'paid',
  paid_at          timestamptz not null default now(),
  created_at       timestamptz not null default now()
);

alter table public.subscription_payments alter column status set default 'pending';
alter table public.subscription_payments alter column paid_at drop not null;

create index if not exists subscription_payments_lawyer_idx on public.subscription_payments (lawyer_id);

alter table public.subscription_payments enable row level security;

drop policy if exists "sub payments self manage" on public.subscription_payments;
drop policy if exists "sub payments self read" on public.subscription_payments;
create policy "sub payments self read" on public.subscription_payments
  for select using (lawyer_id = auth.uid() or public.is_admin());

drop policy if exists "sub payments self checkout insert" on public.subscription_payments;
create policy "sub payments self checkout insert" on public.subscription_payments
  for insert with check (lawyer_id = auth.uid() and status = 'pending');

drop policy if exists "sub payments admin update" on public.subscription_payments;
create policy "sub payments admin update" on public.subscription_payments
  for update using (public.is_admin()) with check (public.is_admin());

-- =====================================================================
-- Commission-based payments
-- =====================================================================
-- Platform settings (singleton row id=1): configurable commission etc.
create table if not exists public.platform_settings (
  id                        int primary key default 1 check (id = 1),
  commission_percentage     numeric(5,2) not null default 20,
  gateway_fee_percentage    numeric(5,2) not null default 0,
  currency                  text not null default 'PKR',
  updated_at                timestamptz not null default now()
);

insert into public.platform_settings (id) values (1) on conflict (id) do nothing;

alter table public.platform_settings enable row level security;
-- Readable by any signed-in user (needed to compute the split at checkout);
-- only admins can change it.
drop policy if exists "platform settings read" on public.platform_settings;
create policy "platform settings read" on public.platform_settings for select using (auth.uid() is not null);
drop policy if exists "platform settings admin write" on public.platform_settings;
create policy "platform settings admin write" on public.platform_settings for all using (public.is_admin()) with check (public.is_admin());

-- One row per paid consultation. The single source of truth behind the
-- client receipt, lawyer earning statement, and admin commission record.
create table if not exists public.consultation_payments (
  id                             uuid primary key default gen_random_uuid(),
  booking_id                     uuid not null references public.bookings (id) on delete cascade,
  client_id                      uuid not null references public.clients (id) on delete cascade,
  lawyer_id                      uuid not null references public.lawyers (id) on delete cascade,
  gross_amount                   numeric(12,2) not null default 0,
  platform_commission_percentage numeric(5,2) not null default 0,
  platform_commission_amount     numeric(12,2) not null default 0,
  lawyer_net_amount              numeric(12,2) not null default 0,
  gateway_fee                    numeric(12,2) not null default 0,
  currency                       text not null default 'PKR',
  payment_status                 text not null default 'pending',  -- pending | paid | failed | refunded
  payout_status                  text not null default 'pending',  -- pending | processing | paid | failed | cancelled
  provider                       text not null default 'manual',
  transaction_reference          text not null unique default ('TXN-' || to_char(now(),'YYYYMMDD') || '-' || upper(substr(gen_random_uuid()::text,1,8))),
  receipt_number                 text not null unique default ('RCPT-' || to_char(now(),'YYYY') || '-' || upper(substr(gen_random_uuid()::text,1,8))),
  paid_at                        timestamptz,
  payout_at                      timestamptz,
  created_at                     timestamptz not null default now(),
  updated_at                     timestamptz not null default now(),
  unique (booking_id)
);

create index if not exists consultation_payments_client_idx on public.consultation_payments (client_id);
create index if not exists consultation_payments_lawyer_idx on public.consultation_payments (lawyer_id);
create index if not exists consultation_payments_payout_idx on public.consultation_payments (payout_status);

alter table public.consultation_payments enable row level security;

-- Client and lawyer can read their own rows; admin reads all.
drop policy if exists "consult pay read" on public.consultation_payments;
create policy "consult pay read" on public.consultation_payments for select using (
  client_id = auth.uid() or lawyer_id = auth.uid() or public.is_admin()
);
-- The paying client creates the record.
drop policy if exists "consult pay client insert" on public.consultation_payments;
create policy "consult pay client insert" on public.consultation_payments for insert with check (client_id = auth.uid() and payment_status = 'pending');
-- Only admins change payout/payment status afterwards.
drop policy if exists "consult pay admin update" on public.consultation_payments;
create policy "consult pay admin update" on public.consultation_payments for update using (public.is_admin()) with check (public.is_admin());

-- Extended consultation settings.
alter table public.lawyer_settings add column if not exists phone_consultation_fee   numeric(12,2) not null default 0;
alter table public.lawyer_settings add column if not exists free_initial_consultation boolean not null default false;
alter table public.lawyer_settings add column if not exists availability_slots       text[] not null default '{}';

create index if not exists bookings_client_idx on public.bookings (client_id);
create index if not exists bookings_lawyer_idx on public.bookings (lawyer_id);
create index if not exists bookings_status_idx on public.bookings (status);
create index if not exists bookings_scheduled_idx on public.bookings (scheduled_date);

create table if not exists public.consultations (
  id                  uuid primary key default gen_random_uuid(),
  booking_id          uuid not null unique references public.bookings (id) on delete cascade,
  started_at          timestamptz,
  ended_at            timestamptz,
  summary             text,
  follow_up_required  boolean not null default false,
  created_at          timestamptz not null default now()
);


-- =====================================================================
-- 9. MESSAGING
-- =====================================================================

create table if not exists public.conversations (
  id              uuid primary key default gen_random_uuid(),
  client_id       uuid not null references public.clients (id) on delete cascade,
  lawyer_id       uuid not null references public.lawyers (id) on delete cascade,
  booking_id      uuid references public.bookings (id) on delete set null,
  case_id         uuid,  -- FK added after cases table is created (see ALTER below)
  last_message_at timestamptz,
  created_at      timestamptz not null default now()
);

create index if not exists conversations_client_idx on public.conversations (client_id);
create index if not exists conversations_lawyer_idx on public.conversations (lawyer_id);

create table if not exists public.messages (
  id               uuid primary key default gen_random_uuid(),
  conversation_id  uuid not null references public.conversations (id) on delete cascade,
  sender_id        uuid not null references public.profiles (id) on delete cascade,
  body             text not null,
  is_read          boolean not null default false,
  created_at       timestamptz not null default now()
);

create index if not exists messages_conversation_idx on public.messages (conversation_id, created_at);
create index if not exists messages_unread_idx on public.messages (conversation_id, is_read);

create table if not exists public.message_attachments (
  id            uuid primary key default gen_random_uuid(),
  message_id    uuid not null references public.messages (id) on delete cascade,
  name          text not null,
  file_type     text,
  storage_path  text not null,
  size_bytes    bigint not null default 0
);

create index if not exists message_attachments_message_idx on public.message_attachments (message_id);

-- Denormalized participant names + photos so chat avoids cross-profile RLS reads.
alter table public.conversations add column if not exists client_name  text;
alter table public.conversations add column if not exists lawyer_name  text;
alter table public.conversations add column if not exists client_photo text;
alter table public.conversations add column if not exists lawyer_photo text;

-- One optional attachment per message (image / document / voice note).
alter table public.messages add column if not exists attachment_path text;
alter table public.messages add column if not exists attachment_type text;
alter table public.messages add column if not exists attachment_name text;
alter table public.messages add column if not exists attachment_size bigint;
alter table public.messages alter column body drop not null;

-- REPLICA IDENTITY FULL lets Realtime deliver UPDATE events (read receipts).
alter table public.messages replica identity full;

-- Enable Supabase Realtime on the chat tables (guarded; safe to re-run).
do $$
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    create publication supabase_realtime;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'messages'
  ) then
    alter publication supabase_realtime add table public.messages;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'conversations'
  ) then
    alter publication supabase_realtime add table public.conversations;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'case_updates'
  ) then
    alter publication supabase_realtime add table public.case_updates;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'hearing_dates'
  ) then
    alter publication supabase_realtime add table public.hearing_dates;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'cases'
  ) then
    alter publication supabase_realtime add table public.cases;
  end if;
end$$;


-- =====================================================================
-- 10. CASES
-- =====================================================================

create table if not exists public.cases (
  id                uuid primary key default gen_random_uuid(),
  client_id         uuid not null references public.clients (id) on delete cascade,
  lawyer_id         uuid not null references public.lawyers (id) on delete cascade,
  practice_area_id  uuid references public.practice_areas (id),
  title             text not null,
  case_number       text,
  court             text,
  opposing_party    text,
  status            case_status not null default 'active',
  priority          case_priority not null default 'medium',
  filing_date       date,
  next_hearing_date date,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (lawyer_id, case_number)
);

create index if not exists cases_client_idx on public.cases (client_id);
create index if not exists cases_lawyer_idx on public.cases (lawyer_id);
create index if not exists cases_status_idx on public.cases (status);

-- Deferred FK: conversations.case_id -> cases.id
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'conversations_case_id_fkey'
  ) then
    alter table public.conversations
      add constraint conversations_case_id_fkey
      foreign key (case_id) references public.cases (id) on delete set null;
  end if;
end$$;

-- Manual case management: lawyers can create cases without a registered
-- client, so client_id is nullable and client contact is denormalized.
alter table public.cases alter column client_id drop not null;
alter table public.cases add column if not exists lawyer_name        text;
alter table public.cases add column if not exists client_name       text;
alter table public.cases add column if not exists client_phone      text;
alter table public.cases add column if not exists client_email      text;
alter table public.cases add column if not exists client_cnic       text;
alter table public.cases add column if not exists client_address    text;
alter table public.cases add column if not exists case_type         text;
alter table public.cases add column if not exists court_case_number text;
alter table public.cases add column if not exists judge_name        text;
alter table public.cases add column if not exists opponent_name     text;
alter table public.cases add column if not exists opponent_lawyer   text;
alter table public.cases add column if not exists opponent_contact  text;
alter table public.cases add column if not exists total_fee         numeric(12,2) not null default 0;
alter table public.cases add column if not exists advance_received  numeric(12,2) not null default 0;
alter table public.cases add column if not exists remaining_fee     numeric(12,2) generated always as (greatest(total_fee - advance_received, 0)) stored;
alter table public.cases add column if not exists final_notes       text;
alter table public.cases add column if not exists source_booking_id uuid references public.bookings (id) on delete set null;
create unique index if not exists cases_source_booking_idx on public.cases (source_booking_id) where source_booking_id is not null;

-- Use free-form text for case status so the workflow can evolve without
-- enum migrations (avoids ALTER TYPE ... ADD VALUE transaction limits).
alter table public.cases alter column status drop default;
alter table public.cases alter column status type text using status::text;
alter table public.cases alter column status set default 'new';

-- Public timeline entries (visible to both client and lawyer).
create table if not exists public.case_updates (
  id           uuid primary key default gen_random_uuid(),
  case_id      uuid not null references public.cases (id) on delete cascade,
  author_id    uuid references public.profiles (id),
  title        text not null,
  description  text not null,
  created_at   timestamptz not null default now()
);

create index if not exists case_updates_case_idx on public.case_updates (case_id, created_at);

-- Case-update workflow: type, client visibility, and an optional attachment.
alter table public.case_updates add column if not exists update_type      text not null default 'general';
alter table public.case_updates add column if not exists visible_to_client boolean not null default true;
alter table public.case_updates add column if not exists attachment_path  text;
alter table public.case_updates add column if not exists attachment_name  text;
alter table public.case_updates add column if not exists attachment_type  text;
alter table public.case_updates add column if not exists attachment_size  bigint;

-- Private lawyer-only notes (NEVER exposed to the client via RLS).
create table if not exists public.case_notes (
  id          uuid primary key default gen_random_uuid(),
  case_id     uuid not null references public.cases (id) on delete cascade,
  lawyer_id   uuid not null references public.lawyers (id) on delete cascade,
  body        text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists case_notes_case_idx on public.case_notes (case_id);

create table if not exists public.hearing_dates (
  id            uuid primary key default gen_random_uuid(),
  case_id       uuid not null references public.cases (id) on delete cascade,
  hearing_date  date not null,
  hearing_time  time,
  court         text,
  purpose       text,
  status        hearing_status not null default 'scheduled',
  notes         text,
  created_at    timestamptz not null default now()
);

create index if not exists hearing_dates_case_idx on public.hearing_dates (case_id);
create index if not exists hearing_dates_date_idx on public.hearing_dates (hearing_date);

-- Extra hearing fields used by the lawyer hearings workflow.
alter table public.hearing_dates add column if not exists judge   text;
alter table public.hearing_dates add column if not exists outcome text;

-- Documents: may belong to a case and/or a booking. Private by default.
create table if not exists public.documents (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null references public.profiles (id) on delete cascade,
  case_id       uuid references public.cases (id) on delete cascade,
  booking_id    uuid references public.bookings (id) on delete cascade,
  name          text not null,
  file_type     text,
  storage_path  text not null,
  size_bytes    bigint not null default 0,
  is_private    boolean not null default true,
  created_at    timestamptz not null default now()
);

create index if not exists documents_case_idx on public.documents (case_id);
create index if not exists documents_booking_idx on public.documents (booking_id);
create index if not exists documents_owner_idx on public.documents (owner_id);


-- =====================================================================
-- 11. PAYMENTS & INVOICES
-- =====================================================================

create table if not exists public.payments (
  id                uuid primary key default gen_random_uuid(),
  reference_number  text not null unique default ('PMT-' || to_char(now(),'YYYY') || '-' || upper(substr(gen_random_uuid()::text,1,8))),
  client_id         uuid references public.clients (id) on delete set null,
  lawyer_id         uuid references public.lawyers (id) on delete set null,
  booking_id        uuid references public.bookings (id) on delete set null,
  case_id           uuid references public.cases (id) on delete set null,
  payment_type      payment_type not null default 'consultation_fee',
  description       text,
  total_amount      numeric(12,2) not null check (total_amount >= 0),
  paid_amount       numeric(12,2) not null default 0 check (paid_amount >= 0),
  remaining_amount  numeric(12,2) generated always as (greatest(total_amount - paid_amount, 0)) stored,
  status            payment_status not null default 'pending',
  method            payment_method,
  payment_date      date,
  due_date          date,
  notes             text,
  created_by        uuid references public.profiles (id),
  updated_by        uuid references public.profiles (id),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint payments_paid_not_over_total check (paid_amount <= total_amount)
);

create index if not exists payments_client_idx on public.payments (client_id);
create index if not exists payments_lawyer_idx on public.payments (lawyer_id);
create index if not exists payments_status_idx on public.payments (status);
create index if not exists payments_booking_idx on public.payments (booking_id);

create table if not exists public.invoices (
  id              uuid primary key default gen_random_uuid(),
  invoice_number  text not null unique default ('INV-' || to_char(now(),'YYYY') || '-' || upper(substr(gen_random_uuid()::text,1,8))),
  payment_id      uuid references public.payments (id) on delete set null,
  client_id       uuid references public.clients (id) on delete set null,
  lawyer_id       uuid references public.lawyers (id) on delete set null,
  subtotal        numeric(12,2) not null default 0,
  tax             numeric(12,2) not null default 0,
  total           numeric(12,2) not null default 0,
  status          payment_status not null default 'pending',
  due_date        date,
  issued_at       timestamptz not null default now(),
  notes           text
);

create index if not exists invoices_client_idx on public.invoices (client_id);
create index if not exists invoices_lawyer_idx on public.invoices (lawyer_id);


-- =====================================================================
-- 12. NOTIFICATIONS, REVIEWS, COMPLAINTS, ADMIN LOGS
-- =====================================================================

create table if not exists public.notifications (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references public.profiles (id) on delete cascade,
  type                 notification_type not null default 'system',
  title                text not null,
  body                 text,
  related_entity_type  text,
  related_entity_id    uuid,
  is_read              boolean not null default false,
  created_at           timestamptz not null default now()
);

create index if not exists notifications_user_idx on public.notifications (user_id, is_read);

create table if not exists public.reviews (
  id            uuid primary key default gen_random_uuid(),
  lawyer_id     uuid not null references public.lawyers (id) on delete cascade,
  client_id     uuid not null references public.clients (id) on delete cascade,
  booking_id    uuid references public.bookings (id) on delete set null,
  rating        smallint not null check (rating between 1 and 5),
  comment       text,
  case_type     text,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now()
);

-- Denormalized reviewer identity so the public profile can show the real
-- reviewer name + photo without a cross-profile RLS read.
alter table public.reviews add column if not exists client_name  text;
alter table public.reviews add column if not exists client_photo text;

create index if not exists reviews_lawyer_idx on public.reviews (lawyer_id);
create unique index if not exists reviews_one_per_booking_idx on public.reviews (booking_id) where booking_id is not null;

create table if not exists public.complaints (
  id           uuid primary key default gen_random_uuid(),
  subject      text not null,
  reporter_id  uuid not null references public.profiles (id) on delete cascade,
  against_id   uuid references public.profiles (id) on delete set null,
  category     text not null,
  description  text,
  status       complaint_status not null default 'open',
  resolved_by  uuid references public.profiles (id),
  resolved_at  timestamptz,
  created_at   timestamptz not null default now()
);

create index if not exists complaints_status_idx on public.complaints (status);
create index if not exists complaints_reporter_idx on public.complaints (reporter_id);

create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.profiles (id) on delete set null,
  full_name   text not null,
  email       text not null,
  topic       text not null,
  message     text not null,
  status      text not null default 'new',
  created_at  timestamptz not null default now()
);

create index if not exists contact_messages_status_idx on public.contact_messages (status);
create index if not exists contact_messages_user_idx on public.contact_messages (user_id);

create table if not exists public.admin_logs (
  id            uuid primary key default gen_random_uuid(),
  actor_id      uuid references public.profiles (id),
  action        text not null,
  target_type   text,
  target_id     uuid,
  target_label  text,
  metadata      jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now()
);

create index if not exists admin_logs_actor_idx on public.admin_logs (actor_id);


-- =====================================================================
-- 13. TRIGGERS
-- =====================================================================

-- updated_at maintenance
do $$
declare
  t text;
  tables text[] := array[
    'profiles','clients','lawyers','lawyer_profiles','lawyer_settings',
    'verification_requests','bookings','cases','case_notes','payments'
  ];
begin
  foreach t in array tables loop
    execute format('drop trigger if exists set_%1$s_updated_at on public.%1$s;', t);
    execute format(
      'create trigger set_%1$s_updated_at before update on public.%1$s
         for each row execute function public.set_updated_at();', t);
  end loop;
end$$;

-- Payment status auto-derivation + amount guard.
create or replace function public.sync_payment_status()
returns trigger
language plpgsql
as $$
begin
  if new.paid_amount < 0 then
    raise exception 'paid_amount cannot be negative';
  end if;
  if new.paid_amount > new.total_amount then
    raise exception 'paid_amount (%) cannot exceed total_amount (%)', new.paid_amount, new.total_amount;
  end if;

  -- Only auto-manage the pending/partially_paid/paid progression. Statuses
  -- that are set deliberately (overdue, refunded, failed) are left untouched.
  if new.status not in ('refunded','failed','overdue') then
    if new.paid_amount = 0 then
      new.status := 'pending';
    elsif new.paid_amount < new.total_amount then
      new.status := 'partially_paid';
    else
      new.status := 'paid';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists payments_sync_status on public.payments;
create trigger payments_sync_status
  before insert or update on public.payments
  for each row execute function public.sync_payment_status();

-- Bump conversation.last_message_at when a message is inserted.
create or replace function public.touch_conversation()
returns trigger
language plpgsql
as $$
begin
  update public.conversations
    set last_message_at = new.created_at
    where id = new.conversation_id;
  return new;
end;
$$;

drop trigger if exists messages_touch_conversation on public.messages;
create trigger messages_touch_conversation
  after insert on public.messages
  for each row execute function public.touch_conversation();

-- Booking to notification fan-out. These run as the function owner, so they
-- can write notifications for the *other* party without an RLS insert policy.
create or replace function public.notify_booking_created()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notifications (user_id, type, title, body, related_entity_type, related_entity_id)
  values (
    new.lawyer_id,
    'booking',
    'New consultation request',
    coalesce(new.client_name, 'A client')
      || ' requested a ' || replace(new.mode::text, '_', '-') || ' consultation'
      || case when new.scheduled_date is not null
              then ' on ' || to_char(new.scheduled_date, 'DD Mon YYYY') else '' end
      || '.',
    'booking',
    new.id
  );
  return new;
end;
$$;

drop trigger if exists bookings_notify_created on public.bookings;
create trigger bookings_notify_created
  after insert on public.bookings
  for each row execute function public.notify_booking_created();

create or replace function public.notify_booking_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_title text;
  v_body  text;
begin
  if new.status is not distinct from old.status then
    return new;
  end if;

  if new.status = 'confirmed' then
    v_title := 'Consultation confirmed';
    v_body  := coalesce(new.lawyer_name, 'Your advocate') || ' accepted your consultation request.';
  elsif new.status = 'rejected' then
    v_title := 'Consultation declined';
    v_body  := coalesce(new.lawyer_name, 'Your advocate') || ' could not take this request.'
               || coalesce(' Reason: ' || new.cancellation_reason, '');
  elsif new.status = 'completed' then
    v_title := 'Consultation completed';
    v_body  := 'Your consultation with ' || coalesce(new.lawyer_name, 'your advocate') || ' is marked complete.';
  elsif new.status = 'cancelled' then
    v_title := 'Consultation cancelled';
    v_body  := 'Your consultation with ' || coalesce(new.lawyer_name, 'your advocate') || ' was cancelled.';
  elsif new.status = 'rescheduled' then
    v_title := 'Consultation rescheduled';
    v_body  := coalesce(new.lawyer_name, 'Your advocate') || ' proposed a new time for your consultation.';
  else
    return new;
  end if;

  insert into public.notifications (user_id, type, title, body, related_entity_type, related_entity_id)
  values (new.client_id, 'booking', v_title, v_body, 'booking', new.id);

  return new;
end;
$$;

drop trigger if exists bookings_notify_status on public.bookings;
create trigger bookings_notify_status
  after update on public.bookings
  for each row execute function public.notify_booking_status();


-- =====================================================================
-- 14. AUTH PROVISIONING - create profile (+ role record) on signup
-- =====================================================================
-- Reads metadata passed to supabase.auth.signUp({ options: { data }}):
--   full_name, phone, city, province, role
-- Provisions: profiles row, then clients OR lawyers (+ lawyer_profiles +
-- lawyer_settings with online_consultation_fee defaulting to 2000).
-- A newly provisioned lawyer therefore has ZERO bookings/cases/messages/
-- payments/notifications - only empty states + the default settings row.
-- =====================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role      user_role;
  v_full_name text;
  v_slug      text;
begin
  v_role := coalesce((new.raw_user_meta_data ->> 'role')::user_role, 'client');
  v_full_name := coalesce(new.raw_user_meta_data ->> 'full_name', '');

  insert into public.profiles (id, full_name, email, phone, role, city, province)
  values (
    new.id,
    v_full_name,
    new.email,
    new.raw_user_meta_data ->> 'phone',
    v_role,
    new.raw_user_meta_data ->> 'city',
    new.raw_user_meta_data ->> 'province'
  )
  on conflict (id) do nothing;

  if v_role = 'client' then
    insert into public.clients (id) values (new.id) on conflict (id) do nothing;

  elsif v_role = 'lawyer' then
    -- Build a unique slug from the name + a short uid fragment.
    v_slug := nullif(regexp_replace(lower(v_full_name), '[^a-z0-9]+', '-', 'g'), '');
    v_slug := trim(both '-' from coalesce(v_slug, 'advocate'))
              || '-' || substr(new.id::text, 1, 8);

    insert into public.lawyers (id, slug, bar_council_number, experience_years, about, headline)
    values (
      new.id,
      v_slug,
      nullif(new.raw_user_meta_data ->> 'bar_council_number', ''),
      case when (new.raw_user_meta_data ->> 'experience_years') ~ '^\d+$'
           then (new.raw_user_meta_data ->> 'experience_years')::int else 0 end,
      nullif(new.raw_user_meta_data ->> 'about', ''),
      nullif(new.raw_user_meta_data ->> 'headline', '')
    )
    on conflict (id) do nothing;

    insert into public.lawyer_profiles (lawyer_id) values (new.id)
      on conflict (lawyer_id) do nothing;
    insert into public.lawyer_settings (lawyer_id) values (new.id)  -- online fee defaults to 2000
      on conflict (lawyer_id) do nothing;

    -- Practice areas, if passed as a JSON array of slugs in metadata.
    if new.raw_user_meta_data ? 'practice_area_slugs' then
      insert into public.lawyer_practice_areas (lawyer_id, practice_area_id)
      select new.id, pa.id
      from public.practice_areas pa
      where pa.slug in (
        select jsonb_array_elements_text(new.raw_user_meta_data -> 'practice_area_slugs')
      )
      on conflict do nothing;
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- --- Privilege-escalation guards -------------------------------------
-- A logged-in non-admin must never be able to promote themselves. The
-- profiles UPDATE policy allows users to edit their own row, so without
-- these guards a client could set role='admin' or a lawyer could set
-- is_verified=true. (auth.uid() IS NULL = service_role / SQL editor,
-- which is trusted; RLS already blocks anonymous writes upstream.)

create or replace function public.guard_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role
     and auth.uid() is not null
     and not public.is_admin() then
    raise exception 'Only administrators can change a user role';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_guard_role on public.profiles;
create trigger profiles_guard_role
  before update on public.profiles
  for each row execute function public.guard_profile_role();

create or replace function public.guard_lawyer_verification()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (new.is_verified is distinct from old.is_verified
       or new.verified_at is distinct from old.verified_at)
     and auth.uid() is not null
     and not public.is_admin() then
    -- silently keep the admin-controlled values
    new.is_verified := old.is_verified;
    new.verified_at := old.verified_at;
  end if;
  return new;
end;
$$;

drop trigger if exists lawyers_guard_verification on public.lawyers;
create trigger lawyers_guard_verification
  before update on public.lawyers
  for each row execute function public.guard_lawyer_verification();

create or replace function public.guard_lawyer_subscription()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  subscription_changed boolean;
  allowed_commission_choice boolean;
  allowed_pause boolean;
begin
  subscription_changed :=
    new.subscription_plan is distinct from old.subscription_plan
    or new.subscription_period is distinct from old.subscription_period
    or new.subscription_status is distinct from old.subscription_status
    or new.subscription_started_at is distinct from old.subscription_started_at
    or new.subscription_expires_at is distinct from old.subscription_expires_at;

  if subscription_changed and auth.uid() is not null and not public.is_admin() then
    allowed_commission_choice :=
      new.subscription_plan = 'commission'
      and new.subscription_period = 'commission'
      and new.subscription_status = 'active'
      and new.subscription_expires_at is null;

    allowed_pause := new.subscription_status = 'inactive';

    if not (allowed_commission_choice or allowed_pause) then
      new.subscription_plan := old.subscription_plan;
      new.subscription_period := old.subscription_period;
      new.subscription_status := old.subscription_status;
      new.subscription_started_at := old.subscription_started_at;
      new.subscription_expires_at := old.subscription_expires_at;
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists lawyers_guard_subscription on public.lawyers;
create trigger lawyers_guard_subscription
  before update on public.lawyers
  for each row execute function public.guard_lawyer_subscription();


-- =====================================================================
-- 15. ROW LEVEL SECURITY
-- =====================================================================

alter table public.provinces              enable row level security;
alter table public.cities                 enable row level security;
alter table public.practice_areas         enable row level security;
alter table public.courts                 enable row level security;
alter table public.profiles               enable row level security;
alter table public.clients                enable row level security;
alter table public.lawyers                enable row level security;
alter table public.lawyer_profiles        enable row level security;
alter table public.lawyer_settings        enable row level security;
alter table public.lawyer_practice_areas  enable row level security;
alter table public.lawyer_courts          enable row level security;
alter table public.verification_requests  enable row level security;
alter table public.verification_documents enable row level security;
alter table public.bookings               enable row level security;
alter table public.consultations          enable row level security;
alter table public.conversations          enable row level security;
alter table public.messages               enable row level security;
alter table public.message_attachments    enable row level security;
alter table public.cases                  enable row level security;
alter table public.case_updates           enable row level security;
alter table public.case_notes             enable row level security;
alter table public.hearing_dates          enable row level security;
alter table public.documents              enable row level security;
alter table public.payments               enable row level security;
alter table public.invoices               enable row level security;
alter table public.notifications          enable row level security;
alter table public.reviews                enable row level security;
alter table public.complaints             enable row level security;
alter table public.contact_messages       enable row level security;
alter table public.admin_logs             enable row level security;

-- ---- Reference data: world-readable, admin-writable -----------------
drop policy if exists "reference readable" on public.provinces;
create policy "reference readable" on public.provinces for select using (true);
drop policy if exists "reference admin write" on public.provinces;
create policy "reference admin write" on public.provinces for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "reference readable" on public.cities;
create policy "reference readable" on public.cities for select using (true);
drop policy if exists "reference admin write" on public.cities;
create policy "reference admin write" on public.cities for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "reference readable" on public.practice_areas;
create policy "reference readable" on public.practice_areas for select using (true);
drop policy if exists "reference admin write" on public.practice_areas;
create policy "reference admin write" on public.practice_areas for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "reference readable" on public.courts;
create policy "reference readable" on public.courts for select using (true);
drop policy if exists "reference admin write" on public.courts;
create policy "reference admin write" on public.courts for all using (public.is_admin()) with check (public.is_admin());

-- ---- profiles -------------------------------------------------------
drop policy if exists "own profile read" on public.profiles;
create policy "own profile read" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

drop policy if exists "own profile update" on public.profiles;
create policy "own profile update" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "admin manage profiles" on public.profiles;
create policy "admin manage profiles" on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- ---- clients --------------------------------------------------------
drop policy if exists "client self manage" on public.clients;
create policy "client self manage" on public.clients
  for all using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- ---- lawyers (base rows: private to owner + admin; public via view) --
drop policy if exists "lawyer self read" on public.lawyers;
create policy "lawyer self read" on public.lawyers
  for select using (id = auth.uid() or public.is_admin());

drop policy if exists "lawyer self update" on public.lawyers;
create policy "lawyer self update" on public.lawyers
  for update using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "lawyer self insert" on public.lawyers;
create policy "lawyer self insert" on public.lawyers
  for insert with check (id = auth.uid());

drop policy if exists "admin manage lawyers" on public.lawyers;
create policy "admin manage lawyers" on public.lawyers
  for all using (public.is_admin()) with check (public.is_admin());

-- ---- lawyer_profiles ------------------------------------------------
drop policy if exists "lawyer profile self read" on public.lawyer_profiles;
create policy "lawyer profile self read" on public.lawyer_profiles
  for select using (lawyer_id = auth.uid() or public.is_admin());
drop policy if exists "lawyer profile self manage" on public.lawyer_profiles;
create policy "lawyer profile self manage" on public.lawyer_profiles
  for all using (lawyer_id = auth.uid() or public.is_admin())
  with check (lawyer_id = auth.uid() or public.is_admin());

-- ---- lawyer_settings ------------------------------------------------
drop policy if exists "settings self manage" on public.lawyer_settings;
create policy "settings self manage" on public.lawyer_settings
  for all using (lawyer_id = auth.uid() or public.is_admin())
  with check (lawyer_id = auth.uid() or public.is_admin());

-- ---- lawyer_practice_areas / lawyer_courts --------------------------
drop policy if exists "lpa read" on public.lawyer_practice_areas;
create policy "lpa read" on public.lawyer_practice_areas for select using (true);
drop policy if exists "lpa self manage" on public.lawyer_practice_areas;
create policy "lpa self manage" on public.lawyer_practice_areas
  for all using (lawyer_id = auth.uid() or public.is_admin())
  with check (lawyer_id = auth.uid() or public.is_admin());

drop policy if exists "lc read" on public.lawyer_courts;
create policy "lc read" on public.lawyer_courts for select using (true);
drop policy if exists "lc self manage" on public.lawyer_courts;
create policy "lc self manage" on public.lawyer_courts
  for all using (lawyer_id = auth.uid() or public.is_admin())
  with check (lawyer_id = auth.uid() or public.is_admin());

-- ---- verification ---------------------------------------------------
drop policy if exists "verification self manage" on public.verification_requests;
create policy "verification self manage" on public.verification_requests
  for all using (lawyer_id = auth.uid() or public.is_admin())
  with check (lawyer_id = auth.uid() or public.is_admin());

drop policy if exists "verification docs self manage" on public.verification_documents;
create policy "verification docs self manage" on public.verification_documents
  for all using (
    verification_request_id in (
      select id from public.verification_requests where lawyer_id = auth.uid()
    ) or public.is_admin()
  )
  with check (
    verification_request_id in (
      select id from public.verification_requests where lawyer_id = auth.uid()
    ) or public.is_admin()
  );

-- ---- bookings -------------------------------------------------------
drop policy if exists "booking participants read" on public.bookings;
create policy "booking participants read" on public.bookings
  for select using (client_id = auth.uid() or lawyer_id = auth.uid() or public.is_admin());

drop policy if exists "client create booking" on public.bookings;
create policy "client create booking" on public.bookings
  for insert with check (client_id = auth.uid());

drop policy if exists "booking participants update" on public.bookings;
create policy "booking participants update" on public.bookings
  for update using (client_id = auth.uid() or lawyer_id = auth.uid() or public.is_admin())
  with check (client_id = auth.uid() or lawyer_id = auth.uid() or public.is_admin());

drop policy if exists "admin manage bookings" on public.bookings;
create policy "admin manage bookings" on public.bookings
  for all using (public.is_admin()) with check (public.is_admin());

-- ---- consultations --------------------------------------------------
drop policy if exists "consultation participants" on public.consultations;
create policy "consultation participants" on public.consultations
  for all using (
    booking_id in (select id from public.bookings where client_id = auth.uid() or lawyer_id = auth.uid())
    or public.is_admin()
  )
  with check (
    booking_id in (select id from public.bookings where client_id = auth.uid() or lawyer_id = auth.uid())
    or public.is_admin()
  );

-- ---- conversations & messages --------------------------------------
drop policy if exists "conversation participants read" on public.conversations;
create policy "conversation participants read" on public.conversations
  for select using (client_id = auth.uid() or lawyer_id = auth.uid() or public.is_admin());

drop policy if exists "conversation participants create" on public.conversations;
create policy "conversation participants create" on public.conversations
  for insert with check (client_id = auth.uid() or lawyer_id = auth.uid());

drop policy if exists "conversation participants update" on public.conversations;
create policy "conversation participants update" on public.conversations
  for update using (client_id = auth.uid() or lawyer_id = auth.uid() or public.is_admin());

drop policy if exists "messages read" on public.messages;
create policy "messages read" on public.messages
  for select using (
    conversation_id in (
      select id from public.conversations where client_id = auth.uid() or lawyer_id = auth.uid()
    ) or public.is_admin()
  );

drop policy if exists "messages send" on public.messages;
create policy "messages send" on public.messages
  for insert with check (
    sender_id = auth.uid()
    and conversation_id in (
      select id from public.conversations where client_id = auth.uid() or lawyer_id = auth.uid()
    )
  );

drop policy if exists "messages mark read" on public.messages;
create policy "messages mark read" on public.messages
  for update using (
    conversation_id in (
      select id from public.conversations where client_id = auth.uid() or lawyer_id = auth.uid()
    )
  );

drop policy if exists "attachments access" on public.message_attachments;
create policy "attachments access" on public.message_attachments
  for all using (
    message_id in (
      select m.id from public.messages m
      join public.conversations c on c.id = m.conversation_id
      where c.client_id = auth.uid() or c.lawyer_id = auth.uid()
    ) or public.is_admin()
  )
  with check (
    message_id in (
      select m.id from public.messages m
      join public.conversations c on c.id = m.conversation_id
      where c.client_id = auth.uid() or c.lawyer_id = auth.uid()
    )
  );

-- ---- cases ----------------------------------------------------------
drop policy if exists "case participants read" on public.cases;
create policy "case participants read" on public.cases
  for select using (client_id = auth.uid() or lawyer_id = auth.uid() or public.is_admin());

drop policy if exists "lawyer manage cases" on public.cases;
create policy "lawyer manage cases" on public.cases
  for all using (lawyer_id = auth.uid() or public.is_admin())
  with check (lawyer_id = auth.uid() or public.is_admin());

-- Lawyers (and admins) see every update; clients see only those marked
-- visible_to_client - private updates never reach the client, even via the API.
drop policy if exists "case updates read" on public.case_updates;
create policy "case updates read" on public.case_updates
  for select using (
    case_id in (select id from public.cases where lawyer_id = auth.uid())
    or public.is_admin()
    or (visible_to_client = true and case_id in (select id from public.cases where client_id = auth.uid()))
  );

drop policy if exists "lawyer write case updates" on public.case_updates;
create policy "lawyer write case updates" on public.case_updates
  for insert with check (
    case_id in (select id from public.cases where lawyer_id = auth.uid())
  );

-- case_notes: LAWYER-ONLY. Clients can never read these.
drop policy if exists "lawyer private notes" on public.case_notes;
create policy "lawyer private notes" on public.case_notes
  for all using (lawyer_id = auth.uid() or public.is_admin())
  with check (lawyer_id = auth.uid() or public.is_admin());

drop policy if exists "hearings read" on public.hearing_dates;
create policy "hearings read" on public.hearing_dates
  for select using (
    case_id in (select id from public.cases where client_id = auth.uid() or lawyer_id = auth.uid())
    or public.is_admin()
  );

drop policy if exists "lawyer manage hearings" on public.hearing_dates;
create policy "lawyer manage hearings" on public.hearing_dates
  for all using (
    case_id in (select id from public.cases where lawyer_id = auth.uid()) or public.is_admin()
  )
  with check (
    case_id in (select id from public.cases where lawyer_id = auth.uid()) or public.is_admin()
  );

-- ---- documents (private by default) ---------------------------------
drop policy if exists "documents participants read" on public.documents;
create policy "documents participants read" on public.documents
  for select using (
    owner_id = auth.uid()
    or public.is_admin()
    or case_id in (select id from public.cases where lawyer_id = auth.uid())
    or (is_private = false and case_id in (select id from public.cases where client_id = auth.uid()))
    or booking_id in (select id from public.bookings where client_id = auth.uid() or lawyer_id = auth.uid())
  );

drop policy if exists "documents participants write" on public.documents;
create policy "documents participants write" on public.documents
  for insert with check (
    owner_id = auth.uid()
    and (
      case_id is null
      or case_id in (select id from public.cases where client_id = auth.uid() or lawyer_id = auth.uid())
    )
    and (
      booking_id is null
      or booking_id in (select id from public.bookings where client_id = auth.uid() or lawyer_id = auth.uid())
    )
  );

drop policy if exists "documents owner delete" on public.documents;
create policy "documents owner delete" on public.documents
  for delete using (owner_id = auth.uid() or public.is_admin());

-- ---- payments & invoices -------------------------------------------
drop policy if exists "payment participants read" on public.payments;
create policy "payment participants read" on public.payments
  for select using (client_id = auth.uid() or lawyer_id = auth.uid() or public.is_admin());

-- Lawyers maintain their own payment records (real-world editable ledger).
drop policy if exists "lawyer manage payments" on public.payments;
create policy "lawyer manage payments" on public.payments
  for all using (lawyer_id = auth.uid() or public.is_admin())
  with check (lawyer_id = auth.uid() or public.is_admin());

drop policy if exists "invoice participants read" on public.invoices;
create policy "invoice participants read" on public.invoices
  for select using (client_id = auth.uid() or lawyer_id = auth.uid() or public.is_admin());

drop policy if exists "lawyer manage invoices" on public.invoices;
create policy "lawyer manage invoices" on public.invoices
  for all using (lawyer_id = auth.uid() or public.is_admin())
  with check (lawyer_id = auth.uid() or public.is_admin());

-- ---- notifications --------------------------------------------------
drop policy if exists "notifications own read" on public.notifications;
create policy "notifications own read" on public.notifications
  for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "notifications own update" on public.notifications;
create policy "notifications own update" on public.notifications
  for update using (user_id = auth.uid());

drop policy if exists "admin manage notifications" on public.notifications;
create policy "admin manage notifications" on public.notifications
  for all using (public.is_admin()) with check (public.is_admin());

-- ---- reviews (public read of published; client writes own) ----------
drop policy if exists "reviews public read" on public.reviews;
create policy "reviews public read" on public.reviews
  for select using (is_published = true or client_id = auth.uid() or lawyer_id = auth.uid() or public.is_admin());

drop policy if exists "client write review" on public.reviews;
create policy "client write review" on public.reviews
  for insert with check (client_id = auth.uid());

drop policy if exists "client update review" on public.reviews;
create policy "client update review" on public.reviews
  for update using (client_id = auth.uid());

-- ---- complaints -----------------------------------------------------
drop policy if exists "complaint own read" on public.complaints;
create policy "complaint own read" on public.complaints
  for select using (reporter_id = auth.uid() or public.is_admin());

drop policy if exists "complaint file" on public.complaints;
create policy "complaint file" on public.complaints
  for insert with check (reporter_id = auth.uid());

drop policy if exists "admin manage complaints" on public.complaints;
create policy "admin manage complaints" on public.complaints
  for update using (public.is_admin());

-- ---- contact messages -----------------------------------------------
drop policy if exists "contact message file" on public.contact_messages;
create policy "contact message file" on public.contact_messages
  for insert with check (user_id is null or user_id = auth.uid());

drop policy if exists "contact message admin read" on public.contact_messages;
create policy "contact message admin read" on public.contact_messages
  for select using (public.is_admin());

drop policy if exists "contact message admin update" on public.contact_messages;
create policy "contact message admin update" on public.contact_messages
  for update using (public.is_admin()) with check (public.is_admin());

-- ---- admin logs (admin only) ----------------------------------------
drop policy if exists "admin logs read" on public.admin_logs;
create policy "admin logs read" on public.admin_logs
  for select using (public.is_admin());

drop policy if exists "admin logs write" on public.admin_logs;
create policy "admin logs write" on public.admin_logs
  for insert with check (public.is_admin());


-- =====================================================================
-- 16. PUBLIC LAWYER DIRECTORY VIEW (safe columns only, PII-aware)
-- =====================================================================
-- Anonymous/public users read verified+active lawyers through this view,
-- which exposes ONLY safe public columns. Private email/phone are shown
-- only when the lawyer opted in via lawyer_settings. The view runs with
-- the privileges of its owner, so base-table RLS stays locked down.
-- =====================================================================
-- Dropped + recreated (not CREATE OR REPLACE) so column additions/reordering
-- across schema revisions never trip "cannot change name of view column".
drop view if exists public.lawyer_directory;
create view public.lawyer_directory as
select
  l.id,
  l.slug,
  p.full_name,
  p.city,
  p.province,
  lp.photo_url,
  l.gender,
  l.bar_council_number,
  l.experience_years,
  l.education,
  l.languages,
  l.about,
  l.headline,
  l.response_time,
  l.cases_handled,
  l.success_rate,
  l.rating,
  l.review_count,
  l.is_featured,
  l.joined_date,
  coalesce(
    (select array_agg(pa.slug order by pa.sort_order)
       from public.lawyer_practice_areas lpa
       join public.practice_areas pa on pa.id = lpa.practice_area_id
      where lpa.lawyer_id = l.id),
    '{}'
  ) as practice_area_slugs,
  coalesce(l.courts, '{}') as courts,
  l.professional_title,
  l.office_name,
  l.office_address,
  l.google_maps_link,
  l.bar_enrollment_year,
  l.license_number,
  l.education_entries,
  l.experience,
  l.achievements,
  l.publications,
  l.total_consultations,
  l.response_rate,
  coalesce(lp.social_links, '{}'::jsonb) as social_links,
  s.online_consultation_fee,
  s.in_person_consultation_fee,
  s.phone_consultation_fee,
  s.free_initial_consultation,
  s.consultation_duration_minutes,
  s.availability_days,
  s.availability_hours,
  s.availability_slots,
  s.accepts_online_consultations,
  s.accepts_in_person_consultations,
  case when s.show_email_publicly then p.email end as public_email,
  case when s.show_phone_publicly then p.phone end as public_phone
from public.lawyers l
join public.profiles p        on p.id = l.id
left join public.lawyer_profiles lp on lp.lawyer_id = l.id
left join public.lawyer_settings  s on s.lawyer_id = l.id
where l.is_verified = true
  and l.is_active = true
  and p.is_active = true
  and l.subscription_status = 'active';

grant select on public.lawyer_directory to anon, authenticated;


-- =====================================================================
-- 17. STORAGE BUCKETS + POLICIES
-- =====================================================================
-- avatars              : PUBLIC  (profile + lawyer photos)
-- case-documents       : PRIVATE (per-user folder = auth.uid())
-- verification-documents: PRIVATE (per-user folder = auth.uid())
-- message-attachments  : PRIVATE (per-user folder = auth.uid())
--
-- Convention for private buckets: upload to a path beginning with the
-- uploader's uid, e.g.  "<auth.uid()>/casefile.pdf". Policies enforce
-- that the first path segment equals the requesting user's uid (admins
-- may read everything).
-- =====================================================================
insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('case-documents', 'case-documents', false),
  ('verification-documents', 'verification-documents', false),
  ('message-attachments', 'message-attachments', false)
on conflict (id) do nothing;

-- avatars: public read, owner-scoped writes
drop policy if exists "avatars public read" on storage.objects;
create policy "avatars public read" on storage.objects
  for select using (bucket_id = 'avatars');

drop policy if exists "avatars owner write" on storage.objects;
create policy "avatars owner write" on storage.objects
  for insert with check (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatars owner update" on storage.objects;
create policy "avatars owner update" on storage.objects
  for update using (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatars owner delete" on storage.objects;
create policy "avatars owner delete" on storage.objects
  for delete using (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Private buckets: owner-or-admin full access, no public read.
-- (message-attachments is handled separately - it's conversation-scoped so
--  BOTH chat participants can read each other's files.)
do $$
declare b text;
  buckets text[] := array['verification-documents'];
begin
  foreach b in array buckets loop
    execute format('drop policy if exists %I on storage.objects;', b || ' owner read');
    execute format(
      'create policy %I on storage.objects for select using (
         bucket_id = %L and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
       );', b || ' owner read', b);

    execute format('drop policy if exists %I on storage.objects;', b || ' owner write');
    execute format(
      'create policy %I on storage.objects for insert with check (
         bucket_id = %L and (storage.foldername(name))[1] = auth.uid()::text
       );', b || ' owner write', b);

    execute format('drop policy if exists %I on storage.objects;', b || ' owner update');
    execute format(
      'create policy %I on storage.objects for update using (
         bucket_id = %L and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
       );', b || ' owner update', b);

    execute format('drop policy if exists %I on storage.objects;', b || ' owner delete');
    execute format(
      'create policy %I on storage.objects for delete using (
         bucket_id = %L and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
       );', b || ' owner delete', b);
  end loop;
end$$;

-- case-documents: path is "<case_id>/<file>". Both the case's client and
-- lawyer (and admins) can read; either can upload; the lawyer/admin can delete.
drop policy if exists "case doc read" on storage.objects;
create policy "case doc read" on storage.objects
  for select using (
    bucket_id = 'case-documents'
    and (
      public.is_admin()
      or exists (
        select 1 from public.cases c
        where c.id::text = (storage.foldername(name))[1]
          and (c.client_id = auth.uid() or c.lawyer_id = auth.uid())
      )
    )
  );

drop policy if exists "case doc write" on storage.objects;
create policy "case doc write" on storage.objects
  for insert with check (
    bucket_id = 'case-documents'
    and exists (
      select 1 from public.cases c
      where c.id::text = (storage.foldername(name))[1]
        and (c.client_id = auth.uid() or c.lawyer_id = auth.uid())
    )
  );

drop policy if exists "case doc delete" on storage.objects;
create policy "case doc delete" on storage.objects
  for delete using (
    bucket_id = 'case-documents'
    and (
      public.is_admin()
      or exists (
        select 1 from public.cases c
        where c.id::text = (storage.foldername(name))[1] and c.lawyer_id = auth.uid()
      )
    )
  );

-- message-attachments: path is "<conversation_id>/<file>". Either participant
-- of that conversation can read & upload (so both sides see shared files).
drop policy if exists "chat attachment read" on storage.objects;
create policy "chat attachment read" on storage.objects
  for select using (
    bucket_id = 'message-attachments'
    and (
      public.is_admin()
      or exists (
        select 1 from public.conversations c
        where c.id::text = (storage.foldername(name))[1]
          and (c.client_id = auth.uid() or c.lawyer_id = auth.uid())
      )
    )
  );

drop policy if exists "chat attachment write" on storage.objects;
create policy "chat attachment write" on storage.objects
  for insert with check (
    bucket_id = 'message-attachments'
    and exists (
      select 1 from public.conversations c
      where c.id::text = (storage.foldername(name))[1]
        and (c.client_id = auth.uid() or c.lawyer_id = auth.uid())
    )
  );


-- =====================================================================

-- Continued in 202606110003_reference_data.sql.

