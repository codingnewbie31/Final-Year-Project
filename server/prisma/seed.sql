-- Development seed: a small but realistic slice of Peshawar.
-- Safe to re-run: it clears the tables it fills first.

BEGIN;

TRUNCATE "refresh_tokens", "saved_shifts", "applications", "shift_skills",
         "availability_slots", "seeker_skills", "shifts", "businesses",
         "seeker_profiles", "users", "skills", "categories" RESTART IDENTITY CASCADE;

INSERT INTO "categories" ("id", "name", "slug") VALUES
  ('cat_cafe',     'Cafés and dhabas', 'cafe'),
  ('cat_shop',     'Shops',            'shop'),
  ('cat_delivery', 'Delivery',         'delivery'),
  ('cat_tutor',    'Tutoring',         'tutoring'),
  ('cat_event',    'Events',           'events');

INSERT INTO "skills" ("id", "name", "slug") VALUES
  ('sk_service',  'Customer service', 'customer-service'),
  ('sk_cash',     'Cash handling',    'cash-handling'),
  ('sk_cooking',  'Food preparation', 'food-preparation'),
  ('sk_bike',     'Own motorbike',    'own-motorbike'),
  ('sk_maths',    'Mathematics',      'mathematics'),
  ('sk_english',  'English',          'english'),
  ('sk_lifting',  'Lifting and stock','lifting-and-stock'),
  ('sk_setup',    'Event setup',      'event-setup');

-- Employers (password hashes are placeholders; the API writes real bcrypt hashes)
INSERT INTO "users" ("id", "email", "passwordHash", "role", "fullName", "phone", "updatedAt") VALUES
  ('usr_emp_chai',  'owner@chaicorner.pk',   '$2b$12$seedseedseedseedseedse', 'EMPLOYER', 'Imran Khattak',  '+923431111111', now()),
  ('usr_emp_quick', 'hr@quickmart.pk',       '$2b$12$seedseedseedseedseedse', 'EMPLOYER', 'Sana Gul',       '+923432222222', now()),
  ('usr_emp_bright','admin@brightminds.pk',  '$2b$12$seedseedseedseedseedse', 'EMPLOYER', 'Fahad Ali',      '+923433333333', now()),
  ('usr_emp_events','book@eventshub.pk',     '$2b$12$seedseedseedseedseedse', 'EMPLOYER', 'Nadia Shah',     '+923434444444', now());

-- Job seekers
-- Bilal signed up with Google, so he has no password. The users_has_login
-- constraint means the googleId has to arrive in the same statement.
INSERT INTO "users" ("id", "email", "passwordHash", "googleId", "role", "fullName", "phone", "updatedAt") VALUES
  ('usr_seek_ali',   'ali@example.com',   '$2b$12$seedseedseedseedseedse', NULL,                 'JOB_SEEKER', 'Ali Rehman',   '+923435555555', now()),
  ('usr_seek_hira',  'hira@example.com',  '$2b$12$seedseedseedseedseedse', NULL,                 'JOB_SEEKER', 'Hira Noor',    '+923436666666', now()),
  ('usr_seek_bilal', 'bilal@example.com', NULL,                            'google-oauth-bilal', 'JOB_SEEKER', 'Bilal Afridi', '+923437777777', now());

INSERT INTO "businesses" ("id", "ownerId", "name", "description", "city", "area", "updatedAt") VALUES
  ('biz_chai',   'usr_emp_chai',   'Chai Corner',        'Tea house on the main road, busy from 6 PM.',  'Peshawar', 'University Town', now()),
  ('biz_quick',  'usr_emp_quick',  'QuickMart',          'Grocery with same-day delivery.',              'Peshawar', 'Hayatabad',       now()),
  ('biz_bright', 'usr_emp_bright', 'Bright Minds Academy','After-school tuition for grades 6 to 10.',    'Peshawar', 'Saddar',          now()),
  ('biz_events', 'usr_emp_events', 'Events Hub',         'Wedding and conference staffing.',             'Peshawar', 'Peshawar Club',   now());

INSERT INTO "seeker_profiles" ("id", "userId", "headline", "city", "area", "updatedAt") VALUES
  ('sp_ali',   'usr_seek_ali',   'Second-year student, free evenings',      'Peshawar', 'University Town', now()),
  ('sp_hira',  'usr_seek_hira',  'Maths and English tutor, weekends',       'Peshawar', 'Saddar',          now()),
  ('sp_bilal', 'usr_seek_bilal', 'Rider with my own bike, available daily', 'Peshawar', 'Hayatabad',       now());

INSERT INTO "seeker_skills" ("seekerId", "skillId") VALUES
  ('sp_ali', 'sk_service'), ('sp_ali', 'sk_cash'),
  ('sp_hira', 'sk_maths'), ('sp_hira', 'sk_english'),
  ('sp_bilal', 'sk_bike'), ('sp_bilal', 'sk_lifting');

-- Ali is free on weekday evenings, Hira on weekend afternoons
INSERT INTO "availability_slots" ("id", "seekerId", "weekday", "startMinute", "endMinute") VALUES
  ('av_ali_mon', 'sp_ali', 'MON', 1020, 1380),
  ('av_ali_tue', 'sp_ali', 'TUE', 1020, 1380),
  ('av_ali_wed', 'sp_ali', 'WED', 1020, 1380),
  ('av_hira_sat','sp_hira','SAT', 840, 1140),
  ('av_hira_sun','sp_hira','SUN', 840, 1140);

