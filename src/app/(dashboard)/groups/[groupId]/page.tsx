import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { GroupService } from '@/features/groups/services/group.service';
import Link from 'next/link';
import { ArrowLeft, Users, Calendar, Receipt } from 'lucide-react';
import AddMemberModal from '@/features/groups/components/AddMemberModal';
import { ExpenseService } from '@/features/expenses/services/expense.service';
import AddExpenseModal from '@/features/expenses/components/AddExpenseModal';
import ExpenseList from '@/features/expenses/components/ExpenseList';
import BalancesCard from '@/features/balances/components/BalancesCard';

export default async function GroupPage({ params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const groupService = new GroupService();
  const group = await groupService.getGroupDetails(groupId);

  if (!group) {
    notFound();
  }

  const expenseService = new ExpenseService();
  const members = await expenseService.getGroupMembers(groupId);
  
  // Create a map for easy lookup
  const membersMap = members.reduce((acc, member) => {
    acc[member.user_id] = member.profile?.full_name || member.profile?.email || 'Unknown';
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="px-6 lg:px-10 py-8 lg:pt-10 pt-[80px]">
      {/* Back Link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-violet-400 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Group Header Card */}
      <div className="bg-[#151f30] border border-violet-900/20 rounded-2xl p-8 mb-8">
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 rounded-xl bg-violet-900/30 border border-violet-700/40 flex items-center justify-center shrink-0">
            <Users className="w-7 h-7 text-violet-400" />
          </div>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-1">
              <h1 className="font-space text-2xl md:text-3xl font-bold text-white">{group.name}</h1>
              <AddMemberModal groupId={group.id} />
            </div>
            {group.description && (
              <p className="text-slate-400 text-[15px] leading-relaxed mb-4">{group.description}</p>
            )}
            <div className="flex items-center gap-4 text-[12px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Created {new Date(group.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                {members.length} Member{members.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Expenses */}
        <div className="lg:col-span-2">
          {/* Expense Header Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="font-space text-xl font-bold text-white">Expenses</h2>
            <AddExpenseModal groupId={group.id} members={members} currentUserId={user.id} />
          </div>

          {/* Expenses List */}
          <div className="bg-[#151f30]/50 border border-violet-900/10 rounded-2xl p-4 md:p-6 min-h-[400px]">
            <ExpenseList groupId={group.id} membersMap={membersMap} currentUserId={user.id} />
          </div>
        </div>

        {/* Right Column: Balances */}
        <div className="lg:col-span-1">
          <BalancesCard groupId={group.id} membersMap={membersMap} currentUserId={user.id} />
        </div>
      </div>
    </div>
  );
}
