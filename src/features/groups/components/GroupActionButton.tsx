'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, DoorOpen, X, AlertTriangle } from 'lucide-react';
import { deleteGroupAction, leaveGroupAction } from '@/features/groups/actions/groups';

interface GroupActionButtonProps {
  groupId: string;
  groupName: string;
  isOwner: boolean;
  className?: string;
}

export default function GroupActionButton({ groupId, groupName, isOwner, className }: GroupActionButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleConfirm = async () => {
    setError(null);
    setLoading(true);

    const result = isOwner
      ? await deleteGroupAction(groupId)
      : await leaveGroupAction(groupId);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setOpen(false);
    router.push('/dashboard');
    router.refresh();
  };

  const buttonClass =
    className ??
    `flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-[13px] font-medium border transition-all cursor-pointer ${
      isOwner
        ? 'border-line text-slate-500 hover:text-red-500 hover:bg-red-50 hover:border-red-200'
        : 'border-line text-slate-500 hover:text-emerald-700 hover:bg-emerald-600/5 hover:border-emerald-600/30'
    }`;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={buttonClass}
        title={isOwner ? 'Delete group' : 'Leave group'}
        aria-label={isOwner ? 'Delete group' : 'Leave group'}
      >
        {isOwner ? <Trash2 className="w-4 h-4" /> : <DoorOpen className="w-4 h-4" />}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-white border border-line rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-ink transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${
              isOwner ? 'bg-red-500/10 border border-red-200' : 'bg-emerald-600/10 border border-emerald-600/20'
            }`}>
              {isOwner ? <AlertTriangle className="w-5 h-5 text-red-500" /> : <DoorOpen className="w-5 h-5 text-emerald-700" />}
            </div>

            <h2 className="text-xl font-semibold tracking-tight text-ink mb-1">
              {isOwner ? 'Delete this group?' : `Leave ${groupName}?`}
            </h2>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              {isOwner
                ? `This permanently removes all expenses, settlements, members and activity for "${groupName}". This cannot be undone.`
                : 'You will be removed from this group and it will disappear from your dashboard. Your past expenses in this group remain for the other members.'}
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-lg mb-4">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-line text-slate-600 font-semibold text-sm hover:bg-[#F5F7F4] transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer ${
                  isOwner
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-ink text-paper hover:bg-emerald-600 shadow-[0_4px_15px_rgba(6,46,35,0.2)]'
                }`}
              >
                {loading ? (isOwner ? 'Deleting...' : 'Leaving...') : isOwner ? 'Delete group' : 'Leave group'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}