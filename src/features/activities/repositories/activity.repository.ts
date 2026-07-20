import { createClient } from '@/lib/supabase/server';
import { ActivityLog } from '@/types';

export class ActivityRepository {
  /**
   * Insert a new activity log record.
   */
  async logActivity(data: {
    group_id: string;
    user_id: string;
    action: string;
    target_type?: string;
    target_id?: string;
    details?: Record<string, any>;
  }): Promise<boolean> {
    const supabase = await createClient();
    const { error } = await supabase
      .from('activity_log')
      .insert(data);

    if (error) {
      console.error('Error logging activity:', error);
      return false;
    }
    return true;
  }

  /**
   * Fetch the most recent activities for a user (across all their groups).
   */
  async getUserActivityFeed(userId: string, limit: number = 20): Promise<(ActivityLog & { profile: { full_name: string | null; email: string }, group: { name: string } })[]> {
    const supabase = await createClient();
    
    // First, find all group IDs the user belongs to
    const { data: userGroups } = await supabase
      .from('group_members')
      .select('group_id')
      .eq('user_id', userId);

    if (!userGroups || userGroups.length === 0) {
      return [];
    }

    const groupIds = userGroups.map(g => g.group_id);

    // Then fetch activities for those groups, joining with profiles and groups
    const { data, error } = await supabase
      .from('activity_log')
      .select('*, profile:profiles!activity_log_user_id_fkey(full_name, email), group:groups!activity_log_group_id_fkey(name)')
      .in('group_id', groupIds)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching activity feed:', error);
      return [];
    }

    return data as any;
  }
}
