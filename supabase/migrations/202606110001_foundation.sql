-- =====================================================================
-- Wakeel360 Pakistan - PRODUCTION Database Schema (PostgreSQL / Supabase)
-- =====================================================================
-- Single copy-paste script for the Supabase SQL Editor on a FRESH project.
--
-- Contents:
--   1.  Extensions
--   2.  Enumerated types
--   3.  Generic helper functions (updated_at, is_admin, ...)
--   4.  Reference / master data tables (provinces, cities, courts, areas)
--   5.  Identity tables (profiles, clients, lawyers, *_profiles, settings)
--   6.  Lawyer relationship tables (practice areas, courts)
--   7.  Verification tables
--   8.  Bookings & consultations
--   9.  Messaging (conversations, messages, attachments)
--   10. Cases (updates, notes, hearings, documents)
--   11. Payments & invoices
--   12. Notifications, reviews, complaints, admin logs
--   13. Triggers
--   14. Auth provisioning (handle_new_user)
--   15. Row Level Security (RLS) policies
--   16. Public lawyer directory view (safe, PII-aware)
--   17. Storage buckets + storage policies
--   18. Reference / master data INSERTS (NO user/demo data)
--
-- This script is IDEMPOTENT and safe to re-run.
-- It contains NO demo users, lawyers, clients, bookings, cases,
-- payments, messages or notifications. Only reference master data.
-- =====================================================================


-- =====================================================================
-- 1. EXTENSIONS
-- =====================================================================
create extension if not exists "pgcrypto";   -- gen_random_uuid()
create extension if not exists "uuid-ossp";   -- compatibility / uuid helpers

-- Allow functions to reference tables that are created later in this same
-- script (e.g. is_admin() references public.profiles). Without this,
-- PostgreSQL validates SQL-language function bodies at creation time and
-- would fail with "relation public.profiles does not exist".
set check_function_bodies = off;


-- =====================================================================
-- 2. ENUMERATED TYPES  (guarded so re-runs don't error)
-- =====================================================================
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type user_role as enum ('client', 'lawyer', 'admin');
  end if;

  if not exists (select 1 from pg_type where typname = 'gender') then
    create type gender as enum ('male', 'female', 'other');
  end if;

  if not exists (select 1 from pg_type where typname = 'consultation_mode') then
    create type consultation_mode as enum ('online', 'in_person', 'phone');
  end if;

  if not exists (select 1 from pg_type where typname = 'booking_status') then
    create type booking_status as enum ('pending', 'confirmed', 'completed', 'cancelled', 'rejected', 'rescheduled');
  end if;

  if not exists (select 1 from pg_type where typname = 'case_status') then
    create type case_status as enum ('pending', 'active', 'in_progress', 'adjourned', 'won', 'lost', 'closed', 'archived');
  end if;

  if not exists (select 1 from pg_type where typname = 'case_priority') then
    create type case_priority as enum ('low', 'medium', 'high', 'urgent');
  end if;

  if not exists (select 1 from pg_type where typname = 'hearing_status') then
    create type hearing_status as enum ('scheduled', 'completed', 'adjourned', 'cancelled');
  end if;

  if not exists (select 1 from pg_type where typname = 'payment_status') then
    create type payment_status as enum ('pending', 'partially_paid', 'paid', 'overdue', 'refunded', 'failed');
  end if;

  if not exists (select 1 from pg_type where typname = 'payment_method') then
    create type payment_method as enum ('cash', 'bank_transfer', 'jazzcash', 'easypaisa', 'card', 'other');
  end if;

  if not exists (select 1 from pg_type where typname = 'payment_type') then
    create type payment_type as enum ('consultation_fee', 'case_fee', 'drafting_fee', 'court_appearance_fee', 'retainer_fee', 'platform_fee', 'other');
  end if;

  if not exists (select 1 from pg_type where typname = 'notification_type') then
    create type notification_type as enum ('booking', 'payment', 'case', 'message', 'hearing', 'verification', 'system');
  end if;

  if not exists (select 1 from pg_type where typname = 'verification_status') then
    create type verification_status as enum ('not_submitted', 'pending', 'approved', 'rejected');
  end if;

  if not exists (select 1 from pg_type where typname = 'verification_doc_type') then
    create type verification_doc_type as enum ('cnic_front', 'cnic_back', 'bar_council_card', 'law_license', 'enrollment_certificate', 'chamber_address_proof', 'degree', 'other');
  end if;

  if not exists (select 1 from pg_type where typname = 'complaint_status') then
    create type complaint_status as enum ('open', 'investigating', 'resolved', 'dismissed');
  end if;
end$$;


-- =====================================================================
-- 3. GENERIC HELPER FUNCTIONS
-- =====================================================================

-- Keeps updated_at columns current on UPDATE.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Role lookup that BYPASSES RLS (security definer) so policies that call
-- it never recurse into the profiles table's own policies.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;


-- =====================================================================

-- Continued in 202606110002_application_schema.sql.


