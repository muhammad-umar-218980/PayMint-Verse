-- Fix for expenses RLS policies
-- We want any group member to be able to add an expense on behalf of anyone else in the group.
-- Previously, the policy restricted it so that you could ONLY add an expense if `paid_by = auth.uid()`.

DROP POLICY IF EXISTS "expenses_insert" ON public.expenses;
DROP POLICY IF EXISTS "expenses_delete" ON public.expenses;

CREATE POLICY "expenses_insert" ON public.expenses 
  FOR INSERT TO authenticated 
  WITH CHECK (public.is_group_member(group_id));

CREATE POLICY "expenses_delete" ON public.expenses 
  FOR DELETE TO authenticated 
  USING (public.is_group_member(group_id));
