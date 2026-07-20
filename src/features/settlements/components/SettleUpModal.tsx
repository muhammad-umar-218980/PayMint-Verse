'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, HandCoins, ArrowRight, CheckCircle2 } from 'lucide-react';
import { recordSettlementAction } from '../actions/settlement.actions';
import { SettlementMethod } from '@/types';

interface SettleUpModalProps {
  groupId: string;
  transaction: { from: string; to: string; amount: number };
  membersMap: Record<string, string>;
  currentUserId: string;
}

const SETTLEMENT_METHODS: { id: SettlementMethod; label: string }[] = [
  { id: 'cash', label: 'Cash' },
  { id: 'bank_transfer', label: 'Bank Transfer' },
  { id: 'easypaisa', label: 'EasyPaisa' },
  { id: 'jazzcash', label: 'JazzCash' },
  { id: 'other', label: 'Other' },
];

export default function SettleUpModal({ groupId, transaction, membersMap, currentUserId }: SettleUpModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [amount, setAmount] = useState(transaction.amount.toString());
  const [method, setMethod] = useState<SettlementMethod>('cash');
  const [notes, setNotes] = useState('');

  const isYouFrom = transaction.from === currentUserId;
  const isYouTo = transaction.to === currentUserId;
  
  const fromName = isYouFrom ? 'You' : membersMap[transaction.from] || 'Unknown';
  const toName = isYouTo ? 'You' : membersMap[transaction.to] || 'Unknown';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount.');
      setLoading(false);
      return;
    }

    if (numAmount > transaction.amount) {
      setError(`Amount cannot exceed the total debt (PKR ${transaction.amount}).`);
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('group_id', groupId);
    formData.append('paid_by', transaction.from);
    formData.append('paid_to', transaction.to);
    formData.append('amount', numAmount.toString());
    formData.append('method', method);
    formData.append('notes', notes);

    const result = await recordSettlementAction(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setOpen(false);
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-3 w-full py-2 bg-emerald-900/30 hover:bg-emerald-800/40 border border-emerald-700/30 text-emerald-400 text-xs font-bold rounded-lg transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
      >
        <HandCoins className="w-3.5 h-3.5" />
        Settle Up
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-[#151f30] border border-emerald-900/40 rounded-2xl w-full max-w-md flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0 bg-[#0d1526]/50">
              <h2 className="font-space text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Record Payment
              </h2>
              <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-6">
                  {error}
                </div>
              )}

              {/* Transaction Context */}
              <div className="bg-white/5 border border-white/5 rounded-xl p-4 mb-6 flex flex-col items-center justify-center gap-3">
                <div className="flex items-center gap-4 text-sm font-medium">
                  <span className={isYouFrom ? 'text-red-400' : 'text-slate-300'}>{fromName}</span>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Paying</span>
                    <ArrowRight className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className={isYouTo ? 'text-emerald-400' : 'text-slate-300'}>{toName}</span>
                </div>
                <div className="text-xs text-slate-500">
                  Total Outstanding: <span className="font-space font-bold text-white">PKR {transaction.amount}</span>
                </div>
              </div>

              <form id="settle-form" onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Amount to Settle</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400 font-medium font-space">PKR</span>
                    <input
                      type="number"
                      step="0.01"
                      max={transaction.amount}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-[#0B1120] border border-white/10 pl-14 pr-4 py-3 rounded-xl text-emerald-400 font-space font-bold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-lg transition-all"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">You can change this for partial settlements.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Payment Method</label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value as SettlementMethod)}
                    className="w-full bg-[#0B1120] border border-white/10 px-4 py-3 rounded-xl text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm transition-all"
                  >
                    {SETTLEMENT_METHODS.map(m => (
                      <option key={m.id} value={m.id}>{m.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Notes (Optional)</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Sent via EasyPaisa"
                    className="w-full bg-[#0B1120] border border-white/10 px-4 py-3 rounded-xl text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm transition-all"
                  />
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="p-6 pt-0 flex gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 py-3 rounded-xl border border-white/10 text-slate-300 font-semibold text-sm hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                form="settle-form"
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-500 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(16,185,129,0.3)]"
              >
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                {loading ? 'Recording...' : 'Record Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
