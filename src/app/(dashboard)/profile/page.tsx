import { createClient } from '@/lib/supabase/server';
import { ProfileService } from '@/features/profiles/services/profile.service';
import ProfileForm from '@/features/profiles/components/ProfileForm';
import { User } from 'lucide-react';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div className="text-white p-10">Unauthorized</div>;
  }

  const profileService = new ProfileService();
  const profile = await profileService.getProfile(user.id);

  if (!profile) {
    return (
      <div className="px-6 lg:px-10 py-8 lg:pt-10 pt-[80px]">
        <div className="bg-[#151f30] border border-red-900/30 rounded-2xl p-10 text-center max-w-lg mx-auto">
          <p className="text-red-400 font-medium">Error loading profile. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 lg:px-10 py-8 lg:pt-10 pt-[80px]">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-space text-3xl font-bold text-white mb-1">Your Profile</h1>
        <p className="text-slate-400 text-sm">Manage your account settings and preferences</p>
      </div>

      {/* Profile Card */}
      <div className="bg-[#151f30] border border-violet-900/20 rounded-2xl p-8 max-w-2xl">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/5">
          <div className="w-14 h-14 rounded-full bg-violet-900/40 border border-violet-700/40 flex items-center justify-center">
            <User className="w-7 h-7 text-violet-400" />
          </div>
          <div>
            <p className="font-space font-bold text-white text-lg">{profile.full_name || 'Set your name'}</p>
            <p className="text-slate-400 text-sm">{profile.email}</p>
          </div>
        </div>

        <ProfileForm initialProfile={profile} />
      </div>
    </div>
  );
}