INSERT INTO "shifts" ("id", "businessId", "categoryId", "title", "description", "city", "area",
                      "payAmount", "payUnit", "startsAt", "endsAt", "isUrgent", "status", "updatedAt") VALUES
  ('sh_waiter',   'biz_chai',   'cat_cafe',     'Café waiter, evening shift', 'Taking orders and serving tea during the evening rush.', 'Peshawar', 'University Town', 450,  'HOURLY',    now() + interval '2 hours',  now() + interval '7 hours',  true,  'OPEN', now()),
  ('sh_kitchen',  'biz_chai',   'cat_cafe',     'Kitchen helper',             'Prep work and washing up alongside the cook.',          'Peshawar', 'University Town', 380,  'HOURLY',    now() + interval '1 day',     now() + interval '1 day 5 hours', false, 'OPEN', now()),
  ('sh_tea',      'biz_chai',   'cat_cafe',     'Morning tea service',        'Opening shift, making and serving tea.',                'Peshawar', 'University Town', 360,  'HOURLY',    now() + interval '18 hours',  now() + interval '22 hours', false, 'OPEN', now()),
  ('sh_rider',    'biz_quick',  'cat_delivery', 'Delivery rider',             'Grocery deliveries within Hayatabad. Own bike needed.', 'Peshawar', 'Hayatabad',       400,  'HOURLY',    now() + interval '5 hours',   now() + interval '11 hours', false, 'OPEN', now()),
  ('sh_parcel',   'biz_quick',  'cat_delivery', 'Parcel runner',              'Moving parcels between the shop and the courier desk.', 'Peshawar', 'Hayatabad',       1500, 'PER_SHIFT', now() + interval '2 days',    now() + interval '2 days 4 hours', false, 'OPEN', now()),
  ('sh_stock',    'biz_quick',  'cat_shop',     'Stock assistant',            'Unloading and shelving the morning delivery.',          'Peshawar', 'Hayatabad',       350,  'HOURLY',    now() + interval '20 hours',  now() + interval '24 hours', false, 'OPEN', now()),
  ('sh_maths',    'biz_bright', 'cat_tutor',    'Maths tutor, grade 8',       'Two afternoon sessions a week with a small group.',     'Peshawar', 'Saddar',          700,  'HOURLY',    now() + interval '3 days',    now() + interval '3 days 2 hours', false, 'OPEN', now()),
  ('sh_english',  'biz_bright', 'cat_tutor',    'English tutor, grade 10',    'Exam preparation, spoken and written.',                 'Peshawar', 'Saddar',          800,  'HOURLY',    now() + interval '4 days',    now() + interval '4 days 2 hours', false, 'OPEN', now()),
  ('sh_front',    'biz_bright', 'cat_shop',     'Front desk, evenings',       'Greeting parents and taking fee payments.',             'Peshawar', 'Saddar',          420,  'HOURLY',    now() + interval '2 days 3 hours', now() + interval '2 days 7 hours', false, 'OPEN', now()),
  ('sh_wedding',  'biz_events', 'cat_event',    'Wedding event helper',       'Setting up chairs and serving guests.',                 'Peshawar', 'Peshawar Club',   3000, 'PER_SHIFT', now() + interval '4 hours',   now() + interval '11 hours', true,  'OPEN', now()),
  ('sh_confer',   'biz_events', 'cat_event',    'Conference setup crew',      'Early morning hall setup before a conference.',         'Peshawar', 'Peshawar Club',   2200, 'DAILY',     now() + interval '5 days',    now() + interval '5 days 8 hours', false, 'OPEN', now()),
  ('sh_closed',   'biz_chai',   'cat_cafe',     'Weekend waiter',             'Filled last week, kept for the employer''s records.',   'Peshawar', 'University Town', 460,  'HOURLY',    now() - interval '3 days',    now() - interval '2 days 19 hours', false, 'FILLED', now());

INSERT INTO "shift_skills" ("shiftId", "skillId") VALUES
  ('sh_waiter', 'sk_service'), ('sh_waiter', 'sk_cash'),
  ('sh_kitchen', 'sk_cooking'),
  ('sh_rider', 'sk_bike'),
  ('sh_stock', 'sk_lifting'),
  ('sh_maths', 'sk_maths'),
  ('sh_english', 'sk_english'),
  ('sh_wedding', 'sk_setup');

INSERT INTO "applications" ("id", "shiftId", "applicantId", "status", "message", "updatedAt") VALUES
  ('app_1', 'sh_waiter',  'usr_seek_ali',   'APPLIED',   'I live five minutes away and can start today.', now()),
  ('app_2', 'sh_kitchen', 'usr_seek_ali',   'IN_REVIEW', NULL, now()),
  ('app_3', 'sh_rider',   'usr_seek_bilal', 'APPLIED',   'I have my own bike and know Hayatabad well.', now()),
  ('app_4', 'sh_maths',   'usr_seek_hira',  'APPLIED',   NULL, now());

INSERT INTO "applications" ("id", "shiftId", "applicantId", "status", "decidedAt", "updatedAt") VALUES
  ('app_5', 'sh_closed', 'usr_seek_ali', 'ACCEPTED', now() - interval '4 days', now());

INSERT INTO "saved_shifts" ("userId", "shiftId") VALUES
  ('usr_seek_ali',  'sh_tea'),
  ('usr_seek_ali',  'sh_front'),
  ('usr_seek_hira', 'sh_english');

COMMIT;
