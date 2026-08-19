import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardSidebar from '@/components/DashboardSidebar';
import { GroupService } from '@/features/groups/services/group.service';
import { ProfileService } from '@/features/profiles/services/profile.service';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const groupService = new GroupService();
  const groups = await groupService.getUserGroups(user.id);

  const profileService = new ProfileService();
  const profile = await profileService.getProfile(user.id);

  return (
    <DashboardSidebar user={user} avatarUrl={profile?.avatar_url ?? null} groups={groups}>
      {children}
    </DashboardSidebar>
  );
}