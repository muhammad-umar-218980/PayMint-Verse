-- =====================================================================
-- Enable Supabase Realtime for expense/group-related tables.
-- Run this in the Supabase SQL editor once.
-- NOTE: This only registers tables on the realtime publication (CDC).
-- It makes NO schema, RLS, constraint, or data changes.
-- Re-running is safe (idempotent guard per table).
-- =====================================================================

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.expenses;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.expense_splits;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.settlements;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_log;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.group_members;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.groups;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;