-- =====================================================================
-- Notifications: allow users to delete their own notifications.
-- The 002 schema only added SELECT/UPDATE RLS policies; this adds the
-- DELETE policy so the "Clear all" action works from the client.
-- Run this in the Supabase SQL editor once. Idempotent.
-- =====================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'notifications' AND policyname = 'notifications_delete'
  ) THEN
    EXECUTE 'CREATE POLICY "notifications_delete" ON public.notifications
             FOR DELETE TO authenticated USING (user_id = auth.uid())';
  END IF;
END $$;