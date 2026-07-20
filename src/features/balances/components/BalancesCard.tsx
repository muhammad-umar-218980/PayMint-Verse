import { BalanceService } from '../services/balance.service';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import SettleUpModal from '@/features/settlements/components/SettleUpModal';

interface BalancesCardProps {
  groupId: string;
  membersMap: Record<string, string>;
  currentUserId: string;
}

export default async function BalancesCard({ groupId, membersMap, currentUserId }: BalancesCardProps) {
  const balanceService = new BalanceService();
  const transactions = await balanceService.getSimplifiedBalances(groupId);

  if (transactions.length === 0) {
    return (
      <div className="bg-[#151f30] border border-violet-900/20 rounded-2xl p-6 text-center h-full flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-16 h-16 rounded-full bg-emerald-900/20 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="font-space text-lg font-bold text-white mb-2">You're all settled up!</h3>
        <p className="text-slate-400 text-sm">There are no outstanding balances in this group.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#151f30] border border-violet-900/20 rounded-2xl overflow-hidden h-full flex flex-col">
      <div className="p-5 border-b border-white/5 bg-[#0d1526]/50 shrink-0">
        <h3 className="font-space font-bold text-white flex items-center gap-2">
          Balances
          <span className="text-xs font-medium bg-violet-900/30 text-violet-300 px-2.5 py-0.5 rounded-full border border-violet-700/30">
            Simplified
          </span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">Minimum transactions to settle debts.</p>
      </div>
      
      <div className="p-5 space-y-4 flex-1 overflow-y-auto">
        {transactions.map((t, index) => {
          const isYouFrom = t.from === currentUserId;
          const isYouTo = t.to === currentUserId;
          
          const fromName = isYouFrom ? 'You' : membersMap[t.from] || 'Unknown';
          const toName = isYouTo ? 'You' : membersMap[t.to] || 'Unknown';

          return (
            <div key={index} className="flex flex-col p-4 rounded-xl bg-white/5 border border-white/5 hover:border-violet-500/20 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-violet-900/40 flex items-center justify-center text-violet-300 font-bold text-xs shrink-0">
                    {fromName[0].toUpperCase()}
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-sm">
                      <span className={`font-medium ${isYouFrom ? 'text-white' : 'text-slate-300'}`}>{fromName}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                      <span className={`font-medium ${isYouTo ? 'text-white' : 'text-slate-300'}`}>{toName}</span>
                    </div>
                    {isYouFrom && (
                      <span className="text-[11px] text-red-400 font-medium">You owe money</span>
                    )}
                    {isYouTo && (
                      <span className="text-[11px] text-emerald-400 font-medium">You are owed</span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-space font-bold text-white block">PKR {t.amount}</span>
                  <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Owes</span>
                </div>
              </div>

              <SettleUpModal 
                groupId={groupId} 
                transaction={t} 
                membersMap={membersMap} 
                currentUserId={currentUserId} 
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
