'use server';

import { createClient } from '@/lib/supabase/server';
import { ProfileService } from '../services/profile.service';
import { revalidatePath } from 'next/cache';

const profileService = new ProfileService();

export async function updateProfileAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const fullName = formData.get('full_name') as string;
  const currency = formData.get('currency') as string;
  const timezone = formData.get('timezone') as string;

  const updates = {
    full_name: fullName,
    currency,
    timezone,
  };

  const profile = await profileService.updateProfile(user.id, updates);
  
  if (profile) {
    revalidatePath('/profile');
    revalidatePath('/dashboard');
  }
  
  return profile;
}
