import { ActivityRepository } from '../repositories/activity.repository';
import { Receipt, HandCoins, UserPlus, Trash2 } from 'lucide-react';

interface ActivityFeedProps {
  currentUserId: string;
}

export default async function ActivityFeed({ currentUserId }: ActivityFeedProps) {
  const repo = new ActivityRepository();
  const activities = await repo.getUserActivityFeed(currentUserId, 15);

  if (activities.length === 0) {
    return (
      <div className="bg-white border border-line rounded-[26px] p-6 h-full min-h-[300px] flex flex-col items-center justify-center text-center shadow-[0_40px_80px_-40px_rgba(6,46,35,0.12)]">
        <div className="w-12 h-12 rounded-full bg-emerald-600/10 flex items-center justify-center mb-4">
          <Receipt className="w-5 h-5 text-emerald-600" />
        </div>
        <p className="text-slate-500 text-sm">No recent activity.</p>
      </div>
    );
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  };

  const getIcon = (action: string) => {
    if (action.includes('expense')) return <Receipt className="w-4 h-4 text-emerald-600" />;
    if (action.includes('payment')) return <HandCoins className="w-4 h-4 text-emerald-700" />;
    if (action.includes('member')) return <UserPlus className="w-4 h-4 text-blue-500" />;
    if (action.includes('delete')) return <Trash2 className="w-4 h-4 text-red-500" />;
    return <Receipt className="w-4 h-4 text-slate-400" />;
  };

  const getIconBg = (action: string) => {
    if (action.includes('expense')) return 'bg-emerald-600/10 border-emerald-600/20';
    if (action.includes('payment')) return 'bg-emerald-600/10 border-emerald-600/20';
    if (action.includes('member')) return 'bg-blue-500/10 border-blue-500/20';
    if (action.includes('delete')) return 'bg-red-500/10 border-red-500/20';
    return 'bg-slate-100 border-slate-200';
  };

  return (
    <div className="bg-white border border-line rounded-[26px] overflow-hidden h-full flex flex-col shadow-[0_40px_80px_-40px_rgba(6,46,35,0.12)]">
      <div className="p-5 border-b border-line bg-[#F5F7F4]/50 shrink-0">
        <h3 className="font-serif text-[22px] tracking-tight text-ink flex items-center gap-2">
          Recent Activity
        </h3>
        <p className="text-xs text-slate-500 mt-1">Recent updates across your groups.</p>
      </div>

      <div className="p-5 flex-1 overflow-y-auto space-y-4">
        {activities.map((act) => {
          const isYou = act.user_id === currentUserId;
          const name = isYou ? 'You' : act.profile?.full_name || act.profile?.email || 'Someone';
          
          let detailsText = '';
          if (act.action === 'added an expense' && act.details) {
            detailsText = `"${act.details.title}" for ${act.details.currency} ${act.details.amount}`;
          } else if (act.action === 'deleted an expense' && act.details) {
            detailsText = `"${act.details.title}"`;
          } else if (act.action === 'recorded a payment' && act.details) {
            detailsText = `of PKR ${act.details.amount} via ${act.details.method}`;
          }

          return (
            <div key={act.id} className="flex gap-3">
              <div className="relative mt-1">
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 ${getIconBg(act.action)}`}>
                  {getIcon(act.action)}
                </div>
              </div>
              
              <div className="flex-1 pb-1">
                <p className="text-sm text-slate-600">
                  <span className={`font-semibold ${isYou ? 'text-ink' : 'text-slate-800'}`}>{name}</span>
                  {' '}
                  <span className="text-slate-500">{act.action}</span>
                  {' '}
                  {detailsText && <span className="font-medium text-slate-700">{detailsText}</span>}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] text-slate-400 font-medium">{formatTimeAgo(act.created_at)}</span>
                  <span className="text-[10px] text-slate-300">•</span>
                  <span className="text-[11px] text-emerald-700 font-medium tracking-wide">{act.group?.name}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
