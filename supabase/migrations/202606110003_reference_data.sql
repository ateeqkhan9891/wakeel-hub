-- =====================================================================
-- Wakeel360 Pakistan - Reference data
-- Generated from supabase/schema.sql section 18.
-- =====================================================================

-- 18. REFERENCE / MASTER DATA  (NO users / demo records)
-- =====================================================================

-- Provinces & territories of Pakistan
insert into public.provinces (slug, name) values
  ('punjab', 'Punjab'),
  ('sindh', 'Sindh'),
  ('khyber-pakhtunkhwa', 'Khyber Pakhtunkhwa'),
  ('balochistan', 'Balochistan'),
  ('islamabad-capital-territory', 'Islamabad Capital Territory'),
  ('gilgit-baltistan', 'Gilgit-Baltistan'),
  ('azad-jammu-kashmir', 'Azad Jammu & Kashmir')
on conflict (slug) do nothing;

-- Cities (mapped to the provinces the app currently serves)
insert into public.cities (slug, name, province_id) values
  ('peshawar',   'Peshawar',   (select id from public.provinces where slug = 'khyber-pakhtunkhwa')),
  ('islamabad',  'Islamabad',  (select id from public.provinces where slug = 'islamabad-capital-territory')),
  ('rawalpindi', 'Rawalpindi', (select id from public.provinces where slug = 'punjab')),
  ('lahore',     'Lahore',     (select id from public.provinces where slug = 'punjab')),
  ('karachi',    'Karachi',    (select id from public.provinces where slug = 'sindh')),
  ('quetta',     'Quetta',     (select id from public.provinces where slug = 'balochistan')),
  ('multan',     'Multan',     (select id from public.provinces where slug = 'punjab')),
  ('faisalabad', 'Faisalabad', (select id from public.provinces where slug = 'punjab')),
  ('abbottabad', 'Abbottabad', (select id from public.provinces where slug = 'khyber-pakhtunkhwa')),
  ('swat',       'Swat',       (select id from public.provinces where slug = 'khyber-pakhtunkhwa'))
on conflict (slug) do nothing;

-- Practice areas (master list - mirrors src/lib/constants.ts)
insert into public.practice_areas (slug, name, description, icon, sort_order) values
  ('family-law',        'Family Law',        'Divorce, custody, khula, maintenance & inheritance disputes.', 'Users', 1),
  ('criminal-law',      'Criminal Law',      'Bail, FIR quashing, criminal trials & appeals.', 'Gavel', 2),
  ('property-law',      'Property Law',      'Land disputes, possession, transfers & title verification.', 'Building2', 3),
  ('civil-law',         'Civil Law',         'Contracts, recovery suits, damages & civil litigation.', 'Scale', 4),
  ('corporate-law',     'Corporate Law',     'Company incorporation, compliance & commercial contracts.', 'Briefcase', 5),
  ('tax-law',           'Tax Law',           'Income tax, sales tax, FBR notices & appeals.', 'Receipt', 6),
  ('immigration-law',   'Immigration Law',   'Visas, citizenship, deportation & overseas matters.', 'Plane', 7),
  ('banking-law',       'Banking Law',       'Loan recovery, banking court litigation & finance disputes.', 'Landmark', 8),
  ('labour-law',        'Labour Law',        'Wrongful termination, wages & industrial relations.', 'HardHat', 9),
  ('constitutional-law','Constitutional Law','Writ petitions, fundamental rights & public interest litigation.', 'ScrollText', 10),
  ('cyber-crime',       'Cyber Crime',       'FIA complaints, online harassment & data crime cases.', 'ShieldAlert', 11),
  ('consumer-law',      'Consumer Law',      'Consumer protection court claims & service disputes.', 'ShoppingCart', 12)
on conflict (slug) do nothing;

-- Courts (master list - mirrors COURTS_BY_CITY in src/lib/constants.ts)
insert into public.courts (name, city_id, court_type) values
  ('Peshawar High Court',                       (select id from public.cities where slug='peshawar'),   'High Court'),
  ('District & Sessions Court Peshawar',        (select id from public.cities where slug='peshawar'),   'District Court'),
  ('Banking Court Peshawar',                    (select id from public.cities where slug='peshawar'),   'Banking Court'),
  ('Islamabad High Court',                      (select id from public.cities where slug='islamabad'),  'High Court'),
  ('District Court Islamabad',                  (select id from public.cities where slug='islamabad'),  'District Court'),
  ('Federal Service Tribunal',                  (select id from public.cities where slug='islamabad'),  'Tribunal'),
  ('District & Sessions Court Rawalpindi',      (select id from public.cities where slug='rawalpindi'), 'District Court'),
  ('Anti-Terrorism Court Rawalpindi',           (select id from public.cities where slug='rawalpindi'), 'Special Court'),
  ('Lahore High Court',                         (select id from public.cities where slug='lahore'),     'High Court'),
  ('District Court Lahore',                     (select id from public.cities where slug='lahore'),     'District Court'),
  ('Banking Court Lahore',                      (select id from public.cities where slug='lahore'),     'Banking Court'),
  ('Labour Court Lahore',                       (select id from public.cities where slug='lahore'),     'Labour Court'),
  ('Sindh High Court',                          (select id from public.cities where slug='karachi'),    'High Court'),
  ('District & Sessions Court Karachi (South)', (select id from public.cities where slug='karachi'),    'District Court'),
  ('Banking Court Karachi',                     (select id from public.cities where slug='karachi'),    'Banking Court'),
  ('Balochistan High Court',                    (select id from public.cities where slug='quetta'),     'High Court'),
  ('District & Sessions Court Quetta',          (select id from public.cities where slug='quetta'),     'District Court'),
  ('Lahore High Court - Multan Bench',          (select id from public.cities where slug='multan'),     'High Court'),
  ('District Court Multan',                     (select id from public.cities where slug='multan'),     'District Court'),
  ('District & Sessions Court Faisalabad',      (select id from public.cities where slug='faisalabad'), 'District Court'),
  ('Labour Court Faisalabad',                   (select id from public.cities where slug='faisalabad'), 'Labour Court'),
  ('Peshawar High Court - Abbottabad Bench',    (select id from public.cities where slug='abbottabad'), 'High Court'),
  ('District Court Abbottabad',                 (select id from public.cities where slug='abbottabad'), 'District Court'),
  ('District & Sessions Court Swat',            (select id from public.cities where slug='swat'),       'District Court')
on conflict (name, city_id) do nothing;

-- =====================================================================
-- End of schema - production ready, no demo data.
-- =====================================================================


