'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { createGroup } from '@/app/actions/groups';

export default function CreateGroupModal() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.set('name', name);

    const result = await createGroup(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setOpen(false);
      setName('');
      router.refresh();
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-violet-700 hover:bg-violet-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all active:scale-95 shadow-[0_4px_15px_rgba(124,58,237,0.3)]"
      >
        + Create Group
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-[#151f30] border border-violet-900/40 rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-space text-xl font-bold text-white mb-1">Create Group</h2>
            <p className="text-slate-400 text-sm mb-6">Start splitting expenses with your group.</p>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-xs px-3 py-2 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Group name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0B1120] border border-white/10 px-4 py-2.5 rounded-xl mb-4 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all font-medium text-sm"
                required
                autoFocus
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-300 font-semibold text-sm hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-violet-700 text-white font-semibold text-sm hover:bg-violet-600 transition-all active:scale-[0.98] shadow-[0_4px_15px_rgba(124,58,237,0.3)] disabled:opacity-50 disabled:pointer-events-none"
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
