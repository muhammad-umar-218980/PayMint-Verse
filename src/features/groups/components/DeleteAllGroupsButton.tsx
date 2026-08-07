'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, X } from 'lucide-react';
import { deleteAllGroupsAction } from '@/features/groups/actions/groups';

export default function DeleteAllGroupsButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleConfirm = async () => {
    setError(null);
    setLoading(true);

    const result = await deleteAllGroupsAction();

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setOpen(false);
    router.refresh();
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-500 border border-line hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all active:scale-[0.98] cursor-pointer"
      >
        <Trash2 className="w-4 h-4" />
        <span className="hidden sm:inline">Delete all</span>
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

            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-200 flex items-center justify-center mb-5">
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>

            <h2 className="text-xl font-semibold tracking-tight text-ink mb-1">Delete all your groups?</h2>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              This permanently removes every group you own, along with all their expenses, settlements, members and
              activity. This cannot be undone.
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
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                {loading ? 'Deleting...' : 'Delete all groups'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}