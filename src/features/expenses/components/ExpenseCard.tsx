'use client';

import { useState } from 'react';
import { Expense, ExpenseSplit } from '@/types';
import { Utensils, Fuel, Building, Ticket, Lightbulb, ShoppingBag, Receipt, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { deleteExpenseAction } from '../actions/expense.actions';
import { toast } from 'sonner';

interface ExpenseCardProps {
  expense: Expense & { payer: { full_name: string | null; email: string } };
  splits: ExpenseSplit[];
  membersMap: Record<string, string>;
  currentUserId: string;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Food: <Utensils className="w-4 h-4" />,
  Transport: <Fuel className="w-4 h-4" />,
  Accommodation: <Building className="w-4 h-4" />,
  Entertainment: <Ticket className="w-4 h-4" />,
  Utilities: <Lightbulb className="w-4 h-4" />,
  Shopping: <ShoppingBag className="w-4 h-4" />,
  Other: <Receipt className="w-4 h-4" />,
};

export default function ExpenseCard({ expense, splits, membersMap, currentUserId }: ExpenseCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const icon = CATEGORY_ICONS[expense.category] || CATEGORY_ICONS['Other'];
  const payerName = expense.paid_by === currentUserId ? 'You' : expense.payer.full_name || expense.payer.email;

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    setIsDeleting(true);
    const result = await deleteExpenseAction(expense.id, expense.group_id);
    if (result.error) {
      toast.error(result.error);
      setIsDeleting(false);
    } else {
      toast.success('Expense deleted successfully');
    }
  };

  return (
    <div className={`transition-colors ${expanded ? 'bg-emerald-600/[0.04]' : ''}`}>
      {/* Main Row — compact, like the landing page mockup list */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-4 px-2 py-3.5 cursor-pointer rounded-lg hover:bg-emerald-600/[0.03]"
      >
        <div className="w-9 h-9 rounded-[10px] bg-emerald-600/10 text-emerald-600 flex items-center justify-center shrink-0">
          {icon}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-medium text-ink truncate">{expense.title}</p>
          <p className="text-xs text-slate-500 mt-0.5 truncate">
            <span className="font-medium text-emerald-700">{payerName}</span> paid · {new Date(expense.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
        </div>

        <div className="text-right shrink-0 flex items-center gap-2.5">
          <div>
            <p className="font-serif text-[16px] leading-tight tracking-tight text-ink">{expense.currency} {expense.amount}</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5 text-right">
              {expense.split_type}
            </p>
          </div>
          {expense.paid_by === currentUserId && (
            <button
              onClick={(e) => { e.stopPropagation(); handleDelete(); }}
              disabled={isDeleting}
              className="text-slate-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50"
              aria-label="Delete expense"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </div>

      {/* Expanded Splits Area */}
      {expanded && (
        <div className="bg-[#F5F7F4]/70 rounded-xl px-4 py-4 mx-1 mb-2">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3">
            Split Details ({expense.split_type})
          </p>

          <div className="space-y-2">
            {splits.map(split => {
              const memberName = split.user_id === currentUserId ? 'You' : membersMap[split.user_id] || 'Unknown';
              return (
                <div key={split.user_id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-slate-600">
                      {memberName} {split.user_id === expense.paid_by && <span className="text-emerald-700 font-medium">(Payer)</span>}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {split.percentage && <span className="text-slate-400 text-xs">{split.percentage}%</span>}
                    {split.shares && <span className="text-slate-400 text-xs">{split.shares} shares</span>}
                    <span className="font-serif tracking-tight text-ink">{expense.currency} {split.amount_owed}</span>
                  </div>
                </div>
              );
            })}
          </div>
          {expense.description && (
            <p className="mt-4 pt-3 border-t border-line text-xs text-slate-500 italic">
              &ldquo;{expense.description}&rdquo;
            </p>
          )}
        </div>
      )}
    </div>
  );
}
