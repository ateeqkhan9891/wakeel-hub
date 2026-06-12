-- =====================================================================
-- WakeelHub Pakistan - Local/Staging Seed Data
-- =====================================================================
-- Run only in disposable local or staging databases:
--   supabase db reset
--
-- These records are fake and intentionally deterministic so Playwright can
-- exercise register/login -> booking -> sandbox payment without touching
-- production data.
-- =====================================================================

create extension if not exists "pgcrypto";

do $$
declare
  v_client uuid := '00000000-0000-4000-8000-000000000101';
  v_lawyer uuid := '00000000-0000-4000-8000-000000000202';
  v_admin uuid := '00000000-0000-4000-8000-000000000303';
  v_password text := 'WakeelHub123!';
  v_family uuid;
  v_lahore_court uuid;
  v_verification uuid := '00000000-0000-4000-8000-000000000505';
  v_booking uuid := '00000000-0000-4000-8000-000000000404';
begin
  select id into v_family from public.practice_areas where slug = 'family-law' limit 1;
  select c.id into v_lahore_court
  from public.courts c
  join public.cities city on city.id = c.city_id
  where city.slug = 'lahore'
  order by c.name
  limit 1;

  insert into auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change
  )
  values
    (
      v_client,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'client.e2e@wakeelhub.test',
      crypt(v_password, gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"role":"client","full_name":"E2E Client","phone":"03000000101","city":"Lahore"}'::jsonb,
      now(),
      now(),
      '',
      '',
      '',
      ''
    ),
    (
      v_lawyer,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'lawyer.e2e@wakeelhub.test',
      crypt(v_password, gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"role":"lawyer","full_name":"Ayesha E2E Advocate","phone":"03000000202","city":"Lahore","bar_council_number":"E2E-LHR-202"}'::jsonb,
      now(),
      now(),
      '',
      '',
      '',
      ''
    ),
    (
      v_admin,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'admin.e2e@wakeelhub.test',
      crypt(v_password, gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"role":"admin","full_name":"E2E Admin","phone":"03000000303","city":"Islamabad"}'::jsonb,
      now(),
      now(),
      '',
      '',
      '',
      ''
    )
  on conflict (id) do update set
    encrypted_password = excluded.encrypted_password,
    email_confirmed_at = excluded.email_confirmed_at,
    raw_app_meta_data = excluded.raw_app_meta_data,
    raw_user_meta_data = excluded.raw_user_meta_data,
    updated_at = now();

  insert into auth.identities (
    id,
    user_id,
    provider_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  )
  values
    (v_client, v_client, v_client::text, jsonb_build_object('sub', v_client::text, 'email', 'client.e2e@wakeelhub.test'), 'email', now(), now(), now()),
    (v_lawyer, v_lawyer, v_lawyer::text, jsonb_build_object('sub', v_lawyer::text, 'email', 'lawyer.e2e@wakeelhub.test'), 'email', now(), now(), now()),
    (v_admin, v_admin, v_admin::text, jsonb_build_object('sub', v_admin::text, 'email', 'admin.e2e@wakeelhub.test'), 'email', now(), now(), now())
  on conflict (provider, provider_id) do update set
    identity_data = excluded.identity_data,
    updated_at = now();

  insert into public.profiles (id, full_name, email, phone, role, city, province, is_active)
  values
    (v_client, 'E2E Client', 'client.e2e@wakeelhub.test', '03000000101', 'client', 'Lahore', 'Punjab', true),
    (v_lawyer, 'Ayesha E2E Advocate', 'lawyer.e2e@wakeelhub.test', '03000000202', 'lawyer', 'Lahore', 'Punjab', true),
    (v_admin, 'E2E Admin', 'admin.e2e@wakeelhub.test', '03000000303', 'admin', 'Islamabad', 'Islamabad Capital Territory', true)
  on conflict (id) do update set
    full_name = excluded.full_name,
    email = excluded.email,
    phone = excluded.phone,
    role = excluded.role,
    city = excluded.city,
    province = excluded.province,
    is_active = excluded.is_active,
    updated_at = now();

  insert into public.clients (id, preferred_language)
  values (v_client, 'English')
  on conflict (id) do update set preferred_language = excluded.preferred_language, updated_at = now();

  insert into public.lawyers (
    id,
    slug,
    gender,
    bar_council_number,
    bar_council_name,
    is_verified,
    verified_at,
    is_active,
    experience_years,
    education,
    languages,
    about,
    headline,
    response_time,
    cases_handled,
    success_rate,
    rating,
    review_count,
    is_featured,
    professional_title,
    subscription_plan,
    subscription_period,
    subscription_status,
    subscription_started_at,
    subscription_expires_at
  )
  values (
    v_lawyer,
    'ayesha-e2e-advocate',
    'female',
    'E2E-LHR-202',
    'Punjab Bar Council',
    true,
    now(),
    true,
    9,
    array['LLB, University of the Punjab'],
    array['English','Urdu','Punjabi'],
    'Seeded advocate for local and staging smoke tests.',
    'Family law and civil litigation advocate',
    'Usually responds within 1 hour',
    180,
    91,
    4.8,
    27,
    true,
    'Advocate High Court',
    'commission',
    'commission',
    'active',
    now(),
    null
  )
  on conflict (id) do update set
    slug = excluded.slug,
    gender = excluded.gender,
    bar_council_number = excluded.bar_council_number,
    bar_council_name = excluded.bar_council_name,
    is_verified = excluded.is_verified,
    verified_at = excluded.verified_at,
    is_active = excluded.is_active,
    experience_years = excluded.experience_years,
    education = excluded.education,
    languages = excluded.languages,
    about = excluded.about,
    headline = excluded.headline,
    response_time = excluded.response_time,
    cases_handled = excluded.cases_handled,
    success_rate = excluded.success_rate,
    rating = excluded.rating,
    review_count = excluded.review_count,
    is_featured = excluded.is_featured,
    professional_title = excluded.professional_title,
    subscription_plan = excluded.subscription_plan,
    subscription_period = excluded.subscription_period,
    subscription_status = excluded.subscription_status,
    subscription_started_at = excluded.subscription_started_at,
    subscription_expires_at = excluded.subscription_expires_at,
    updated_at = now();

  insert into public.lawyer_profiles (lawyer_id, social_links)
  values (v_lawyer, '{"website":"https://wakeelhub.test/e2e"}'::jsonb)
  on conflict (lawyer_id) do update set social_links = excluded.social_links, updated_at = now();

  insert into public.lawyer_settings (
    lawyer_id,
    online_consultation_fee,
    in_person_consultation_fee,
    availability_days,
    availability_hours,
    accepts_online_consultations,
    accepts_in_person_consultations,
    show_phone_publicly,
    show_email_publicly
  )
  values (
    v_lawyer,
    2500,
    4000,
    array['Monday','Tuesday','Wednesday','Thursday','Friday'],
    '10:00 AM - 5:00 PM',
    true,
    true,
    true,
    false
  )
  on conflict (lawyer_id) do update set
    online_consultation_fee = excluded.online_consultation_fee,
    in_person_consultation_fee = excluded.in_person_consultation_fee,
    availability_days = excluded.availability_days,
    availability_hours = excluded.availability_hours,
    accepts_online_consultations = excluded.accepts_online_consultations,
    accepts_in_person_consultations = excluded.accepts_in_person_consultations,
    show_phone_publicly = excluded.show_phone_publicly,
    show_email_publicly = excluded.show_email_publicly,
    updated_at = now();

  if v_family is not null then
    insert into public.lawyer_practice_areas (lawyer_id, practice_area_id)
    values (v_lawyer, v_family)
    on conflict do nothing;
  end if;

  if v_lahore_court is not null then
    insert into public.lawyer_courts (lawyer_id, court_id)
    values (v_lawyer, v_lahore_court)
    on conflict do nothing;
  end if;

  insert into public.verification_requests (
    id,
    lawyer_id,
    enrollment_number,
    bar_council_name,
    chamber_address,
    status,
    reviewed_by,
    reviewed_at,
    submitted_at
  )
  values (
    v_verification,
    v_lawyer,
    'E2E-LHR-202',
    'Punjab Bar Council',
    'E2E Chamber, Lahore',
    'approved',
    v_admin,
    now(),
    now()
  )
  on conflict (id) do update set
    status = excluded.status,
    reviewed_by = excluded.reviewed_by,
    reviewed_at = excluded.reviewed_at,
    updated_at = now();

  insert into public.bookings (
    id,
    client_id,
    lawyer_id,
    practice_area_id,
    client_name,
    client_phone,
    client_city,
    lawyer_name,
    practice_area_name,
    issue_summary,
    mode,
    scheduled_date,
    scheduled_time,
    fee_amount,
    payment_status,
    status
  )
  values (
    v_booking,
    v_client,
    v_lawyer,
    v_family,
    'E2E Client',
    '03000000101',
    'Lahore',
    'Ayesha E2E Advocate',
    'Family Law',
    'Seed booking for sandbox payment smoke test.',
    'online',
    current_date + interval '7 days',
    time '11:00',
    2500,
    'pending',
    'confirmed'
  )
  on conflict (id) do update set
    payment_status = 'pending',
    status = 'confirmed',
    updated_at = now();

  delete from public.consultation_payments where booking_id = v_booking;
end $$;
