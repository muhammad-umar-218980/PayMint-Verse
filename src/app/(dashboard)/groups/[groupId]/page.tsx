import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { GroupService } from '@/features/groups/services/group.service';
import { ExpenseService } from '@/features/expenses/services/expense.service';
import { ExpenseRepository } from '@/features/expenses/repositories/expense.repository';
import { AnalyticsService } from '@/features/analytics/services/analytics.service';
import { BalanceService } from '@/features/balances/services/balance.service';
import AddMemberModal from '@/features/groups/components/AddMemberModal';
import AddExpenseModal from '@/features/expenses/components/AddExpenseModal';
import ExpenseList from '@/features/expenses/components/ExpenseList';
import BalancesCard from '@/features/balances/components/BalancesCard';
import CategoryPieChart from '@/features/analytics/components/CategoryPieChart';
import ExportButton from '@/features/analytics/components/ExportButton';
import ActivityFeed from '@/features/activities/components/ActivityFeed';
import GroupActionButton from '@/features/groups/components/GroupActionButton';
import LiveGroupRefresher from '@/features/groups/components/LiveGroupRefresher';
import { ProfileService } from '@/features/profiles/services/profile.service';

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

  const profileService = new ProfileService();
  const profile = await profileService.getProfile(user.id);
  const currency = profile?.currency || 'PKR';

  const membersMap = members.reduce((acc, member) => {
    acc[member.user_id] = member.profile?.full_name || member.profile?.email || 'Unknown';
    return acc;
  }, {} as Record<string, string>);

  const expenseRepo = new ExpenseRepository();
  const expenses = await expenseRepo.getExpensesForGroup(groupId);

  const balanceService = new BalanceService();
  const transactions = await balanceService.getSimplifiedBalances(groupId);

  const net = transactions.reduce((sum, t) => {
    if (t.to === user.id) return sum + t.amount;
    if (t.from === user.id) return sum - t.amount;
    return sum;
  }, 0);

  const analyticsService = new AnalyticsService();
  const categoryData = await analyticsService.getCategoryBreakdown(groupId);

  return (
    <div className="px-6 lg:px-10 py-8 lg:pt-10 pt-[80px] max-w-[920px] mx-auto">
      <LiveGroupRefresher groupId={group.id} />
      {/* Header — like the landing page mockup */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="font-serif text-4xl lg:text-5xl tracking-tight text-ink">{group.name}</h1>
          {group.description && (
            <p className="text-slate-500 mt-2 text-[15px] max-w-md leading-relaxed">{group.description}</p>
          )}
          <div className="flex items-center gap-2.5 mt-3 text-[13px] text-slate-500">
            <span className="font-semibold text-ink">{members.length} people</span>
            <span>·</span>
            <span>{expenses.length} expense{expenses.length !== 1 ? 's' : ''}</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">
              Created {new Date(group.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-3">
          <div className="flex items-baseline gap-2">
            <span className={`text-[11px] uppercase tracking-widest font-bold ${net >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {net >= 0 ? 'You are owed' : 'You owe'}
            </span>
            <span className={`font-serif text-3xl leading-none tracking-tight ${net >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {net < 0 ? '−' : ''}{currency} {Math.abs(net).toLocaleString()}
            </span>
          </div>
          <div className="flex gap-3">
            <GroupActionButton
              groupId={group.id}
              groupName={group.name}
              isOwner={group.created_by === user.id}
            />
            <AddMemberModal groupId={group.id} />
            <AddExpenseModal groupId={group.id} members={members} currentUserId={user.id} currency={currency} />
          </div>
        </div>
      </div>

      {/* Expense list — compact rows like the mockup */}
      <div className="bg-white border border-line rounded-[26px] px-4 sm:px-6 py-3 mb-8 shadow-[0_40px_80px_-40px_rgba(6,46,35,0.12)]">
        <ExpenseList groupId={group.id} membersMap={membersMap} currentUserId={user.id} />
      </div>

      {/* Settlement — mockup "Simplified settlement" section */}
      <div className="mb-8">
        <BalancesCard
          groupId={group.id}
          membersMap={membersMap}
          currentUserId={user.id}
          initialTransactions={transactions}
          currency={currency}
        />
      </div>

      {/* Insights + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-line rounded-[26px] p-6 shadow-[0_40px_80px_-40px_rgba(6,46,35,0.12)]">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-serif text-[22px] tracking-tight text-ink">Spending by Category</h3>
              <p className="text-xs text-slate-500 mt-1">Group spending breakdown.</p>
            </div>
            <ExportButton expenses={expenses} groupName={group.name} />
          </div>
          <CategoryPieChart data={categoryData} currency={currency} />
        </div>

        <ActivityFeed currentUserId={user.id} />
      </div>
    </div>
  );
}
