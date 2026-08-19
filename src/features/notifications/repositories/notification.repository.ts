import { createClient } from '@/lib/supabase/server';
import { Notification } from '@/types';

export class NotificationRepository {
  async getRecent(userId: string, limit = 20): Promise<Notification[]> {
    const supabase = await createClient();
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    return (data ?? []) as Notification[];
  }

  async getUnreadCount(userId: string): Promise<number> {
    const supabase = await createClient();
    const { count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);
    return count ?? 0;
  }

  async markAllRead(userId: string): Promise<void> {
    const supabase = await createClient();
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);
  }

  async send(
    targetUserId: string,
    type: string,
    message: string,
    relatedId?: string | null
  ): Promise<void> {
    const supabase = await createClient();
    await supabase.rpc('send_notification', {
      target_user_id: targetUserId,
      p_type: type,
      p_message: message,
      p_related_id: relatedId ?? null,
    });
  }
}
