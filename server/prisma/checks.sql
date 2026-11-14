-- Proof that the rules hold in the database, not just in the API.
-- Every block below should FAIL. Run with:
--   psql "$DATABASE_URL" -f prisma/checks.sql

\set ON_ERROR_STOP off
\echo '--- 1. a shift with no pay is rejected'
INSERT INTO "shifts" ("id","businessId","categoryId","title","description","city","area","payAmount","payUnit","startsAt","endsAt","updatedAt")
VALUES ('bad_1','biz_chai','cat_cafe','Unpaid helper','Should never be stored.','Peshawar','University Town',0,'HOURLY',now()+interval '1 day',now()+interval '1 day 4 hours',now());

\echo '--- 2. a shift that ends before it starts is rejected'
INSERT INTO "shifts" ("id","businessId","categoryId","title","description","city","area","payAmount","payUnit","startsAt","endsAt","updatedAt")
VALUES ('bad_2','biz_chai','cat_cafe','Time travel','Should never be stored.','Peshawar','University Town',400,'HOURLY',now()+interval '1 day 4 hours',now()+interval '1 day',now());

\echo '--- 3. applying twice to the same shift is rejected'
INSERT INTO "applications" ("id","shiftId","applicantId","updatedAt")
VALUES ('bad_3','sh_waiter','usr_seek_ali',now());

\echo '--- 4. an account with neither a password nor Google is rejected'
INSERT INTO "users" ("id","email","role","fullName","updatedAt")
VALUES ('bad_4','ghost@example.com','JOB_SEEKER','No Way In',now());

\echo '--- 5. an accepted application with no decision date is rejected'
INSERT INTO "applications" ("id","shiftId","applicantId","status","updatedAt")
VALUES ('bad_5','sh_tea','usr_seek_hira','ACCEPTED',now());

\echo '--- 6. a shift pointing at a business that does not exist is rejected'
INSERT INTO "shifts" ("id","businessId","categoryId","title","description","city","area","payAmount","payUnit","startsAt","endsAt","updatedAt")
VALUES ('bad_6','biz_nope','cat_cafe','Orphan shift','Should never be stored.','Peshawar','Saddar',400,'HOURLY',now()+interval '1 day',now()+interval '1 day 4 hours',now());

\echo '--- nothing above should have been inserted:'
SELECT count(*) AS leftovers FROM "shifts" WHERE id LIKE 'bad%';
