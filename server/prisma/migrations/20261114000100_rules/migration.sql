-- Business rules the thesis depends on, enforced by the database rather than
-- by JavaScript. Prisma has no syntax for CHECK constraints, so they live in
-- their own migration.

-- Pay transparency: a shift cannot be posted without real pay.
ALTER TABLE "shifts"
  ADD CONSTRAINT "shifts_pay_positive" CHECK ("payAmount" > 0);

-- A shift has to end after it starts.
ALTER TABLE "shifts"
  ADD CONSTRAINT "shifts_time_order" CHECK ("endsAt" > "startsAt");

-- An account must be reachable by password or by Google, never neither.
ALTER TABLE "users"
  ADD CONSTRAINT "users_has_login" CHECK ("passwordHash" IS NOT NULL OR "googleId" IS NOT NULL);

-- Availability is a real window inside one day (minutes from midnight).
ALTER TABLE "availability_slots"
  ADD CONSTRAINT "availability_window" CHECK (
    "startMinute" >= 0 AND "endMinute" <= 1440 AND "endMinute" > "startMinute"
  );

-- A decided application must record when it was decided, and an undecided one
-- must not pretend it was.
ALTER TABLE "applications"
  ADD CONSTRAINT "applications_decided_at" CHECK (
    ("status" IN ('ACCEPTED', 'DECLINED') AND "decidedAt" IS NOT NULL)
    OR ("status" NOT IN ('ACCEPTED', 'DECLINED') AND "decidedAt" IS NULL)
  );
