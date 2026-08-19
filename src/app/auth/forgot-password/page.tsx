'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MailCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
    });

    if (resetError) {
      setError(resetError.message);
    } else {
      setSent(true);
    }
    setLoading(false);
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
          {sent ? (
            <div className="text-center py-6">
              <MailCheck className="w-12 h-12 text-[#059669] mx-auto mb-4" />
              <h1 className="font-space font-bold text-xl text-[#062E23] tracking-tight mb-2">
                Check your inbox
              </h1>
              <p className="text-[13px] text-[#062E23]/60 font-medium leading-relaxed mb-6">
                If an account exists for <span className="text-[#062E23]">{email}</span>, we&apos;ve
                sent a password reset link. Follow it to choose a new password.
              </p>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 rounded-xl border border-[#062E23] bg-[#062E23] text-[#F5F7F4] font-bold text-[12px] px-5 py-2.5 uppercase tracking-wide hover:bg-[#059669] hover:border-[#059669] transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="font-space font-bold text-xl text-[#062E23] tracking-tight mb-1">
                Reset your password
              </h1>
              <p className="text-[12px] text-[#062E23]/60 mb-5 font-medium">
                Enter your email and we&apos;ll send you a reset link.
              </p>

              {error && (
                <div className="w-full bg-red-500/10 border border-red-500/30 text-red-600 text-xs px-3 py-2 rounded-lg mb-3">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#F5F7F4] border border-[#062E23]/10 px-4 py-2.5 rounded-xl mb-4 text-[#062E23] placeholder-slate-400 focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition-all font-medium text-[13px]"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl border border-[#062E23] bg-[#062E23] text-[#F5F7F4] font-bold text-[12px] w-full py-2.5 uppercase tracking-wide hover:bg-[#059669] hover:border-[#059669] transition-all active:scale-[0.98] shadow-[0_4px_15px_rgba(6,46,35,0.2)] disabled:opacity-50 disabled:pointer-events-none"
                >
                  {loading ? 'Sending...' : 'Send reset link'}
                </button>
              </form>

              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 text-[12px] text-[#062E23]/60 hover:text-[#059669] transition-colors font-medium mt-4"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}