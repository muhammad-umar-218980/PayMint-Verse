import Link from 'next/link';
import { Group } from '@/types';
import { Users, ArrowRight } from 'lucide-react';

interface GroupCardProps {
  group: Group;
}

export default function GroupCard({ group }: GroupCardProps) {
  return (
    <Link href={`/groups/${group.id}`}>
      <div className="bg-[#151f30] border border-violet-900/20 rounded-2xl p-6 hover:border-violet-700/40 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(124,58,237,0.1)] group cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="w-11 h-11 rounded-xl bg-violet-900/30 border border-violet-700/40 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-violet-400" />
          </div>
          <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-violet-400 transition-colors" />
        </div>

        <h3 className="font-space font-bold text-lg text-white mb-1 group-hover:text-violet-300 transition-colors">{group.name}</h3>

        {group.description && (
          <p className="text-sm text-slate-400 mb-4 line-clamp-2 leading-relaxed">{group.description}</p>
        )}

        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">
            Created {new Date(group.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="text-[11px] text-violet-400 bg-violet-900/25 px-2.5 py-0.5 rounded-full font-medium">
            Active
          </span>
        </div>
      </div>
    </Link>
  );
}
