-- =====================================================================
-- PayMint Verse — Full Database Schema Rebuild (Phase 2)
-- Run this in Supabase SQL Editor to rebuild the advanced schema.
-- WARNING: This will drop existing tables and data!
-- =====================================================================

-- 1. Drop existing tables and functions to allow a clean rebuild
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.is_group_member(UUID) CASCADE;

DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.activity_log CASCADE;
DROP TABLE IF EXISTS public.settlements CASCADE;
DROP TABLE IF EXISTS public.expense_splits CASCADE;
DROP TABLE IF EXISTS public.expenses CASCADE;
DROP TABLE IF EXISTS public.group_members CASCADE;
DROP TABLE IF EXISTS public.groups CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. Create Enums
CREATE TYPE public.group_role AS ENUM ('owner', 'admin', 'moderator', 'member');
CREATE TYPE public.split_type AS ENUM ('equal', 'custom', 'percentage', 'shares');
CREATE TYPE public.settlement_status AS ENUM ('pending', 'completed', 'failed');
CREATE TYPE public.settlement_method AS ENUM ('cash', 'bank_transfer', 'easypaisa', 'jazzcash', 'other');

-- 3. Create Tables

-- PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  currency TEXT DEFAULT 'PKR',
  timezone TEXT DEFAULT 'Asia/Karachi',
  theme TEXT DEFAULT 'system',
  notification_settings JSONB DEFAULT '{"email": true, "push": true}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- GROUPS
CREATE TABLE public.groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- GROUP MEMBERS
CREATE TABLE public.group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role public.group_role DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- EXPENSES
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  currency TEXT DEFAULT 'PKR',
  category TEXT DEFAULT 'Other',
  receipt_url TEXT,
  split_type public.split_type DEFAULT 'equal',
  paid_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- EXPENSE SPLITS
CREATE TABLE public.expense_splits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id UUID NOT NULL REFERENCES public.expenses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount_owed NUMERIC(12,2) NOT NULL,
  percentage NUMERIC(5,2),
  shares INTEGER,
  is_settled BOOLEAN DEFAULT false,
  UNIQUE(expense_id, user_id)
);

-- SETTLEMENTS
CREATE TABLE public.settlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  paid_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  paid_to UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  method public.settlement_method DEFAULT 'cash',
  status public.settlement_status DEFAULT 'completed',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ACTIVITY LOG
CREATE TABLE public.activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- NOTIFICATIONS
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  related_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);


-- 4. Helper Function for RLS
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

-- 5. Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies

-- Profiles
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());

-- Groups
CREATE POLICY "groups_insert" ON public.groups FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "groups_select" ON public.groups FOR SELECT TO authenticated USING (public.is_group_member(id) OR created_by = auth.uid());
CREATE POLICY "groups_update" ON public.groups FOR UPDATE TO authenticated USING (created_by = auth.uid());
CREATE POLICY "groups_delete" ON public.groups FOR DELETE TO authenticated USING (created_by = auth.uid());

-- Group Members
CREATE POLICY "gm_insert" ON public.group_members FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.groups WHERE id = group_id AND created_by = auth.uid()));
CREATE POLICY "gm_select" ON public.group_members FOR SELECT TO authenticated USING (public.is_group_member(group_id));
CREATE POLICY "gm_delete" ON public.group_members FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Expenses
CREATE POLICY "expenses_select" ON public.expenses FOR SELECT TO authenticated USING (public.is_group_member(group_id));
CREATE POLICY "expenses_insert" ON public.expenses FOR INSERT TO authenticated WITH CHECK (public.is_group_member(group_id) AND paid_by = auth.uid());
CREATE POLICY "expenses_update" ON public.expenses FOR UPDATE TO authenticated USING (public.is_group_member(group_id));
CREATE POLICY "expenses_delete" ON public.expenses FOR DELETE TO authenticated USING (paid_by = auth.uid());

-- Expense Splits
CREATE POLICY "splits_select" ON public.expense_splits FOR SELECT TO authenticated USING (expense_id IN (SELECT id FROM public.expenses WHERE public.is_group_member(group_id)));
CREATE POLICY "splits_insert" ON public.expense_splits FOR INSERT TO authenticated WITH CHECK (expense_id IN (SELECT id FROM public.expenses WHERE public.is_group_member(group_id)));
CREATE POLICY "splits_update" ON public.expense_splits FOR UPDATE TO authenticated USING (expense_id IN (SELECT id FROM public.expenses WHERE public.is_group_member(group_id)));

-- Settlements
CREATE POLICY "settlements_select" ON public.settlements FOR SELECT TO authenticated USING (public.is_group_member(group_id));
CREATE POLICY "settlements_insert" ON public.settlements FOR INSERT TO authenticated WITH CHECK (public.is_group_member(group_id) AND paid_by = auth.uid());

-- Activity Log
CREATE POLICY "activity_select" ON public.activity_log FOR SELECT TO authenticated USING (public.is_group_member(group_id));
CREATE POLICY "activity_insert" ON public.activity_log FOR INSERT TO authenticated WITH CHECK (public.is_group_member(group_id) AND user_id = auth.uid());

-- Notifications
CREATE POLICY "notifications_select" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "notifications_update" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- 7. Triggers

-- Trigger: Auto Update Timestamp Function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON public.groups FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON public.expenses FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_settlements_updated_at BEFORE UPDATE ON public.settlements FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Trigger: Auto Create Profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
