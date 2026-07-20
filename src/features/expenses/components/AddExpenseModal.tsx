'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Receipt, Calculator, Percent, PieChart, Info } from 'lucide-react';
import { addExpenseAction } from '../actions/expense.actions';
import { SplitType, GroupMember } from '@/types';

interface AddExpenseModalProps {
  groupId: string;
  members: (GroupMember & { profile: { full_name: string | null; email: string } })[];
  currentUserId: string;
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

export default function AddExpenseModal({ groupId, members, currentUserId }: AddExpenseModalProps) {
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

    let splitDetails: any[] = [];

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
    formData.append('currency', 'PKR'); // Fixed for now
    formData.append('category', category);
    formData.append('paid_by', paidBy);

    const result = await addExpenseAction(formData, splitType, splitDetails);

    if (result.error) {
      setError(result.error);
    } else {
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
        className="flex items-center gap-2 bg-violet-700 hover:bg-violet-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all active:scale-95 shadow-[0_4px_15px_rgba(124,58,237,0.3)]"
      >
        + Add Expense
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-[#151f30] border border-violet-900/40 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0">
              <h2 className="font-space text-xl font-bold text-white">Add an Expense</h2>
              <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-6">
                  {error}
                </div>
              )}

              <form id="expense-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Title / Description</label>
                    <input
                      type="text"
                      placeholder="e.g. Dinner at Salt"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-[#0B1120] border border-white/10 px-4 py-3 rounded-xl text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-sm mb-3"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Optional details"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-[#0B1120] border border-white/10 px-4 py-3 rounded-xl text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Amount</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium font-space">PKR</span>
                      <input
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-[#0B1120] border border-white/10 pl-14 pr-4 py-3 rounded-xl text-white font-space font-bold focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-lg"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Paid By</label>
                    <select
                      value={paidBy}
                      onChange={(e) => setPaidBy(e.target.value)}
                      className="w-full bg-[#0B1120] border border-white/10 px-4 py-3 rounded-xl text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-sm"
                    >
                      {members.map(m => (
                        <option key={m.user_id} value={m.user_id}>
                          {m.user_id === currentUserId ? 'You' : m.profile.full_name || m.profile.email}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-[#0B1120] border border-white/10 px-4 py-3 rounded-xl text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-sm"
                    >
                      {CATEGORIES.map(c => (
                        <option key={c.id} value={c.id}>{c.icon} {c.id}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <hr className="border-white/5" />

                {/* Split Strategies */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">Split Method</label>
                  <div className="flex bg-[#0B1120] p-1 rounded-xl mb-5">
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
                            active ? 'bg-violet-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'
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
                        <div key={m.user_id} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl">
                          <div className="flex items-center gap-3">
                            {splitType === 'equal' ? (
                              <input 
                                type="checkbox"
                                checked={selectedMembers.has(m.user_id)}
                                onChange={() => toggleMember(m.user_id)}
                                className="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-600"
                              />
                            ) : null}
                            <div className="w-8 h-8 rounded-full bg-violet-900/40 flex items-center justify-center text-violet-300 font-bold text-xs shrink-0">
                              {initial}
                            </div>
                            <span className="text-sm text-slate-300 font-medium truncate max-w-[120px]">{name}</span>
                          </div>

                          {/* Dynamic Inputs */}
                          <div className="flex items-center gap-2">
                            {splitType === 'equal' && selectedMembers.has(m.user_id) && amount && (
                              <span className="text-slate-400 font-space text-sm">
                                ~ {Math.floor((parseFloat(amount) / selectedMembers.size) * 100)/100}
                              </span>
                            )}
                            
                            {splitType === 'custom' && (
                              <input 
                                type="number" 
                                placeholder="0.00" 
                                value={customAmounts[m.user_id] || ''}
                                onChange={(e) => setCustomAmounts({...customAmounts, [m.user_id]: e.target.value})}
                                className="w-24 bg-[#0B1120] border border-white/10 px-3 py-1.5 rounded-lg text-white font-space text-sm text-right focus:outline-none focus:border-violet-500"
                              />
                            )}

                            {splitType === 'percentage' && (
                              <div className="relative">
                                <input 
                                  type="number" 
                                  placeholder="0" 
                                  value={percentages[m.user_id] || ''}
                                  onChange={(e) => setPercentages({...percentages, [m.user_id]: e.target.value})}
                                  className="w-20 bg-[#0B1120] border border-white/10 pl-3 pr-6 py-1.5 rounded-lg text-white font-space text-sm text-right focus:outline-none focus:border-violet-500"
                                />
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 text-xs">%</span>
                              </div>
                            )}

                            {splitType === 'shares' && (
                              <input 
                                type="number" 
                                min="1"
                                placeholder="1" 
                                value={shares[m.user_id] || ''}
                                onChange={(e) => setShares({...shares, [m.user_id]: e.target.value})}
                                className="w-16 bg-[#0B1120] border border-white/10 px-3 py-1.5 rounded-lg text-white font-space text-sm text-right focus:outline-none focus:border-violet-500"
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
            <div className="p-6 border-t border-white/5 bg-[#0d1526] rounded-b-2xl shrink-0 flex gap-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 py-3 rounded-xl border border-white/10 text-slate-300 font-semibold text-sm hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                form="expense-form"
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-violet-700 text-white font-semibold text-sm hover:bg-violet-600 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                {loading ? 'Saving...' : 'Add Expense'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
