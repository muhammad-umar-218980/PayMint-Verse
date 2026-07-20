'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { GroupService } from '../services/group.service';

const groupService = new GroupService();

export async function createGroup(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const name = formData.get('name') as string;
  const description = formData.get('description') as string || '';

  if (!name?.trim()) return { error: 'Group name is required' };

  const group = await groupService.createGroup(name.trim(), description.trim(), user.id);

  if (!group) {
    return { error: 'Failed to create group' };
  }

  revalidatePath('/dashboard');
  return { success: true, groupId: group.id };
}

export async function addMemberAction(groupId: string, email: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  // Look up user by email in profiles table
  const { data: profileToInvite, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single();

  if (profileError || !profileToInvite) {
    return { error: 'No user found with that email address.' };
  }

  // Add them to the group
  const { error: memberError } = await supabase
    .from('group_members')
    .insert({ group_id: groupId, user_id: profileToInvite.id, role: 'member' });

  if (memberError) {
    if (memberError.code === '23505') { // Unique violation
      return { error: 'User is already a member of this group.' };
    }
    return { error: 'Failed to add member to group. Make sure you are the group owner.' };
  }

  revalidatePath(`/groups/${groupId}`);
  return { success: true };
}
