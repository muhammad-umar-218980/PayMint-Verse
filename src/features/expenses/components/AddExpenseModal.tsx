'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Calculator, Percent, PieChart, Receipt } from 'lucide-react';
import { toast } from 'sonner';
import { addExpenseAction } from '../actions/expense.actions';
import { SplitType, GroupMember } from '@/types';

interface AddExpenseModalProps {
  groupId: string;
  members: (GroupMember & { profile: { full_name: string | null; email: string } })[];
  currentUserId: string;
  currency?: string;
}

const CATEGORIES = [
  { id: 'Food', icon: '🍔' },
  { id: 'Transport', icon: '🚗' },
  { id: 'Accommodation', icon: '🏠' },
  { id: 'Entertainment', icon: '🎫' },
  { id: 'Utilities', icon: '💡' },
  { id: 'Shopping', icon: '🛍️' },
  { id: 'Other', icon: '📝' },
];

const INPUT_CLASS =
  'w-full bg-[#F5F7F4] border border-[rgba(6,46,35,0.10)] px-4 py-3 rounded-xl text-ink placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all text-sm';

type SplitDetail =
  | string
  | { user_id: string; amount: number }
  | { user_id: string; percentage: number }
  | { user_id: string; shares: number };

export default function AddExpenseModal({ groupId, members, currentUserId, currency = 'PKR' }: AddExpenseModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Other');
  const [paidBy, setPaidBy] = useState(currentUserId);
  const [splitType, setSplitType] = useState<SplitType>('equal');

  // Split state
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set(members.map((m) => m.user_id)));
  const [customAmounts, setCustomAmounts] = useState<Record<string, string>>({});
  const [percentages, setPercentages] = useState<Record<string, string>>({});
  const [shares, setShares] = useState<Record<string, string>>(
    Object.fromEntries(members.map((m) => [m.user_id, '1']))
  );

  const toggleMember = (userId: string) => {
    const newSelected = new Set(selectedMembers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedMembers(newSelected);
  };

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

    let splitDetails: SplitDetail[] = [];

    if (splitType === 'equal') {
      if (selectedMembers.size === 0) {
        setError('Please select at least one member.');
        setLoading(false);
        return;
      }
      splitDetails = Array.from(selectedMembers);
    } else if (splitType === 'custom') {
      let sum = 0;
      for (const [userId, amtStr] of Object.entries(customAmounts)) {
        const amt = parseFloat(amtStr);
        if (!isNaN(amt) && amt > 0) {
          sum += amt;
          splitDetails.push({ user_id: userId, amount: amt });
        }
      }
      if (Math.abs(sum - numAmount) > 0.01) {
        setError(`Amounts sum to ${sum}, but total is ${numAmount}.`);
        setLoading(false);
        return;
      }
    } else if (splitType === 'percentage') {
      let sumPct = 0;
      for (const [userId, pctStr] of Object.entries(percentages)) {
        const pct = parseFloat(pctStr);
        if (!isNaN(pct) && pct > 0) {
          sumPct += pct;
          splitDetails.push({ user_id: userId, percentage: pct });
        }
      }
      if (Math.abs(sumPct - 100) > 0.01) {
        setError(`Percentages sum to ${sumPct}%, must be 100%.`);
        setLoading(false);
        return;
      }
    } else if (splitType === 'shares') {
      for (const [userId, shareStr] of Object.entries(shares)) {
        const s = parseInt(shareStr);
        if (!isNaN(s) && s > 0) {
          splitDetails.push({ user_id: userId, shares: s });
        }
      }
      if (splitDetails.length === 0) {
        setError('Please assign shares.');
        setLoading(false);
        return;
      }
    }

    const formData = new FormData();
    formData.append('group_id', groupId);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('amount', amount);
    formData.append('currency', currency);
    formData.append('category', category);
    formData.append('paid_by', paidBy);

    const result = await addExpenseAction(formData, splitType, splitDetails);

    if (result.error) {
      setError(result.error);
      toast.error(result.error);
    } else {
      toast.success('Expense added successfully');
      setOpen(false);
      setTitle('');
      setDescription('');
      setAmount('');
      setSplitType('equal');
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-ink hover:bg-emerald-600 text-paper text-sm font-semibold px-5 py-2.5 rounded-xl transition-all active:scale-95 shadow-[0_4px_15px_rgba(6,46,35,0.2)]"
      >
        + Add Expense
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-white border border-line rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-line shrink-0">
              <h2 className="text-xl font-semibold tracking-tight text-ink">Add an Expense</h2>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-ink transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">
                  {error}
                </div>
              )}

              <form id="expense-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Title / Description</label>
                    <input
                      type="text"
                      placeholder="e.g. Dinner at Salt"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className={`${INPUT_CLASS} mb-3`}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Optional details"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Amount</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">{currency}</span>
                      <input
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className={`${INPUT_CLASS} pl-14 font-serif text-lg tracking-tight`}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Paid By</label>
                    <select
                      value={paidBy}
                      onChange={(e) => setPaidBy(e.target.value)}
                      className={INPUT_CLASS}
                    >
                      {members.map(m => (
                        <option key={m.user_id} value={m.user_id}>
                          {m.user_id === currentUserId ? 'You' : m.profile.full_name || m.profile.email}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className={INPUT_CLASS}
                    >
                      {CATEGORIES.map(c => (
                        <option key={c.id} value={c.id}>{c.icon} {c.id}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <hr className="border-line" />

                {/* Split Strategies */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-3">Split Method</label>
                  <div className="flex bg-[#F5F7F4] p-1 rounded-xl mb-5">
                    {[
                      { id: 'equal', label: '=', icon: Calculator },
                      { id: 'custom', label: '1.23', icon: Receipt },
                      { id: 'percentage', label: '%', icon: Percent },
                      { id: 'shares', label: 'Share', icon: PieChart }
                    ].map((t) => {
                      const active = splitType === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setSplitType(t.id as SplitType)}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-lg transition-colors ${
                            active ? 'bg-ink text-paper shadow-sm' : 'text-slate-500 hover:text-ink'
                          }`}
                        >
                          {t.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Split Inputs based on strategy */}
                  <div className="space-y-3">
                    {members.map(m => {
                      const name = m.user_id === currentUserId ? 'You' : m.profile.full_name || m.profile.email;
                      const initial = name[0].toUpperCase();

                      return (
                        <div key={m.user_id} className="flex items-center justify-between p-3 bg-[#F5F7F4]/60 border border-line rounded-xl">
                          <div className="flex items-center gap-3">
                            {splitType === 'equal' ? (
                              <input 
                                type="checkbox"
                                checked={selectedMembers.has(m.user_id)}
                                onChange={() => toggleMember(m.user_id)}
                                className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"
                              />
                            ) : null}
                            <div className="w-8 h-8 rounded-full bg-emerald-600/10 flex items-center justify-center text-emerald-700 font-bold text-xs shrink-0">
                              {initial}
                            </div>
                            <span className="text-sm text-slate-700 font-medium truncate max-w-[120px]">{name}</span>
                          </div>

                          {/* Dynamic Inputs */}
                          <div className="flex items-center gap-2">
                            {splitType === 'equal' && selectedMembers.has(m.user_id) && amount && (
                              <span className="text-slate-500 font-serif tracking-tight text-sm">
                                ~ {Math.floor((parseFloat(amount) / selectedMembers.size) * 100)/100}
                              </span>
                            )}
                            
                            {splitType === 'custom' && (
                              <input 
                                type="number" 
                                placeholder="0.00" 
                                value={customAmounts[m.user_id] || ''}
                                onChange={(e) => setCustomAmounts({...customAmounts, [m.user_id]: e.target.value})}
                                className="w-24 bg-white border border-line px-3 py-1.5 rounded-lg text-ink font-serif text-sm tracking-tight text-right focus:outline-none focus:border-emerald-600"
                              />
                            )}

                            {splitType === 'percentage' && (
                              <div className="relative">
                                <input 
                                  type="number" 
                                  placeholder="0" 
                                  value={percentages[m.user_id] || ''}
                                  onChange={(e) => setPercentages({...percentages, [m.user_id]: e.target.value})}
                                  className="w-20 bg-white border border-line pl-3 pr-6 py-1.5 rounded-lg text-ink font-serif text-sm tracking-tight text-right focus:outline-none focus:border-emerald-600"
                                />
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">%</span>
                              </div>
                            )}

                            {splitType === 'shares' && (
                              <input 
                                type="number" 
                                min="1"
                                placeholder="1" 
                                value={shares[m.user_id] || ''}
                                onChange={(e) => setShares({...shares, [m.user_id]: e.target.value})}
                                className="w-16 bg-white border border-line px-3 py-1.5 rounded-lg text-ink font-serif text-sm tracking-tight text-right focus:outline-none focus:border-emerald-600"
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </form>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-line bg-[#F5F7F4]/50 rounded-b-2xl shrink-0 flex gap-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 py-3 rounded-xl border border-line text-slate-600 font-semibold text-sm hover:bg-[#F5F7F4] transition-all"
              >
                Cancel
              </button>
              <button
                form="expense-form"
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-ink text-paper font-semibold text-sm hover:bg-emerald-600 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(6,46,35,0.2)]"
              >
                {loading ? <div className="w-4 h-4 border-2 border-paper/30 border-t-paper rounded-full animate-spin" /> : null}
                {loading ? 'Saving...' : 'Add Expense'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
