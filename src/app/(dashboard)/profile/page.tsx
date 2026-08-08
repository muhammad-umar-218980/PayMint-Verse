import { createClient } from '@/lib/supabase/server';
import { ProfileService } from '@/features/profiles/services/profile.service';
import ProfileForm from '@/features/profiles/components/ProfileForm';
import { User } from 'lucide-react';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div className="text-ink p-10">Unauthorized</div>;
  }

  const profileService = new ProfileService();
  const profile = await profileService.getProfile(user.id);

  if (!profile) {
    return (
      <div className="px-6 lg:px-10 py-8 lg:pt-10 pt-[80px]">
        <div className="bg-white border border-red-200 rounded-2xl p-10 text-center max-w-lg mx-auto">
          <p className="text-red-600 font-medium">Error loading profile. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 lg:px-10 py-8 lg:pt-10 pt-[80px] max-w-[920px] mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-serif text-4xl tracking-tight text-ink mb-1">Your Profile</h1>
        <p className="text-slate-500 text-sm">Manage your account settings and preferences</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white border border-line rounded-[26px] p-8 max-w-2xl shadow-[0_40px_80px_-40px_rgba(6,46,35,0.12)]">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-line">
          <div className="w-14 h-14 rounded-full bg-emerald-600/10 border border-emerald-600/20 flex items-center justify-center">
            <User className="w-7 h-7 text-emerald-600" />
          </div>
          <div>
            <p className="font-serif text-2xl tracking-tight text-ink">{profile.full_name || 'Set your name'}</p>
            <p className="text-slate-500 text-sm">{profile.email}</p>
          </div>
        </div>

        <ProfileForm initialProfile={profile} />
      </div>
    </div>
  );
}
