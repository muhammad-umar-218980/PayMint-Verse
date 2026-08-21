-- 010_cleanup_notifications.sql
-- Deletes notifications for deleted groups, expenses and settlements so the
-- bell never shows stale entries. related_id is polymorphic (group / expense /
-- settlement id) and has no foreign key, so triggers do the cleanup.

-- Drop triggers if they already exist (idempotent re-runs).
DROP TRIGGER IF EXISTS trg_cleanup_notifications_groups ON public.groups;
DROP TRIGGER IF EXISTS trg_cleanup_notifications_expenses ON public.expenses;
DROP TRIGGER IF EXISTS trg_cleanup_notifications_settlements ON public.settlements;

-- Recreate the function (CREATE OR REPLACE keeps existing privileges).
CREATE OR REPLACE FUNCTION public.cleanup_notifications()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.notifications WHERE related_id = OLD.id;
  RETURN OLD;
END;
$$;

-- Deleting a group cascades to its expenses and settlements, each firing its
-- own trigger, so every member's notifications are removed.
CREATE TRIGGER trg_cleanup_notifications_groups
AFTER DELETE ON public.groups
FOR EACH ROW
EXECUTE FUNCTION public.cleanup_notifications();

CREATE TRIGGER trg_cleanup_notifications_expenses
AFTER DELETE ON public.expenses
FOR EACH ROW
EXECUTE FUNCTION public.cleanup_notifications();

CREATE TRIGGER trg_cleanup_notifications_settlements
AFTER DELETE ON public.settlements
FOR EACH ROW
EXECUTE FUNCTION public.cleanup_notifications();