'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { GroupService } from '../services/group.service';
import { ActivityService } from '@/features/activities/services/activity.service';
import { NotificationService } from '@/features/notifications/services/notification.service';

const groupService = new GroupService();
const activityService = new ActivityService();
const notificationService = new NotificationService();

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

// Log activity
  await activityService.logMemberAdded(user.id, groupId, profileToInvite.id);

  // Notify the new member
  const { data: group } = await supabase
    .from('groups')
    .select('name')
    .eq('id', groupId)
    .single();
  const actorName = (user.user_metadata?.full_name as string) || 'Someone';
  await notificationService.send(
    profileToInvite.id,
    'member_added',
    `${actorName} added you to "${group?.name ?? 'a group'}"`,
    groupId
  );

  revalidatePath(`/groups/${groupId}`);
  return { success: true };
}

export async function deleteGroupAction(groupId: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const success = await groupService.deleteGroup(groupId);

  if (!success) {
    return { error: 'Failed to delete group or permission denied.' };
  }

  revalidatePath('/dashboard');
  revalidatePath(`/groups/${groupId}`);
  return { success: true };
}

export async function leaveGroupAction(groupId: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const success = await groupService.leaveGroup(groupId, user.id);

  if (!success) {
    return { error: 'Failed to leave this group.' };
  }

  revalidatePath('/dashboard');
  revalidatePath(`/groups/${groupId}`);
  return { success: true };
}

export async function deleteAllGroupsAction() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { error } = await supabase
    .from('groups')
    .delete()
    .eq('created_by', user.id);

  if (error) {
    console.error('Error deleting all groups:', error);
    return { error: 'Failed to delete your groups.' };
  }

  revalidatePath('/dashboard');
  return { success: true };
}
