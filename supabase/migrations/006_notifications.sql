-- =====================================================================
-- Notifications: secure insert helper + realtime.
-- Run this in the Supabase SQL editor once. Idempotent.
-- The notifications table (002) has RLS SELECT/UPDATE policies for the
-- owner only; this SECURITY DEFINER helper lets the app's server actions
-- deliver notifications to other users without weakening RLS.
-- =====================================================================

CREATE OR REPLACE FUNCTION public.send_notification(
  target_user_id UUID,
  p_type TEXT,
  p_message TEXT,
  p_related_id UUID DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.notifications (user_id, type, message, related_id)
  VALUES (target_user_id, p_type, p_message, p_related_id);
END;
$$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
