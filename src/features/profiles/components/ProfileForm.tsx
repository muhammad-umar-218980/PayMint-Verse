'use client';

import { useState } from 'react';
import { updateProfileAction } from '../actions/profile.actions';
import { createClient } from '@/lib/supabase/client';
import { Profile } from '@/types';
import { Check, AlertCircle, Camera } from 'lucide-react';

interface ProfileFormProps {
  initialProfile: Profile;
}

const INPUT_CLASS =
  'w-full bg-[#F5F7F4] border border-[rgba(6,46,35,0.10)] px-4 py-3 rounded-xl text-ink placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all text-sm';

export default function ProfileForm({ initialProfile }: ProfileFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialProfile.avatar_url);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setMessage('');

    const avatarFile = formData.get('avatar') as File | null;
    if (avatarFile && avatarFile.size > 0) {
      if (!avatarFile.type.startsWith('image/')) {
        setMessage('Please choose an image file.');
        setIsSuccess(false);
        setIsPending(false);
        return;
      }
      if (avatarFile.size > 5 * 1024 * 1024) {
        setMessage('Avatar must be under 5 MB.');
        setIsSuccess(false);
        setIsPending(false);
        return;
      }

      const supabase = createClient();
      const path = `${initialProfile.id}/avatar`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, avatarFile, { upsert: true, cacheControl: '3600' });

      if (uploadError) {
        setMessage(`Failed to upload avatar: ${uploadError.message}`);
        setIsSuccess(false);
        setIsPending(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
      formData.set('avatar_url', publicUrl);
      setAvatarPreview(publicUrl);
    }

    try {
      await updateProfileAction(formData);
      setMessage('Profile updated successfully!');
      setIsSuccess(true);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to update profile.');
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
            ? 'bg-emerald-600/10 border border-emerald-600/20 text-emerald-700'
            : 'bg-red-50 border border-red-200 text-red-600'
        }`}>
          {isSuccess ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          {message}
        </div>
      )}

      <form action={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="avatar" className="block text-sm font-medium text-slate-600 mb-2">Profile Picture</label>
          <label
            htmlFor="avatar"
            className="flex items-center gap-4 cursor-pointer group w-fit"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-600/10 border border-emerald-600/20 overflow-hidden flex items-center justify-center group-hover:opacity-80 transition-opacity">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
              ) : (
                <Camera className="w-6 h-6 text-emerald-600" />
              )}
            </div>
            <span className="text-[13px] font-medium text-emerald-600 group-hover:text-emerald-700 transition-colors">
              {avatarPreview ? 'Change photo' : 'Upload a photo'}
            </span>
          </label>
          <input
            type="file"
            id="avatar"
            name="avatar"
            accept="image/*"
            className="hidden"
          />
          <p className="text-[11px] text-slate-400 mt-2">JPG, PNG or WebP, up to 5 MB.</p>
        </div>

        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-slate-600 mb-2">Full Name</label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            defaultValue={initialProfile.full_name || ''}
            className={INPUT_CLASS}
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-slate-600 mb-2">Preferred Currency</label>
          <select
            id="currency"
            name="currency"
            defaultValue={initialProfile.currency || 'PKR'}
            className={`${INPUT_CLASS} appearance-none`}
          >
            <option value="PKR">Pakistani Rupee (PKR)</option>
            <option value="USD">US Dollar (USD)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="GBP">British Pound (GBP)</option>
          </select>
        </div>

        <div>
          <label htmlFor="timezone" className="block text-sm font-medium text-slate-600 mb-2">Timezone</label>
          <select
            id="timezone"
            name="timezone"
            defaultValue={initialProfile.timezone || 'Asia/Karachi'}
            className={`${INPUT_CLASS} appearance-none`}
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
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-paper bg-ink hover:bg-emerald-600 transition-all active:scale-[0.98] shadow-[0_4px_15px_rgba(6,46,35,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-paper/30 border-t-paper rounded-full animate-spin" />
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
