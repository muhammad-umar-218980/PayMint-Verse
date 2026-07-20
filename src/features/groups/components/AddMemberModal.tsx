'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, X } from 'lucide-react';
import { addMemberAction } from '../actions/groups';

export default function AddMemberModal({ groupId }: { groupId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    if (!email) {
      setError('Please enter an email address.');
      setLoading(false);
      return;
    }

    const result = await addMemberAction(groupId, email);

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
        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all border border-white/5"
      >
        <UserPlus className="w-4 h-4" />
        Add Member
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-[#151f30] border border-violet-900/40 rounded-2xl w-full max-w-md flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0 bg-[#0d1526]/50">
              <h2 className="font-space text-lg font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-violet-400" />
                Add Member
              </h2>
              <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">
                  {error}
                </div>
              )}

              <form id="add-member-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                    User Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="friend@example.com"
                    className="w-full bg-[#0B1120] border border-white/10 px-4 py-3 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm"
                    required
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    They must already have a registered account on PayMint Verse.
                  </p>
                </div>
              </form>
            </div>

            <div className="p-6 pt-0 flex gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-300 font-semibold text-sm hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                form="add-member-form"
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-violet-700 text-white font-semibold text-sm hover:bg-violet-600 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(124,58,237,0.3)]"
              >
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                {loading ? 'Adding...' : 'Add Member'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
