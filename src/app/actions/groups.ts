'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createGroup(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const name = formData.get('name') as string;

  if (!name?.trim()) return { error: 'Group name is required' };

  // Create the group
  const { data: group, error: groupError } = await supabase
    .from('groups')
    .insert({ name: name.trim(), created_by: user.id })
    .select()
    .single();

  if (groupError) return { error: groupError.message };

  // Add creator as a member
  const { error: memberError } = await supabase
    .from('group_members')
    .insert({ group_id: group.id, user_id: user.id });

  if (memberError) return { error: memberError.message };

  revalidatePath('/dashboard');
  return { success: true, groupId: group.id };
}
