'use client';

import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const GoogleIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

interface AuthUIProps {
  mode: 'login' | 'signup';
}

export default function AuthUI({ mode }: AuthUIProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const queryMode = searchParams?.get('mode');
  const resolvedMode = (queryMode as 'login' | 'signup') || mode;
  
  const [isRightPanelActive, setIsRightPanelActive] = useState(resolvedMode === 'signup');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  // Status States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    setIsRightPanelActive(resolvedMode === 'signup');
    setError(null);
    setSuccessMsg(null);
  }, [resolvedMode]);

  // Handle Sign Up
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    
    const { error: signUpError, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          full_name: fullName,
        }
      }
    });

    if (signUpError) {
      setError(signUpError.message);
    } else {
      // If email confirmations are enabled, the session will be null
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        setError("This email is already in use.");
      } else if (!data.session) {
        setSuccessMsg("Success! Please check your email for a confirmation link.");
        // Clear form
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setFullName('');
      } else {
        // If email confirmation is off, they are logged in automatically
        router.push('/dashboard');
        router.refresh();
      }
    }
    setLoading(false);
  };

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  // Google OAuth Placeholder
  const handleGoogleAuth = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-white flex justify-center items-center font-sans relative overflow-hidden py-0">
      
      {/* Background glow for the app theme */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Container */}
      <div className={`relative bg-[#151f30] border border-violet-900/40 rounded-[2rem] shadow-2xl overflow-hidden w-full max-w-[900px] min-h-[480px] transition-all duration-700 z-10 mx-4`}>
        
        {/* Sign Up Container */}
        <div 
          className={`absolute top-0 h-full w-1/2 left-0 transition-all duration-700 ease-in-out ${
            isRightPanelActive 
              ? "translate-x-full opacity-100 z-50" 
              : "opacity-0 z-10 pointer-events-none"
          }`}
        >
          <div className="bg-[#151f30] flex flex-col items-center justify-center px-6 sm:px-8 h-full text-center">
            
            <div className="flex items-center gap-3 mb-2">
              <img src="/logo.png" alt="Logo" className="w-12 h-12 drop-shadow-[0_0_10px_rgba(124,58,237,0.4)]" />
              <span className="font-space text-3xl font-bold text-white">
                Pay<span className="text-violet-400">Mint</span> Verse
              </span>
            </div>

            <h1 className="font-space font-bold text-xl mb-3 text-white tracking-tight">Create your account</h1>
            
            {error && isRightPanelActive && (
              <div className="w-full max-w-[320px] bg-red-500/10 border border-red-500/50 text-red-400 text-xs px-3 py-2 rounded-lg mb-3">
                {error}
              </div>
            )}
            
            {successMsg && isRightPanelActive && (
              <div className="w-full max-w-[320px] bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 text-xs px-3 py-2 rounded-lg mb-3">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSignup} className="w-full max-w-[320px] flex flex-col items-center">
              <input 
                type="text" 
                placeholder="Full Name" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#0B1120] border border-white/10 px-4 py-2.5 rounded-xl mb-2 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all font-medium text-[13px]" 
                required
              />
              <input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0B1120] border border-white/10 px-4 py-2.5 rounded-xl mb-2 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all font-medium text-[13px]" 
                required
              />
              <div className="relative w-full mb-2">
                <input 
                  type={showSignupPassword ? "text" : "password"} 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0B1120] border border-white/10 px-4 py-2.5 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all font-medium text-[13px]" 
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="relative w-full mb-4">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="Confirm Password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#0B1120] border border-white/10 px-4 py-2.5 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all font-medium text-[13px]" 
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="rounded-xl border border-violet-700 bg-violet-700 text-white font-bold text-[12px] w-full py-2.5 uppercase tracking-wide hover:bg-violet-600 transition-all active:scale-[0.98] shadow-[0_4px_15px_rgba(124,58,237,0.3)] disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? 'Creating...' : 'Create Account'}
              </button>

              <div className="flex items-center w-full my-3 opacity-60">
                <div className="flex-1 border-t border-white/10"></div>
                <span className="px-3 text-xs text-slate-400 font-medium">OR</span>
                <div className="flex-1 border-t border-white/10"></div>
              </div>

              <button 
                type="button" 
                onClick={handleGoogleAuth}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#0B1120] text-white font-semibold text-[13px] w-full py-2.5 hover:bg-white/5 transition-all active:scale-[0.98]"
              >
                <GoogleIcon className="w-4 h-4" />
                Continue with Google
              </button>
            </form>
          </div>
        </div>

        {/* Sign In Container */}
        <div 
          className={`absolute top-0 h-full w-1/2 left-0 transition-all duration-700 ease-in-out z-20 ${
            isRightPanelActive 
              ? "translate-x-full opacity-0 pointer-events-none" 
              : "opacity-100"
          }`}
        >
          <div className="bg-[#151f30] flex flex-col items-center justify-center px-6 sm:px-8 h-full text-center">
            
            <div className="flex items-center gap-3 mb-2">
              <img src="/logo.png" alt="Logo" className="w-12 h-12 drop-shadow-[0_0_10px_rgba(124,58,237,0.4)]" />
              <span className="font-space text-3xl font-bold text-white">
                Pay<span className="text-violet-400">Mint</span> Verse
              </span>
            </div>

            <h1 className="font-space font-bold text-xl text-white tracking-tight mb-1">Login</h1>
            <p className="text-[12px] text-slate-400 mb-4 font-medium">Split expenses with friends effortlessly</p>
            
            {error && !isRightPanelActive && (
              <div className="w-full max-w-[320px] bg-red-500/10 border border-red-500/50 text-red-400 text-xs px-3 py-2 rounded-lg mb-3">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="w-full max-w-[320px] flex flex-col items-center">
              <input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0B1120] border border-white/10 px-4 py-2.5 rounded-xl mb-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all font-medium text-[13px]" 
                required
              />
              
              <div className="relative w-full mb-1">
                <input 
                  type={showLoginPassword ? "text" : "password"} 
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full bg-[#0B1120] border border-white/10 px-4 py-2.5 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all font-medium text-[13px]" 
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="w-full text-right mb-4">
                <a href="#" className="text-[11px] text-slate-400 hover:text-violet-400 transition-colors font-medium">
                  Forgot Password?
                </a>
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="rounded-xl border border-violet-700 bg-violet-700 text-white font-bold text-[12px] w-full py-2.5 uppercase tracking-wide hover:bg-violet-600 transition-all active:scale-[0.98] shadow-[0_4px_15px_rgba(124,58,237,0.3)] disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>

              <div className="flex items-center w-full my-4 opacity-60">
                <div className="flex-1 border-t border-white/10"></div>
                <span className="px-3 text-xs text-slate-400 font-medium">OR</span>
                <div className="flex-1 border-t border-white/10"></div>
              </div>

              <button 
                type="button" 
                onClick={handleGoogleAuth}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#0B1120] text-white font-semibold text-[13px] w-full py-2.5 hover:bg-white/5 transition-all active:scale-[0.98]"
              >
                <GoogleIcon className="w-4 h-4" />
                Continue with Google
              </button>
            </form>
          </div>
        </div>

        {/* Overlay Container */}
        <div 
          className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-[100] ${
            isRightPanelActive ? "-translate-x-full" : ""
          }`}
        >
          {/* Overlay Background */}
          <div 
            className={`bg-gradient-to-br from-violet-600 via-indigo-600 to-indigo-800 relative -left-full h-full w-[200%] transform transition-transform duration-700 ease-in-out ${
              isRightPanelActive ? "translate-x-1/2" : "translate-x-0"
            }`}
          >
            {/* Background patterns */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
            
            {/* Overlay Left (Shown when signing up) */}
            <div 
              className={`absolute flex flex-col items-center justify-center px-6 sm:px-10 text-center top-0 h-full w-1/2 transform transition-transform duration-700 ease-in-out ${
                isRightPanelActive ? "translate-x-0" : "-translate-x-[20%]"
              }`}
            >
              <h1 className="font-space font-bold text-3xl mb-3 text-white tracking-tight leading-tight">
                Welcome Back!
              </h1>
              <p className="text-white/80 text-[13px] mb-6 leading-[1.6] font-medium max-w-[250px]">
                Already have an account? Login to keep connected with your groups.
              </p>
              <button 
                onClick={() => {
                  setIsRightPanelActive(false);
                  setError(null);
                  setSuccessMsg(null);
                }} 
                className="rounded-xl border border-white/80 bg-transparent text-white font-bold text-[12px] px-8 py-2.5 uppercase tracking-[0.1em] hover:bg-white/10 hover:border-white transition-all active:scale-95 w-full max-w-[160px]"
              >
                Login
              </button>
            </div>

            {/* Overlay Right (Shown when signing in) */}
            <div 
              className={`absolute right-0 flex flex-col items-center justify-center px-6 sm:px-10 text-center top-0 h-full w-1/2 transform transition-transform duration-700 ease-in-out ${
                isRightPanelActive ? "translate-x-[20%]" : "translate-x-0"
              }`}
            >
              <h1 className="font-space font-bold text-3xl mb-3 text-white tracking-tight leading-tight">
                Hello, Friend!
              </h1>
              <p className="text-white/80 text-[13px] mb-6 leading-[1.6] font-medium max-w-[250px]">
                Don't have an account? Sign up to start tracking shared expenses with us.
              </p>
              <button 
                onClick={() => {
                  setIsRightPanelActive(true);
                  setError(null);
                  setSuccessMsg(null);
                }} 
                className="rounded-xl border border-white/80 bg-transparent text-white font-bold text-[12px] px-8 py-2.5 uppercase tracking-[0.1em] hover:bg-white/10 hover:border-white transition-all active:scale-95 w-full max-w-[160px]"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Link 
        href="/" 
        className="absolute top-6 left-6 text-slate-400 hover:text-white transition-colors text-[14px] font-medium flex items-center gap-2 group z-50"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>
    </div>
  );
}
