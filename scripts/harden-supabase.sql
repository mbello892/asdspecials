-- ─────────────────────────────────────────────────────────────
-- Hardens Payload-managed tables on Supabase Postgres.
--
-- Why: Supabase auto-grants SELECT/INSERT/UPDATE/DELETE on every
-- table in schema `public` to the `anon` and `authenticated`
-- roles so the REST API (PostgREST) can serve them. For tables
-- managed by Payload, this is wrong — Payload connects as the
-- database owner and bypasses RLS, but the Supabase JS client
-- from any browser can still hit these tables using the public
-- `NEXT_PUBLIC_SUPABASE_ANON_KEY`. That means anyone could read
-- admin users, session tokens, product pricing, etc.
--
-- This script:
--   1. Enables RLS on every public table (deny-all for non-owner
--      roles since no policies are defined).
--   2. Revokes all privileges from `anon` and `authenticated` on
--      existing tables / sequences / functions.
--   3. Sets default privileges so future objects created by the
--      current role inherit the same restrictions.
--
-- Idempotent. Re-run after every Payload schema change.
-- ─────────────────────────────────────────────────────────────

-- 1. Enable RLS on every public table (idempotent — ALTER TABLE
--    ... ENABLE RLS is a no-op if already enabled).
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format(
      'ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY',
      r.tablename
    );
  END LOOP;
END$$;

-- 2. Revoke blanket privileges from Supabase public roles.
REVOKE ALL ON ALL TABLES    IN SCHEMA public FROM anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM anon, authenticated;

-- 3. Apply default privileges to objects created in the future by
--    whoever is running this (Payload connects as db owner, so
--    defaults for that role cover subsequent migrations).
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  REVOKE ALL ON TABLES    FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  REVOKE ALL ON SEQUENCES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  REVOKE ALL ON FUNCTIONS FROM anon, authenticated;

-- 4. Audit — list any public table that still has RLS disabled
--    or any grants remaining to anon/authenticated. After a
--    successful run this should return zero rows.
SELECT
  c.relname AS table,
  c.relrowsecurity AS rls_enabled
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relkind = 'r'
  AND c.relrowsecurity = false;
