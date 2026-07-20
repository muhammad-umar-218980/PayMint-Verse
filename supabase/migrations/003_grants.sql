-- =====================================================================
-- Run this in Supabase SQL Editor to grant permissions to the tables
-- =====================================================================

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles       TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.groups         TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.group_members  TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.expenses       TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.expense_splits TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.settlements    TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.activity_log   TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications  TO authenticated;

-- (Optional) also give the same rights to the anon role if needed for public pages
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles       TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.groups         TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.group_members  TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.expenses       TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.expense_splits TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.settlements    TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.activity_log   TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications  TO anon;
