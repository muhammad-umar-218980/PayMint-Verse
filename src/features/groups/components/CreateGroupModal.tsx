'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { createGroup } from '@/features/groups/actions/groups';

interface CreateGroupModalProps {
  triggerClassName?: string;
  triggerLabel?: string;
  triggerIcon?: React.ReactNode;
}

export default function CreateGroupModal({ triggerClassName, triggerLabel, triggerIcon }: CreateGroupModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget as HTMLFormElement);

    const result = await createGroup(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setOpen(false);
      setName('');
      if (result.groupId) {
        router.push(`/groups/${result.groupId}`);
        router.refresh();
      } else {
        router.refresh();
      }
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={
          triggerClassName ??
          'flex items-center gap-2 bg-ink hover:bg-emerald-600 text-paper text-sm font-semibold px-4 py-2 rounded-xl transition-all active:scale-95 shadow-[0_4px_15px_rgba(6,46,35,0.2)]'
        }
      >
        {triggerIcon}
        {triggerLabel ?? '+ Create Group'}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-white border border-line rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-ink transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-semibold tracking-tight text-ink mb-1">Create Group</h2>
            <p className="text-slate-500 text-sm mb-6">Start splitting expenses with your group.</p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Group name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#F5F7F4] border border-[rgba(6,46,35,0.10)] px-4 py-2.5 rounded-xl mb-4 text-ink placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all font-medium text-sm"
                required
                autoFocus
              />
              <input
                type="text"
                placeholder="Description (optional)"
                name="description"
                className="w-full bg-[#F5F7F4] border border-[rgba(6,46,35,0.10)] px-4 py-2.5 rounded-xl mb-6 text-ink placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all font-medium text-sm"
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-line text-slate-600 font-semibold text-sm hover:bg-[#F5F7F4] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-ink text-paper font-semibold text-sm hover:bg-emerald-600 transition-all active:scale-[0.98] shadow-[0_4px_15px_rgba(6,46,35,0.2)] disabled:opacity-50 disabled:pointer-events-none"
                >
                  {loading ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
