'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LiveGroupRefresher({ groupId }: { groupId: string }) {
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
        .channel(`group-live-${groupId}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses', filter: `group_id=eq.${groupId}` }, trigger)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'settlements', filter: `group_id=eq.${groupId}` }, trigger)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'activity_log', filter: `group_id=eq.${groupId}` }, trigger)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'group_members', filter: `group_id=eq.${groupId}` }, trigger)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'groups', filter: `id=eq.${groupId}` }, trigger)
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
  }, [groupId, router]);

  return null;
}