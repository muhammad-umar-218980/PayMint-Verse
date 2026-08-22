'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, X } from 'lucide-react';
import { toast } from 'sonner';
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
      toast.error(result.error);
    } else {
      toast.success('Member added successfully');
      setOpen(false);
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 border border-line bg-white hover:border-ink/30 hover:text-ink text-slate-600 text-sm font-semibold px-4 py-2 rounded-xl transition-all"
      >
        <UserPlus className="w-4 h-4" />
        Add Member
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-white border border-line rounded-2xl w-full max-w-md flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-line shrink-0 bg-[#F5F7F4]/50">
              <h2 className="text-lg font-semibold tracking-tight text-ink flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                Add Member
              </h2>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-ink transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
                  {error}
                </div>
              )}

              <form id="add-member-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-600 mb-2">
                    User Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="friend@example.com"
                    className="w-full bg-[#F5F7F4] border border-[rgba(6,46,35,0.10)] px-4 py-3 rounded-xl text-ink placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all text-sm"
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
                className="flex-1 py-2.5 rounded-xl border border-line text-slate-600 font-semibold text-sm hover:bg-[#F5F7F4] transition-all"
              >
                Cancel
              </button>
              <button
                form="add-member-form"
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-ink text-paper font-semibold text-sm hover:bg-emerald-600 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(6,46,35,0.2)]"
              >
                {loading ? <div className="w-4 h-4 border-2 border-paper/30 border-t-paper rounded-full animate-spin" /> : null}
                {loading ? 'Adding...' : 'Add Member'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
