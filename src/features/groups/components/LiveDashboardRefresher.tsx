'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LiveDashboardRefresher() {
  const router = useRouter();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const trigger = () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => router.refresh(), 300);
    };

    try {
      const channel = supabase
        .channel('dashboard-live')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' }, trigger)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'expense_splits' }, trigger)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'settlements' }, trigger)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'activity_log' }, trigger)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'group_members' }, trigger)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'groups' }, trigger)
        .subscribe();

      return () => {
        if (timer.current) clearTimeout(timer.current);
        supabase.removeChannel(channel);
      };
    } catch {
      // Realtime unavailable — degrade gracefully, app works as before.
      return () => {
        if (timer.current) clearTimeout(timer.current);
      };
    }
  }, [router]);

  return null;
}