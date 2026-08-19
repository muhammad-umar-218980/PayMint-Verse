-- =====================================================================
-- Security hardening: revoke all table privileges from the anon role.
-- The anon grants in 001/003 were unnecessary — RLS alone gates access,
-- and anon should have no way to touch these tables.
-- Run this in the Supabase SQL editor once. Idempotent.
-- =====================================================================

REVOKE ALL ON public.profiles       FROM anon;
REVOKE ALL ON public.groups         FROM anon;
REVOKE ALL ON public.group_members  FROM anon;
REVOKE ALL ON public.expenses       FROM anon;
REVOKE ALL ON public.expense_splits FROM anon;
REVOKE ALL ON public.settlements    FROM anon;
REVOKE ALL ON public.activity_log   FROM anon;
REVOKE ALL ON public.notifications  FROM anon;
