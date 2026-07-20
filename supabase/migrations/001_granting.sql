-- -------------------------------------------------
-- 1️⃣  Grant basic SELECT/INSERT/UPDATE/DELETE
-- -------------------------------------------------
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles       TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.groups         TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.group_members  TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.expenses       TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.expense_splits TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.settlements    TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.activity_log   TO authenticated;

-- -------------------------------------------------
-- 2️⃣  (Optional) also give the same rights to the anon role
-- -------------------------------------------------
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles       TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.groups         TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.group_members  TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.expenses       TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.expense_splits TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.settlements    TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.activity_log   TO anon;

-- -------------------------------------------------
-- 3️⃣  Re‑enable RLS (just in case)
-- -------------------------------------------------
ALTER TABLE public.profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settlements    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log   ENABLE ROW LEVEL SECURITY;
