import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import CreateGroupModal from '@/components/CreateGroupModal';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  // Fetch user's profile from the profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', user.id)
    .single();

  // Fetch user's groups
  const { data: groups } = await supabase
    .from('group_members')
    .select('group_id, groups(id, name, created_at)')
    .eq('user_id', user.id);

  const displayName = profile?.full_name ?? user.email ?? 'there';
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-[#080c14] text-white font-sans">
      {/* Background glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Navbar */}
      <header className="border-b border-white/5 bg-[#080c14]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="PayMint Verse Logo" className="w-9 h-9 drop-shadow-[0_0_8px_rgba(124,58,237,0.4)]" />
            <span className="font-space text-xl font-bold">
              Pay<span className="text-violet-400">Mint</span> Verse
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-violet-700 flex items-center justify-center text-sm font-bold text-white">
              {initials}
            </div>
            <div className="text-sm">
              <p className="font-semibold text-white">{profile?.full_name ?? 'User'}</p>
              <p className="text-slate-500 text-xs">{user.email}</p>
            </div>
            <form action="/auth/signout" method="POST" className="ml-4">
              <button
                type="submit"
                className="text-xs text-slate-500 hover:text-white border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg transition-all"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-10 relative z-10">

        {/* Welcome Banner */}
        <div className="mb-10">
          <h1 className="font-space text-3xl font-bold text-white mb-1">
            Welcome back, <span className="text-violet-400">{profile?.full_name?.split(' ')[0] ?? 'there'}</span> 👋
          </h1>
          <p className="text-slate-400 text-sm">Here&apos;s a summary of your shared expenses.</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Total Groups', value: groups?.length ?? 0, color: 'text-violet-400' },
            { label: 'You Are Owed', value: 'Rs. 0', color: 'text-emerald-400' },
            { label: 'You Owe', value: 'Rs. 0', color: 'text-red-400' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-[#151f30] border border-white/5 rounded-2xl p-5 hover:border-violet-900/40 transition-colors"
            >
              <p className="text-slate-500 text-xs font-medium mb-1">{stat.label}</p>
              <p className={`font-space text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Groups Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-space text-lg font-bold text-white">Your Groups</h2>
            <CreateGroupModal />
          </div>

          {groups && groups.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups.map((gm: any) => (
                <Link href={`/dashboard/${gm.group_id}`} key={gm.group_id}>
                  <div
                    className="bg-[#151f30] border border-white/5 rounded-2xl p-5 hover:border-violet-900/40 transition-colors cursor-pointer h-full"
                  >
                    <div className="w-10 h-10 bg-violet-900/40 rounded-xl flex items-center justify-center mb-3">
                      <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                      </svg>
                    </div>
                    <p className="font-space font-semibold text-white">{gm.groups?.name ?? 'Unnamed Group'}</p>
                    <p className="text-slate-500 text-xs mt-1">View expenses & balances</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-[#151f30] border border-dashed border-white/10 rounded-2xl p-10 text-center">
              <p className="text-slate-500 text-sm">You haven&apos;t joined any groups yet.</p>
              <p className="text-slate-600 text-xs mt-1">Create a group to start splitting expenses.</p>
            </div>
          )}
        </div>

        {/* Coming Soon Banner */}
        <div className="bg-violet-950/30 border border-violet-800/30 rounded-2xl p-6 flex items-center gap-4">
          <div className="w-10 h-10 bg-violet-700/30 rounded-xl flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
            </svg>
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Expense & Settlement features coming next</p>
            <p className="text-slate-500 text-xs mt-0.5">Create Group → Add Expenses → Split → Settle Up. That&apos;s the next build phase.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
