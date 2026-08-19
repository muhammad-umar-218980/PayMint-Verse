'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7F4] flex flex-col items-center justify-center px-4 font-sans">
      <div className="w-full max-w-[420px]">
        <div className="flex items-center justify-center gap-3 mb-6">
          <img src="/green logo.png" alt="Logo" className="w-12 h-12" />
          <span className="font-space text-3xl font-bold text-[#062E23]">
            Pay<span className="text-[#059669]">Mint</span> Verse
          </span>
        </div>

        <div className="bg-white border border-[#062E23]/10 rounded-2xl p-8 shadow-[0_4px_15px_rgba(6,46,35,0.08)]">
          <h1 className="font-space font-bold text-xl text-[#062E23] tracking-tight mb-1">
            Choose a new password
          </h1>
          <p className="text-[12px] text-[#062E23]/60 mb-5 font-medium">
            Make it at least 6 characters and something you&apos;ll remember.
          </p>

          {error && (
            <div className="w-full bg-red-500/10 border border-red-500/30 text-red-600 text-xs px-3 py-2 rounded-lg mb-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="relative w-full mb-3">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#F5F7F4] border border-[#062E23]/10 px-4 py-2.5 rounded-xl text-[#062E23] placeholder-slate-400 focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition-all font-medium text-[13px]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#062E23] transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="relative w-full mb-4">
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-[#F5F7F4] border border-[#062E23]/10 px-4 py-2.5 rounded-xl text-[#062E23] placeholder-slate-400 focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition-all font-medium text-[13px]"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#062E23] transition-colors"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl border border-[#062E23] bg-[#062E23] text-[#F5F7F4] font-bold text-[12px] w-full py-2.5 uppercase tracking-wide hover:bg-[#059669] hover:border-[#059669] transition-all active:scale-[0.98] shadow-[0_4px_15px_rgba(6,46,35,0.2)] disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? 'Updating...' : 'Update password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}