'use client';

import { useState } from 'react';
import { updateProfileAction } from '../actions/profile.actions';
import { Profile } from '@/types';
import { Check, AlertCircle } from 'lucide-react';

interface ProfileFormProps {
  initialProfile: Profile;
}

export default function ProfileForm({ initialProfile }: ProfileFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setMessage('');
    try {
      await updateProfileAction(formData);
      setMessage('Profile updated successfully!');
      setIsSuccess(true);
    } catch (error: any) {
      setMessage(error.message || 'Failed to update profile.');
      setIsSuccess(false);
    } finally {
      setIsPending(false);
      setTimeout(() => setMessage(''), 4000);
    }
  }

  return (
    <>
      {message && (
        <div className={`flex items-center gap-2 p-4 mb-6 rounded-xl text-sm font-medium ${
          isSuccess
            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
            : 'bg-red-500/10 border border-red-500/20 text-red-400'
        }`}>
          {isSuccess ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          {message}
        </div>
      )}

      <form action={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            defaultValue={initialProfile.full_name || ''}
            className="w-full bg-[#0B1120] border border-white/10 px-4 py-3 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-slate-300 mb-2">Preferred Currency</label>
          <select
            id="currency"
            name="currency"
            defaultValue={initialProfile.currency || 'PKR'}
            className="w-full bg-[#0B1120] border border-white/10 px-4 py-3 rounded-xl text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm appearance-none"
          >
            <option value="PKR">Pakistani Rupee (PKR)</option>
            <option value="USD">US Dollar (USD)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="GBP">British Pound (GBP)</option>
          </select>
        </div>

        <div>
          <label htmlFor="timezone" className="block text-sm font-medium text-slate-300 mb-2">Timezone</label>
          <select
            id="timezone"
            name="timezone"
            defaultValue={initialProfile.timezone || 'Asia/Karachi'}
            className="w-full bg-[#0B1120] border border-white/10 px-4 py-3 rounded-xl text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm appearance-none"
          >
            <option value="Asia/Karachi">Asia/Karachi (PKT)</option>
            <option value="UTC">UTC</option>
            <option value="America/New_York">America/New_York (EST)</option>
            <option value="Europe/London">Europe/London (GMT)</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-violet-700 hover:bg-violet-600 transition-all active:scale-[0.98] shadow-[0_4px_15px_rgba(124,58,237,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            'Save Profile'
          )}
        </button>
      </form>
    </>
  );
}
