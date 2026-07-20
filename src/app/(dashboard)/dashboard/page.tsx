import { createClient } from '@/lib/supabase/server';
import { GroupService } from '@/features/groups/services/group.service';
import GroupCard from '@/features/groups/components/GroupCard';
import CreateGroupModal from '@/features/groups/components/CreateGroupModal';
import { Users } from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const groupService = new GroupService();
  const groups = user ? await groupService.getUserGroups(user.id) : [];

  return (
    <div className="px-6 lg:px-10 py-8 lg:pt-10 pt-[80px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="font-space text-3xl font-bold text-white mb-1">Your Groups</h1>
          <p className="text-slate-400 text-sm">{groups.length} group{groups.length !== 1 ? 's' : ''} active</p>
        </div>
        <CreateGroupModal />
      </div>

      {groups.length === 0 ? (
        <div className="bg-[#151f30] border border-violet-900/20 rounded-2xl p-12 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-violet-900/30 border border-violet-700/40 flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8 text-violet-400" />
          </div>
          <h3 className="font-space text-xl font-bold text-white mb-3">No groups yet</h3>
          <p className="text-slate-400 text-[15px] mb-6 leading-relaxed">
            Create your first group to start splitting expenses with friends, family, or roommates.
          </p>
          <CreateGroupModal />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      )}
    </div>
  );
}
