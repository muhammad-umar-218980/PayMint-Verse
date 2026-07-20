'use client';

import { useState } from 'react';
import { Expense, ExpenseSplit } from '@/types';
import { Utensils, Fuel, Building, Ticket, Lightbulb, ShoppingBag, Receipt, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { deleteExpenseAction } from '../actions/expense.actions';

interface ExpenseCardProps {
  expense: Expense & { payer: { full_name: string | null; email: string } };
  splits: ExpenseSplit[];
  membersMap: Record<string, string>;
  currentUserId: string;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Food: <Utensils className="w-4 h-4 text-orange-400" />,
  Transport: <Fuel className="w-4 h-4 text-cyan-400" />,
  Accommodation: <Building className="w-4 h-4 text-violet-400" />,
  Entertainment: <Ticket className="w-4 h-4 text-pink-400" />,
  Utilities: <Lightbulb className="w-4 h-4 text-yellow-400" />,
  Shopping: <ShoppingBag className="w-4 h-4 text-emerald-400" />,
  Other: <Receipt className="w-4 h-4 text-slate-400" />,
};

const CATEGORY_BG: Record<string, string> = {
  Food: 'bg-orange-900/20 border-orange-700/30',
  Transport: 'bg-cyan-900/20 border-cyan-700/30',
  Accommodation: 'bg-violet-900/20 border-violet-700/30',
  Entertainment: 'bg-pink-900/20 border-pink-700/30',
  Utilities: 'bg-yellow-900/20 border-yellow-700/30',
  Shopping: 'bg-emerald-900/20 border-emerald-700/30',
  Other: 'bg-slate-800 border-slate-700',
};

export default function ExpenseCard({ expense, splits, membersMap, currentUserId }: ExpenseCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const icon = CATEGORY_ICONS[expense.category] || CATEGORY_ICONS['Other'];
  const bg = CATEGORY_BG[expense.category] || CATEGORY_BG['Other'];
  const payerName = expense.paid_by === currentUserId ? 'You' : expense.payer.full_name || expense.payer.email;

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    setIsDeleting(true);
    await deleteExpenseAction(expense.id, expense.group_id);
    // Path revalidates, component unmounts
  };

  return (
    <div className="bg-[#151f30] border border-white/5 rounded-2xl overflow-hidden transition-all hover:border-violet-900/30 group">
      {/* Main Row */}
      <div 
        onClick={() => setExpanded(!expanded)}
        className="p-5 flex items-center gap-4 cursor-pointer"
      >
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${bg}`}>
          {icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-bold font-space text-base truncate">{expense.title}</h4>
          <p className="text-slate-400 text-xs truncate">
            Paid by <span className="text-slate-300 font-medium">{payerName}</span> • {new Date(expense.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
        </div>

        <div className="text-right shrink-0">
          <p className="text-white font-bold font-space text-lg">{expense.currency} {expense.amount}</p>
          <div className="flex justify-end gap-2 items-center mt-1">
            {expense.paid_by === currentUserId && (
              <button 
                onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                disabled={isDeleting}
                className="text-slate-500 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            {expanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
          </div>
        </div>
      </div>

      {/* Expanded Splits Area */}
      {expanded && (
        <div className="bg-[#0B1120] px-5 py-4 border-t border-white/5">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3 flex items-center justify-between">
            <span>Split Details ({expense.split_type})</span>
          </p>
          
          <div className="space-y-2">
            {splits.map(split => {
              const memberName = split.user_id === currentUserId ? 'You' : membersMap[split.user_id] || 'Unknown';
              return (
                <div key={split.user_id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                    <span className="text-slate-300">{memberName} {split.user_id === expense.paid_by && '(Payer)'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {split.percentage && <span className="text-slate-500 text-xs">{split.percentage}%</span>}
                    {split.shares && <span className="text-slate-500 text-xs">{split.shares} shares</span>}
                    <span className="font-space font-medium text-white">{expense.currency} {split.amount_owed}</span>
                  </div>
                </div>
              );
            })}
          </div>
          {expense.description && (
            <p className="mt-4 pt-3 border-t border-white/5 text-xs text-slate-400 italic">
              "{expense.description}"
            </p>
          )}
        </div>
      )}
    </div>
  );
}
