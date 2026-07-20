'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, User, Users, LogOut, Receipt, ArrowLeftRight } from 'lucide-react';

interface DashboardSidebarProps {
  user: { email?: string; user_metadata?: { full_name?: string } };
}

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-[260px] bg-[#0d1526] border-r border-white/5 flex flex-col z-40 hidden lg:flex">
        {/* Logo */}
        <div className="px-6 h-[75px] flex items-center gap-3 border-b border-white/5 shrink-0">
          <img src="/logo.png" alt="Logo" className="w-7 h-7 drop-shadow-[0_0_8px_rgba(124,58,237,0.4)]" />
          <span className="font-space text-[20px] font-bold text-white">
            Pay<span className="text-violet-400">Mint</span> Verse
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Menu</p>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-violet-700/20 text-violet-300 border border-violet-700/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className="w-[18px] h-[18px]" />
                {item.label}
              </Link>
            );
          })}

          <p className="px-3 pt-6 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Coming Soon</p>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium text-slate-600 cursor-not-allowed">
            <Receipt className="w-[18px] h-[18px]" />
            Expenses
          </div>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium text-slate-600 cursor-not-allowed">
            <ArrowLeftRight className="w-[18px] h-[18px]" />
            Settlements
          </div>
        </nav>

        {/* User + Logout */}
        <div className="px-4 py-4 border-t border-white/5 shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-violet-900/40 flex items-center justify-center text-violet-300 font-bold text-sm font-space shrink-0">
              {(user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user.user_metadata?.full_name || 'User'}
              </p>
              <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <a
            href="/auth/signout"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] font-medium text-red-400 hover:bg-red-500/10 transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </a>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-[60px] bg-[#0d1526]/95 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-6 h-6" />
          <span className="font-space text-lg font-bold text-white">
            Pay<span className="text-violet-400">Mint</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`p-2 rounded-lg transition-colors ${isActive ? 'text-violet-400 bg-violet-700/20' : 'text-slate-400 hover:text-white'}`}
              >
                <Icon className="w-5 h-5" />
              </Link>
            );
          })}
          <a href="/auth/signout" className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors">
            <LogOut className="w-5 h-5" />
          </a>
        </div>
      </div>
    </>
  );
}
