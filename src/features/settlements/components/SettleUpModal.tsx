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
  currency?: string;
  className?: string;
  label?: string;
}

const SETTLEMENT_METHODS: { id: SettlementMethod; label: string }[] = [
  { id: 'cash', label: 'Cash' },
  { id: 'bank_transfer', label: 'Bank Transfer' },
  { id: 'easypaisa', label: 'EasyPaisa' },
  { id: 'jazzcash', label: 'JazzCash' },
  { id: 'other', label: 'Other' },
];

const INPUT_CLASS =
  'w-full bg-[#F5F7F4] border border-[rgba(6,46,35,0.10)] px-4 py-3 rounded-xl text-ink placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all text-sm';

export default function SettleUpModal({ groupId, transaction, membersMap, currentUserId, currency = 'PKR', className, label }: SettleUpModalProps) {
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
      setError(`Amount cannot exceed the total debt (${currency} ${transaction.amount}).`);
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
        className={className ?? 'mt-3 w-full py-2 bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-600/25 text-emerald-700 text-xs font-bold rounded-lg transition-all active:scale-[0.98] flex items-center justify-center gap-1.5'}
      >
        <HandCoins className="w-3.5 h-3.5" />
        {label ?? 'Settle Up'}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-white border border-line rounded-2xl w-full max-w-md flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-line shrink-0 bg-[#F5F7F4]/50">
              <h2 className="text-lg font-semibold tracking-tight text-ink flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Record Payment
              </h2>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-ink transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">
                  {error}
                </div>
              )}

              {/* Transaction Context */}
              <div className="bg-[#F5F7F4] border border-line rounded-xl p-4 mb-6 flex flex-col items-center justify-center gap-3">
                <div className="flex items-center gap-4 text-sm font-medium">
                  <span className={isYouFrom ? 'text-red-500' : 'text-slate-700'}>{fromName}</span>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Paying</span>
                    <ArrowRight className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className={isYouTo ? 'text-emerald-600' : 'text-slate-700'}>{toName}</span>
                </div>
                <div className="text-xs text-slate-500">
                  Total Outstanding: <span className="font-serif tracking-tight text-ink">{currency} {transaction.amount}</span>
                </div>
              </div>

              <form id="settle-form" onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Amount to Settle</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">{currency}</span>
                    <input
                      type="number"
                      step="0.01"
                      max={transaction.amount}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className={`${INPUT_CLASS} pl-14 font-serif text-lg tracking-tight text-emerald-700`}
                      required
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">You can change this for partial settlements.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Payment Method</label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value as SettlementMethod)}
                    className={INPUT_CLASS}
                  >
                    {SETTLEMENT_METHODS.map(m => (
                      <option key={m.id} value={m.id}>{m.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Notes (Optional)</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Sent via EasyPaisa"
                    className={INPUT_CLASS}
                  />
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="p-6 pt-0 flex gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 py-3 rounded-xl border border-line text-slate-600 font-semibold text-sm hover:bg-[#F5F7F4] transition-all"
              >
                Cancel
              </button>
              <button
                form="settle-form"
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-ink text-paper font-semibold text-sm hover:bg-emerald-600 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(6,46,35,0.2)]"
              >
                {loading ? <div className="w-4 h-4 border-2 border-paper/30 border-t-paper rounded-full animate-spin" /> : null}
                {loading ? 'Recording...' : 'Record Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
