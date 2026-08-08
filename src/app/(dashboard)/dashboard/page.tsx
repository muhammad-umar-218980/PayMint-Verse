import { createClient } from '@/lib/supabase/server';
import { GroupService } from '@/features/groups/services/group.service';
import { ExpenseService } from '@/features/expenses/services/expense.service';
import { ExpenseRepository } from '@/features/expenses/repositories/expense.repository';
import { BalanceService } from '@/features/balances/services/balance.service';
import { AnalyticsService } from '@/features/analytics/services/analytics.service';
import { ProfileService } from '@/features/profiles/services/profile.service';
import CreateGroupModal from '@/features/groups/components/CreateGroupModal';
import GroupCard from '@/features/groups/components/GroupCard';
import DeleteAllGroupsButton from '@/features/groups/components/DeleteAllGroupsButton';
import ActivityFeed from '@/features/activities/components/ActivityFeed';
import CategoryPieChart from '@/features/analytics/components/CategoryPieChart';
import LiveDashboardRefresher from '@/features/groups/components/LiveDashboardRefresher';
import { Users, TrendingUp, HandCoins, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const profileService = new ProfileService();
  const profile = await profileService.getProfile(user.id);

  const fullName = profile?.full_name || (user.user_metadata?.full_name as string) || '';
  const firstName = fullName.split(' ')[0] || 'there';

  const groupService = new GroupService();
  const groups = await groupService.getUserGroups(user.id);

  if (groups.length === 0) {
    return (
      <div className="px-6 lg:px-10 py-8 lg:pt-10 pt-[80px]">
        <p className="text-[11px] uppercase tracking-widest font-bold text-emerald-600 mb-3">Dashboard</p>
        <h1 className="font-serif text-4xl lg:text-5xl tracking-tight text-ink mb-2">Welcome back, {firstName}</h1>
        <div className="bg-white border border-line rounded-[26px] p-12 text-center max-w-xl mx-auto mt-8 shadow-[0_40px_80px_-40px_rgba(6,46,35,0.15)]">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600/10 border border-emerald-600/20 flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="font-serif text-2xl tracking-tight text-ink mb-3">Create your first group</h2>
          <p className="text-slate-500 text-[15px] mb-7 leading-relaxed max-w-sm mx-auto">
            Start splitting expenses with friends, family, or roommates.
          </p>
          <CreateGroupModal triggerLabel="+ New group" />
        </div>
      </div>
    );
  }

  const expenseService = new ExpenseService();
  const expenseRepo = new ExpenseRepository();
  const balanceService = new BalanceService();

  const details = await Promise.all(
    groups.map(async (g) => {
      const [members, expenses, transactions] = await Promise.all([
        expenseService.getGroupMembers(g.id),
        expenseRepo.getExpensesForGroup(g.id),
        balanceService.getSimplifiedBalances(g.id),
      ]);

      const net = transactions.reduce((sum, t) => {
        if (t.to === user.id) return sum + t.amount;
        if (t.from === user.id) return sum - t.amount;
        return sum;
      }, 0);

      const spent = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

      return {
        group: g,
        membersCount: members.length,
        expensesCount: expenses.length,
        net,
        spent,
      };
    })
  );

  const totalOwedToYou = details.reduce((s, d) => s + Math.max(d.net, 0), 0);
  const totalYouOwe = details.reduce((s, d) => s + Math.max(-d.net, 0), 0);
  const totalSpent = details.reduce((s, d) => s + d.spent, 0);
  const totalExpenses = details.reduce((s, d) => s + d.expensesCount, 0);
  const netTotal = totalOwedToYou - totalYouOwe;

  const analyticsService = new AnalyticsService();
  const categoryData = (
    await Promise.all(groups.map((g) => analyticsService.getCategoryBreakdown(g.id)))
  ).flat().reduce((map, c) => {
    map[c.name] = (map[c.name] || 0) + c.value;
    return map;
  }, {} as Record<string, number>);

  const categoryList = Object.entries(categoryData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const kpis = [
    {
      label: 'Active groups',
      icon: <Users className="w-4 h-4 text-emerald-600" />,
      value: String(groups.length),
      sub: 'Across your account',
      color: 'text-ink',
    },
    {
      label: 'Total spent',
      icon: <TrendingUp className="w-4 h-4 text-emerald-600" />,
      value: `PKR ${totalSpent.toLocaleString()}`,
      sub: `${totalExpenses} expense${totalExpenses !== 1 ? 's' : ''} total`,
      color: 'text-ink',
    },
    {
      label: 'You are owed',
      icon: <HandCoins className="w-4 h-4 text-emerald-600" />,
      value: `PKR ${totalOwedToYou.toLocaleString()}`,
      sub: 'Across all groups',
      color: 'text-emerald-600',
    },
    {
      label: 'You owe',
      icon: <Wallet className="w-4 h-4 text-emerald-600" />,
      value: `PKR ${totalYouOwe.toLocaleString()}`,
      sub: 'Pending settlements',
      color: 'text-red-500',
    },
  ];

  return (
    <div className="px-6 lg:px-10 py-8 lg:pt-10 pt-[80px] max-w-[1100px] mx-auto">
      <LiveDashboardRefresher />
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">
<div>
            <p className="text-[11px] uppercase tracking-widest font-bold text-emerald-600 mb-3">Dashboard</p>
            <h1 className="font-serif text-4xl lg:text-5xl tracking-tight text-ink">Welcome back, {firstName}</h1>
            <p className="text-slate-500 text-[15px] mt-2">
              Here&rsquo;s what&rsquo;s happening across your {groups.length} group{groups.length !== 1 ? 's' : ''}.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <DeleteAllGroupsButton />
            <CreateGroupModal triggerLabel="+ New group" />
          </div>
        </div>

      {/* Hero — net balance */}
      <section
        className="rounded-[26px] border border-line overflow-hidden mb-8"
        style={{ background: 'linear-gradient(120deg, rgba(5,150,105,0.10), rgba(52,211,153,0.10))' }}
      >
        <div className="px-6 lg:px-10 py-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <p className="text-[11px] uppercase tracking-widest font-bold text-emerald-700 mb-2">Net balance · All groups</p>
            <p className={`font-serif text-5xl lg:text-6xl tracking-tight leading-none ${netTotal >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {netTotal >= 0 ? '+' : '−'}PKR {Math.abs(netTotal).toLocaleString()}
            </p>
            <p className="text-[13px] text-slate-500 mt-3">The simplified view of what everyone owes, across every group.</p>
          </div>
          <div className="flex flex-col gap-3 lg:items-end">
            <div className="bg-white rounded-2xl border border-line px-5 py-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-600/10 flex items-center justify-center shrink-0">
                <ArrowUpRight className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Owed to you</p>
                <p className="font-serif text-xl tracking-tight text-emerald-600">PKR {totalOwedToYou.toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-line px-5 py-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">You owe</p>
                <p className="font-serif text-xl tracking-tight text-red-500">PKR {totalYouOwe.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white border border-line rounded-[26px] p-5 shadow-[0_40px_80px_-40px_rgba(6,46,35,0.12)]"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] uppercase tracking-widest font-bold text-slate-500">{kpi.label}</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-600/10 flex items-center justify-center shrink-0">
                {kpi.icon}
              </div>
            </div>
            <p className={`font-serif text-[28px] leading-none tracking-tight ${kpi.color}`}>{kpi.value}</p>
            <p className="text-xs text-slate-400 mt-2">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Groups + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-white border border-line rounded-[26px] overflow-hidden shadow-[0_40px_80px_-40px_rgba(6,46,35,0.12)]">
          <div className="px-6 py-5 border-b border-line bg-[#F5F7F4]/50">
            <h2 className="font-serif text-[22px] tracking-tight text-ink">Your groups</h2>
            <p className="text-xs text-slate-500 mt-1">Jump into a group to add expenses or settle up.</p>
          </div>
          <div className="divide-y divide-line">
            {details.map((d) => (
              <GroupCard
                key={d.group.id}
                group={d.group}
                membersCount={d.membersCount}
                expensesCount={d.expensesCount}
                netBalance={d.net}
                currentUserId={user.id}
              />
            ))}
          </div>
        </div>

        <ActivityFeed currentUserId={user.id} />
      </div>

      {/* Insights */}
      <div className="bg-white border border-line rounded-[26px] p-6 shadow-[0_40px_80px_-40px_rgba(6,46,35,0.12)]">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-serif text-[22px] tracking-tight text-ink">Spending by Category</h2>
            <p className="text-xs text-slate-500 mt-1">Where your money went, across all groups.</p>
          </div>
        </div>
        <CategoryPieChart data={categoryList} />
      </div>
    </div>
  );
}
