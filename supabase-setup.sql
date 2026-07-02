-- =====================================================================
-- PayMint Verse — Full Database Setup
-- Run this ONCE in Supabase SQL Editor after creating a new project
-- =====================================================================

-- ===================== TABLES =====================

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(group_id, user_id)
);

CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  paid_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.expense_splits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id UUID NOT NULL REFERENCES public.expenses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL,
  UNIQUE(expense_id, user_id)
);

CREATE TABLE public.settlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  paid_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  paid_to UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ===================== ENABLE RLS =====================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- ===================== HELPER FUNCTION =====================
-- SECURITY DEFINER function that bypasses RLS to check group membership.
-- This prevents infinite recursion when group_members policies
-- need to reference group_members itself.

CREATE OR REPLACE FUNCTION public.is_group_member(check_group_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.group_members
    WHERE group_id = check_group_id AND user_id = auth.uid()
  );
$$;

-- ===================== RLS POLICIES =====================

-- PROFILES --
CREATE POLICY "profiles_select" ON public.profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "profiles_insert" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_update" ON public.profiles
  FOR UPDATE TO authenticated USING (id = auth.uid());

-- GROUPS --
CREATE POLICY "groups_insert" ON public.groups
  FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "groups_select" ON public.groups
  FOR SELECT TO authenticated
  USING (public.is_group_member(id) OR created_by = auth.uid());

CREATE POLICY "groups_update" ON public.groups
  FOR UPDATE TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "groups_delete" ON public.groups
  FOR DELETE TO authenticated
  USING (created_by = auth.uid());

-- GROUP MEMBERS --
CREATE POLICY "gm_insert" ON public.group_members
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "gm_select" ON public.group_members
  FOR SELECT TO authenticated
  USING (public.is_group_member(group_id));

CREATE POLICY "gm_delete" ON public.group_members
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- EXPENSES --
CREATE POLICY "expenses_select" ON public.expenses
  FOR SELECT TO authenticated
  USING (public.is_group_member(group_id));

CREATE POLICY "expenses_insert" ON public.expenses
  FOR INSERT TO authenticated
  WITH CHECK (public.is_group_member(group_id) AND paid_by = auth.uid());

CREATE POLICY "expenses_delete" ON public.expenses
  FOR DELETE TO authenticated
  USING (paid_by = auth.uid());

-- EXPENSE SPLITS --
CREATE POLICY "splits_select" ON public.expense_splits
  FOR SELECT TO authenticated
  USING (expense_id IN (
    SELECT id FROM public.expenses WHERE public.is_group_member(group_id)
  ));

CREATE POLICY "splits_insert" ON public.expense_splits
  FOR INSERT TO authenticated
  WITH CHECK (expense_id IN (
    SELECT id FROM public.expenses WHERE public.is_group_member(group_id)
  ));

-- SETTLEMENTS --
CREATE POLICY "settlements_select" ON public.settlements
  FOR SELECT TO authenticated
  USING (public.is_group_member(group_id));

CREATE POLICY "settlements_insert" ON public.settlements
  FOR INSERT TO authenticated
  WITH CHECK (public.is_group_member(group_id) AND paid_by = auth.uid());

-- ACTIVITY LOG --
CREATE POLICY "activity_select" ON public.activity_log
  FOR SELECT TO authenticated
  USING (public.is_group_member(group_id));

CREATE POLICY "activity_insert" ON public.activity_log
  FOR INSERT TO authenticated
  WITH CHECK (public.is_group_member(group_id) AND user_id = auth.uid());

-- ===================== AUTO-CREATE PROFILE TRIGGER =====================
-- When a user signs up, automatically create their profile row.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
