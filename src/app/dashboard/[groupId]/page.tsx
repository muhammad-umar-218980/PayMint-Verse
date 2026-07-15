import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function GroupPage({ params }: { params: Promise<{ groupId: string }> }) {
  const resolvedParams = await params;
  const groupId = resolvedParams.groupId;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  // Verify membership and fetch group details
  const { data: member, error } = await supabase
    .from('group_members')
    .select('id, groups(id, name, created_at)')
    .eq('group_id', groupId)
    .eq('user_id', user.id)
    .single();

  if (!member || !member.groups) notFound();

  const group = member.groups as any;

  return (
    <div className="min-h-screen bg-[#080c14] text-white font-sans">
      {/* Background glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Navbar */}
      <header className="border-b border-white/5 bg-[#080c14]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-violet-900/40 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <span className="font-space font-bold text-lg">{group.name}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-10 relative z-10">
        <div className="mb-8">
          <h1 className="font-space text-3xl font-bold text-white mb-2">{group.name}</h1>
          <p className="text-slate-400 text-sm">
            Created on {new Date(group.created_at).toLocaleDateString()}
          </p>
        </div>

        {/* Coming Soon Banner */}
        <div className="bg-violet-950/30 border border-violet-800/30 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-violet-700/30 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-semibold text-lg">Expenses & Balances</p>
              <p className="text-slate-500 text-sm mt-0.5">We are building the expense splitting engine right now!</p>
            </div>
          </div>
          <button
            disabled
            className="w-full md:w-auto bg-violet-700/50 text-white/50 text-sm font-semibold px-6 py-3 rounded-xl cursor-not-allowed border border-violet-600/30"
          >
            + Add Expense
          </button>
        </div>
      </main>
    </div>
  );
}
