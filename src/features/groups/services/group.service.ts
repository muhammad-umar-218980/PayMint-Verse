import { createClient } from '@/lib/supabase/server';
import { GroupRepository } from '../repositories/group.repository';
import { Group } from '@/types';

const groupRepo = new GroupRepository();

export class GroupService {
  async getUserGroups(userId: string): Promise<Group[]> {
    return groupRepo.getGroupsForUser(userId);
  }

  async getGroupDetails(groupId: string): Promise<Group | null> {
    return groupRepo.getGroupById(groupId);
  }

  async createGroup(name: string, description: string, userId: string): Promise<Group | null> {
    // Use a single Supabase client for the entire transaction to preserve auth context
    const supabase = await createClient();

    // 1. Create the group
    const { data: group, error: groupError } = await supabase
      .from('groups')
      .insert({ name, description, created_by: userId })
      .select()
      .single();

    if (groupError) {
      console.error('Error creating group:', groupError);
      return null;
    }

    // 2. Add creator as 'owner' using the SAME client
    const { error: memberError } = await supabase
      .from('group_members')
      .insert({ group_id: group.id, user_id: userId, role: 'owner' });

    if (memberError) {
      console.error('Error adding member:', memberError);
      // Group was created but member add failed — still return the group
    }

    return group as Group;
  }
}
