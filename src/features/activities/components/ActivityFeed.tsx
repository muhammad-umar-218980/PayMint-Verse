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
      <div className="bg-[#151f30] border border-white/5 rounded-2xl p-6 h-full min-h-[300px] flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-4">
          <Receipt className="w-5 h-5 text-slate-500" />
        </div>
        <p className="text-slate-400 text-sm">No recent activity.</p>
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
    if (action.includes('expense')) return <Receipt className="w-4 h-4 text-violet-400" />;
    if (action.includes('payment')) return <HandCoins className="w-4 h-4 text-emerald-400" />;
    if (action.includes('member')) return <UserPlus className="w-4 h-4 text-cyan-400" />;
    if (action.includes('delete')) return <Trash2 className="w-4 h-4 text-red-400" />;
    return <Receipt className="w-4 h-4 text-slate-400" />;
  };

  const getIconBg = (action: string) => {
    if (action.includes('expense')) return 'bg-violet-900/20 border-violet-700/30';
    if (action.includes('payment')) return 'bg-emerald-900/20 border-emerald-700/30';
    if (action.includes('member')) return 'bg-cyan-900/20 border-cyan-700/30';
    if (action.includes('delete')) return 'bg-red-900/20 border-red-700/30';
    return 'bg-slate-800 border-slate-700';
  };

  return (
    <div className="bg-[#151f30] border border-white/5 rounded-2xl overflow-hidden h-full flex flex-col">
      <div className="p-5 border-b border-white/5 bg-[#0d1526]/50 shrink-0">
        <h3 className="font-space font-bold text-white flex items-center gap-2">
          Activity Feed
        </h3>
        <p className="text-xs text-slate-400 mt-1">Recent updates across your groups.</p>
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
                {/* Timeline connector (could add if we want a line connecting them) */}
              </div>
              
              <div className="flex-1 pb-1">
                <p className="text-sm text-slate-300">
                  <span className={`font-semibold ${isYou ? 'text-white' : 'text-slate-200'}`}>{name}</span>
                  {' '}
                  <span className="text-slate-400">{act.action}</span>
                  {' '}
                  {detailsText && <span className="font-medium text-slate-300">{detailsText}</span>}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] text-slate-500 font-medium">{formatTimeAgo(act.created_at)}</span>
                  <span className="text-[10px] text-slate-600">•</span>
                  <span className="text-[11px] text-violet-400 font-medium tracking-wide">{act.group?.name}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
