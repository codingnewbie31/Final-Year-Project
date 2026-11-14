-- The five queries the product depends on. Each one needed several round trips
-- and in-JavaScript stitching under MongoDB; here each is a single statement.

\echo '=== 1. The shift feed: open, still upcoming, urgent first'
SELECT s.title,
       b.name        AS business,
       s.area,
       s."payAmount" || ' ' || s."payUnit" AS pay,
       to_char(s."startsAt", 'Dy HH24:MI') AS starts,
       s."isUrgent"
FROM shifts s
JOIN businesses b ON b.id = s."businessId"
WHERE s.status = 'OPEN' AND s."startsAt" > now()
ORDER BY s."isUrgent" DESC, s."startsAt"
LIMIT 6;

\echo ''
\echo '=== 2. Category chips on the landing page'
SELECT c.name AS category, count(s.id) AS open_shifts
FROM categories c
LEFT JOIN shifts s ON s."categoryId" = c.id AND s.status = 'OPEN' AND s."startsAt" > now()
GROUP BY c.name
ORDER BY open_shifts DESC, c.name;

\echo ''
\echo '=== 3. Fair pay: how this shift compares with similar ones nearby'
-- Every pay unit is converted to an hourly rate first, so a daily rate and an
-- hourly rate can be compared honestly.
WITH hourly AS (
  SELECT s.id, s.title, s."categoryId", s.area,
         CASE s."payUnit"
           WHEN 'HOURLY'    THEN s."payAmount"
           WHEN 'DAILY'     THEN s."payAmount" / 8
           WHEN 'PER_SHIFT' THEN s."payAmount"
             / GREATEST(EXTRACT(EPOCH FROM (s."endsAt" - s."startsAt")) / 3600, 1)
         END AS rate
  FROM shifts s
  WHERE s.status IN ('OPEN', 'FILLED')
)
SELECT round(this.rate)                                              AS this_shift,
       round(min(peer.rate))                                         AS area_low,
       round(percentile_cont(0.5) WITHIN GROUP (ORDER BY peer.rate)::numeric) AS area_median,
       round(max(peer.rate))                                         AS area_high,
       count(*)                                                      AS compared_with,
       CASE WHEN this.rate >= percentile_cont(0.5) WITHIN GROUP (ORDER BY peer.rate)
            THEN 'at or above the usual rate' ELSE 'below the usual rate' END AS verdict
FROM hourly this
JOIN hourly peer ON peer."categoryId" = this."categoryId" AND peer.area = this.area
WHERE this.id = 'sh_waiter'
GROUP BY this.rate;

\echo ''
\echo '=== 4. Shifts that fit Ali''s free hours'
SELECT s.title, b.name AS business,
       to_char(s."startsAt", 'Dy HH24:MI') || ' to ' || to_char(s."endsAt", 'HH24:MI') AS window,
       s."payAmount" AS pay
FROM shifts s
JOIN businesses b ON b.id = s."businessId"
JOIN seeker_profiles sp ON sp."userId" = 'usr_seek_ali'
JOIN availability_slots a
  ON a."seekerId" = sp.id
 AND a.weekday = upper(to_char(s."startsAt", 'Dy'))::"Weekday"
 AND a."startMinute" <= (EXTRACT(HOUR FROM s."startsAt") * 60 + EXTRACT(MINUTE FROM s."startsAt"))
 AND a."endMinute"   >= (EXTRACT(HOUR FROM s."endsAt")   * 60 + EXTRACT(MINUTE FROM s."endsAt"))
WHERE s.status = 'OPEN' AND s."startsAt" > now()
ORDER BY s."startsAt";

\echo ''
\echo '=== 5. Employer dashboard, counted live instead of kept in a counter table'
SELECT b.name AS business,
       count(DISTINCT s.id)                                               AS shifts_posted,
       count(ap.id)                                                       AS applications,
       count(*) FILTER (WHERE ap.status = 'ACCEPTED')                     AS hired,
       count(*) FILTER (WHERE ap.status IN ('APPLIED', 'IN_REVIEW'))      AS waiting_on_you
FROM businesses b
LEFT JOIN shifts s       ON s."businessId" = b.id
LEFT JOIN applications ap ON ap."shiftId" = s.id
GROUP BY b.name
ORDER BY applications DESC, b.name;
