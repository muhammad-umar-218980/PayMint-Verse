'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import SettleUpModal from '@/features/settlements/components/SettleUpModal';
import { SettlementTransaction } from '../services/simplification';

interface BalancesCardProps {
  groupId: string;
  membersMap: Record<string, string>;
  currentUserId: string;
  initialTransactions: SettlementTransaction[];
  currency?: string;
}

const SETTLE_PILL_CLASS =
  'inline-flex items-center gap-1.5 px-4 py-2 bg-ink hover:bg-emerald-600 text-paper text-xs font-bold rounded-xl transition-all active:scale-95 shadow-[0_4px_15px_rgba(6,46,35,0.2)]';

function SettlementRow({
  t,
  membersMap,
  currentUserId,
  groupId,
  currency,
}: {
  t: SettlementTransaction;
  membersMap: Record<string, string>;
  currentUserId: string;
  groupId: string;
  currency: string;
}) {
  const isYouFrom = t.from === currentUserId;
  const isYouTo = t.to === currentUserId;
  const fromName = isYouFrom ? 'You' : membersMap[t.from] || 'Unknown';
  const toName = isYouTo ? 'You' : membersMap[t.to] || 'Unknown';

  return (
    <div className="bg-white rounded-2xl border border-line px-4 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="flex -space-x-2 shrink-0">
          <div className="w-9 h-9 rounded-full bg-emerald-600/10 border border-emerald-600/20 text-emerald-700 font-bold text-xs flex items-center justify-center">
            {fromName[0].toUpperCase()}
          </div>
          <div className="w-9 h-9 rounded-full bg-ink/10 border border-ink/20 text-ink font-bold text-xs flex items-center justify-center">
            {toName[0].toUpperCase()}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-ink flex items-center gap-1.5">
            {fromName}
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            {toName}
          </p>
          <p className={`text-[11px] font-medium ${isYouFrom ? 'text-red-500' : isYouTo ? 'text-emerald-600' : 'text-slate-500'}`}>
            {isYouFrom ? 'You owe' : isYouTo ? 'You are owed' : 'Outstanding debt'}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between sm:justify-end gap-4">
        <span className="font-serif text-lg tracking-tight text-ink leading-none">
          {currency} {t.amount.toLocaleString()}
        </span>
        <SettleUpModal
          groupId={groupId}
          transaction={t}
          membersMap={membersMap}
          currentUserId={currentUserId}
          currency={currency}
          className={SETTLE_PILL_CLASS}
          label="Settle up"
        />
      </div>
    </div>
  );
}

export default function BalancesCard({
  groupId,
  membersMap,
  currentUserId,
  initialTransactions,
  currency = 'PKR',
}: BalancesCardProps) {
  const [showAll, setShowAll] = useState(false);
  const transactions = initialTransactions;

  const net = transactions.reduce((sum, t) => {
    if (t.to === currentUserId) return sum + t.amount;
    if (t.from === currentUserId) return sum - t.amount;
    return sum;
  }, 0);

  const youOwed = net >= 0;
  const people = new Set(transactions.flatMap((t) => [t.from, t.to])).size;

  if (transactions.length === 0) {
    return (
      <section
        className="rounded-[26px] border border-line overflow-hidden"
        style={{ background: 'linear-gradient(120deg, rgba(5,150,105,0.06), rgba(52,211,153,0.06))' }}
      >
        <div className="px-6 lg:px-8 py-8 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-600/10 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="font-serif text-[22px] tracking-tight text-ink mb-1">You&rsquo;re all settled up!</h3>
          <p className="text-sm text-slate-500">No outstanding balances in this group.</p>
        </div>
      </section>
    );
  }

  const primary = transactions[0];
  const rest = transactions.slice(1);

  return (
    <section
      className="rounded-[26px] border border-line overflow-hidden"
      style={{ background: 'linear-gradient(120deg, rgba(5,150,105,0.08), rgba(52,211,153,0.08))' }}
    >
      <div className="px-6 lg:px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-[22px] tracking-tight text-ink flex items-center gap-2.5 flex-wrap">
            Simplified settlement
            <span className="text-[10px] font-semibold bg-emerald-600/10 text-emerald-700 border border-emerald-600/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Simplified
            </span>
          </h2>
          <p className="text-[13px] text-slate-500 mt-1">
            {people} people · {transactions.length} debt{transactions.length > 1 ? 's' : ''}
          </p>
        </div>
        <div className="text-left sm:text-right">
          <p className={`text-[11px] uppercase tracking-widest font-bold ${youOwed ? 'text-emerald-600' : 'text-red-500'}`}>
            {youOwed ? 'You are owed' : 'You owe'}
          </p>
          <p className={`font-serif text-4xl leading-tight tracking-tight ${youOwed ? 'text-emerald-600' : 'text-red-500'}`}>
            {youOwed ? '+' : '−'}
            {currency} {Math.abs(net).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="px-6 lg:px-8 pb-6 space-y-2.5">
        <SettlementRow t={primary} membersMap={membersMap} currentUserId={currentUserId} groupId={groupId} currency={currency} />
        {rest.length > 0 && (
          <>
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-xs font-semibold text-slate-500 hover:text-ink transition-colors flex items-center gap-1 mx-auto pt-1"
            >
              {showAll ? 'Hide debts' : `View all ${rest.length} more debt${rest.length > 1 ? 's' : ''}`}
              {showAll ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {showAll && rest.map((t, i) => (
              <SettlementRow key={i} t={t} membersMap={membersMap} currentUserId={currentUserId} groupId={groupId} currency={currency} />
            ))}
          </>
        )}
      </div>
    </section>
  );
}
