import Link from 'next/link';
import { Group } from '@/types';
import { Users, ChevronRight, CheckCircle2 } from 'lucide-react';

interface GroupCardProps {
  group: Group;
  membersCount?: number;
  expensesCount?: number;
  netBalance?: number;
}

export default function GroupCard({ group, membersCount, expensesCount, netBalance }: GroupCardProps) {
  const hasBalance = typeof netBalance === 'number';
  const settled = hasBalance && netBalance === 0;
  const owed = hasBalance && netBalance > 0;
  const owes = hasBalance && netBalance < 0;

  const hasMeta = typeof membersCount === 'number' || typeof expensesCount === 'number';

  return (
    <Link
      href={`/groups/${group.id}`}
      className="flex items-center gap-4 px-4 sm:px-5 py-4 hover:bg-emerald-500/[0.04] transition-colors"
    >
      <div className="w-11 h-11 rounded-xl bg-emerald-600/10 border border-emerald-600/15 flex items-center justify-center shrink-0">
        <Users className="w-5 h-5 text-emerald-600" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-semibold text-ink truncate">{group.name}</p>
        <p className="text-xs text-slate-500 mt-0.5 truncate">
          {hasMeta ? (
            <>
              {typeof membersCount === 'number' && `${membersCount} member${membersCount !== 1 ? 's' : ''}`}
              {typeof membersCount === 'number' && typeof expensesCount === 'number' && ' \u00B7 '}
              {typeof expensesCount === 'number' && `${expensesCount} expense${expensesCount !== 1 ? 's' : ''}`}
            </>
          ) : (
            (group.description || 'Group expense splitting')
          )}
        </p>
      </div>

      <div className="shrink-0 text-right">
        {settled ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Settled
          </span>
        ) : owes ? (
          <span className="font-serif text-lg tracking-tight text-red-500">
            &minus;PKR {Math.abs(netBalance!).toLocaleString()}
          </span>
        ) : owed ? (
          <span className="font-serif text-lg tracking-tight text-emerald-600">
            +PKR {netBalance!.toLocaleString()}
          </span>
        ) : null}
      </div>

      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors shrink-0" />
    </Link>
  );
}