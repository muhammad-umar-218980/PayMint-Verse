import { createClient } from '@/lib/supabase/server';
import { Group, GroupMember } from '@/types';

export class GroupRepository {
  async getGroupsForUser(userId: string): Promise<Group[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('group_members')
      .select('groups(*)')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching groups:', error);
      return [];
    }

    return data.map((d: any) => d.groups as Group);
  }

  async getGroupById(groupId: string): Promise<Group | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .eq('id', groupId)
      .single();

    if (error) {
      console.error('Error fetching group:', error);
      return null;
    }
    return data as Group;
  }

  async createGroup(name: string, description: string, createdBy: string): Promise<Group | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('groups')
      .insert({ name, description, created_by: createdBy })
      .select()
      .single();

    if (error) {
      console.error('Error creating group:', error);
      return null;
    }
    return data as Group;
  }

  async addMember(groupId: string, userId: string, role: string = 'member'): Promise<GroupMember | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('group_members')
      .insert({ group_id: groupId, user_id: userId, role })
      .select()
      .single();

    if (error) {
      console.error('Error adding member:', error);
      return null;
    }
    return data as GroupMember;
  }
}
