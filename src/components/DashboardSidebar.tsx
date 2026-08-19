'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  LogOut,
  User,
  Menu,
  X,
  LayoutGrid,
  Plus,
  PanelLeftClose,
  PanelLeftOpen,
  Plane,
  HomeIcon,
  Users,
  Utensils,
  Sparkles,
  PiggyBank,
} from 'lucide-react';
import CreateGroupModal from '@/features/groups/components/CreateGroupModal';
import NotificationBell from '@/features/notifications/components/NotificationBell';

interface DashboardSidebarProps {
  user: { id: string; email?: string; user_metadata?: { full_name?: string } };
  avatarUrl?: string | null;
  groups: { id: string; name: string }[];
  children: React.ReactNode;
}

const NAV_ICON_FALLBACK = [Plane, HomeIcon, Users, Utensils];

function groupIcon(name: string) {
  const n = name.toLowerCase();
  if (/(travel|trip|lisbon|flight|air|vacation|holiday|tour|weekend)/.test(n)) return Plane;
  if (/(team|office|studio|company|startup|work)/.test(n)) return Users;
  if (/(home|apartment|flat|house|rent|room)/.test(n)) return HomeIcon;
  if (/(food|dinner|dining|eat|restaurant|supper|club|kitchen)/.test(n)) return Utensils;
  if (/(party|event|birthday|celebrat)/.test(n)) return Sparkles;
  if (/(save|saving|goal|fund|furniture|shopping)/.test(n)) return PiggyBank;
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return NAV_ICON_FALLBACK[h % NAV_ICON_FALLBACK.length];
}

function NavRow({
  href,
  active,
  collapsed,
  icon,
  label,
  onNavigate,
}: {
  href: string;
  active: boolean;
  collapsed: boolean;
  icon: React.ReactNode;
  label: string;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      onClick={onNavigate}
      className={`flex items-center gap-2.5 rounded-[12px] transition-colors duration-200 cursor-pointer ${
        collapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2.5'
      } ${
        active
          ? 'bg-ink text-paper'
          : 'text-ink/75 hover:bg-ink/[0.05] hover:text-ink'
      }`}
    >
      <span className="w-[15px] h-[15px] shrink-0 flex items-center justify-center">{icon}</span>
      <span className={`truncate text-[13.5px] ${collapsed ? 'lg:hidden' : ''}`}>{label}</span>
    </Link>
  );
}

function GroupList({ groups, pathname, collapsed, onNavigate }: {
  groups: { id: string; name: string }[];
  pathname: string;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
      <NavRow
        href="/dashboard"
        active={pathname === '/dashboard'}
        collapsed={collapsed}
        label="Overview"
        onNavigate={onNavigate}
        icon={<LayoutGrid className="w-full h-full" />}
      />

      <div className="h-px bg-line mx-1 my-2.5" />

      {groups.length === 0 && (
        <p className={`px-3 text-[13px] text-ink/40 ${collapsed ? 'lg:hidden' : ''}`}>
          No groups yet.
        </p>
      )}

      {groups.map((g) => {
        const IconCmp = groupIcon(g.name);
        return (
          <NavRow
            key={g.id}
            href={`/groups/${g.id}`}
            active={pathname === `/groups/${g.id}`}
            collapsed={collapsed}
            label={g.name}
            onNavigate={onNavigate}
            icon={<IconCmp className="w-full h-full" />}
          />
        );
      })}

      <div className={collapsed ? 'lg:flex lg:justify-center pt-1' : 'pt-1'}>
        <CreateGroupModal
          triggerLabel={collapsed ? '' : 'New group'}
          triggerIcon={collapsed ? <Plus className="w-4 h-4" /> : undefined}
          triggerClassName={
            collapsed
              ? 'flex items-center justify-center w-9 h-9 rounded-xl border border-dashed border-ink/20 text-ink/60 hover:text-ink hover:border-ink/40 hover:bg-ink/[0.04] transition-colors'
              : 'flex items-center gap-2 w-full px-3 py-2.5 rounded-xl border border-dashed border-ink/20 text-[13px] text-ink/60 hover:text-ink hover:border-ink/40 hover:bg-ink/[0.04] transition-colors'
          }
        />
      </div>
    </nav>
  );
}

function UserFooter({ user, avatarUrl, initials, collapsed, onNavigate }: {
  user: { id: string; email?: string; user_metadata?: { full_name?: string } };
  avatarUrl?: string | null;
  initials: string;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  return (
    <div className={`px-3 py-3 border-t border-line shrink-0 ${collapsed ? 'lg:px-2' : ''}`}>
      <div className={`flex items-center ${collapsed ? 'lg:justify-center' : 'gap-2.5'} mb-2.5`}>
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover shrink-0 border border-emerald-600/20"
          />
        ) : (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0 bg-ink text-paper`}>
            {initials}
          </div>
        )}
        <div className={`min-w-0 ${collapsed ? 'lg:hidden' : ''}`}>
          <p className="text-[13.5px] font-medium text-ink truncate">
            {user.user_metadata?.full_name || 'User'}
          </p>
          <p className="text-[11px] text-ink/45 truncate">{user.email}</p>
        </div>
      </div>
      <div className={`flex items-center gap-1.5 ${collapsed ? 'lg:flex-col' : ''}`}>
        <Link
          href="/profile"
          title={collapsed ? 'Profile' : undefined}
          onClick={onNavigate}
          className={`flex items-center justify-center gap-2 rounded-lg text-[13px] font-medium text-ink/60 hover:text-ink hover:bg-ink/[0.05] transition-colors ${
            collapsed ? 'w-9 h-9' : 'flex-1 px-3 py-2'
          }`}
        >
          <User className="w-4 h-4 shrink-0" />
          <span className={collapsed ? 'lg:hidden' : ''}>Profile</span>
        </Link>
        <form action="/auth/signout" method="POST">
          <button
            type="submit"
            title={collapsed ? 'Sign Out' : undefined}
            className={`flex items-center justify-center gap-2 rounded-lg text-[13px] font-medium text-ink/60 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer ${
              collapsed ? 'w-9 h-9' : 'flex-1 px-3 py-2'
            }`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span className={collapsed ? 'lg:hidden' : ''}>Sign Out</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default function DashboardSidebar({ user, avatarUrl, groups, children }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem('pm:sidebar-collapsed') === '1';
  });

  useEffect(() => {
    window.localStorage.setItem('pm:sidebar-collapsed', collapsed ? '1' : '0');
  }, [collapsed]);

  const initials = ((user.user_metadata?.full_name || user.email || 'U')[0] || 'U').toUpperCase();

  return (
    <div className="min-h-screen bg-paper text-ink font-sans flex">
      {/* Desktop Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-[#fbfcfb] border-r border-line flex flex-col z-40 hidden lg:flex transition-all duration-300 ${
          collapsed ? 'w-[76px]' : 'w-[240px]'
        }`}
      >
        <div
          className={`h-[60px] flex items-center shrink-0 ${
            collapsed ? 'justify-center' : 'justify-between gap-2 pl-4 pr-2'
          }`}
        >
          {collapsed ? (
            <button
              onClick={() => setCollapsed(false)}
              title="Expand sidebar"
              aria-label="Expand sidebar"
              className="w-10 flex justify-center cursor-pointer"
            >
              <img src="/green logo.png" alt="Logo" className="w-6 h-6 rounded-md" />
            </button>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <img src="/green logo.png" alt="Logo" className="w-6 h-6 rounded-md shrink-0" />
                <span className="text-[17px] font-semibold tracking-tight text-ink">
                  Pay<span className="text-emerald-600">Mint</span>
                </span>
              </div>
              <div className="flex items-center gap-1">
                <NotificationBell userId={user.id} />
                <button
                  onClick={() => setCollapsed(true)}
                  title="Collapse sidebar"
                  aria-label="Collapse sidebar"
                  className="p-2 rounded-lg text-ink/40 hover:text-ink hover:bg-ink/[0.05] transition-colors cursor-pointer"
                >
                  <PanelLeftClose className="w-[18px] h-[18px]" />
                </button>
              </div>
            </>
          )}
        </div>

        <GroupList groups={groups} pathname={pathname} collapsed={collapsed} />

        <UserFooter user={user} avatarUrl={avatarUrl} initials={initials} collapsed={collapsed} />
      </aside>

      {/* Collapsed rail — expand button pinned under header */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          title="Expand sidebar"
          aria-label="Expand sidebar"
          className="hidden lg:flex fixed left-[76px] top-[60px] translate-x-[-50%] w-6 h-6 rounded-full bg-white border border-line shadow-md items-center justify-center text-ink/50 hover:text-ink hover:border-ink/30 z-50 transition-colors cursor-pointer"
        >
          <PanelLeftOpen className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-[60px] bg-[#fbfcfb]/95 backdrop-blur-md border-b border-line flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2">
          <img src="/green logo.png" alt="Logo" className="w-6 h-6 rounded-md" />
          <span className="text-lg font-semibold tracking-tight text-ink">
            Pay<span className="text-emerald-600">Mint</span>
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Link href="/profile" className="p-2 rounded-lg text-ink/50 hover:text-ink hover:bg-ink/[0.05] transition-colors">
            <User className="w-5 h-5" />
          </Link>
          <NotificationBell userId={user.id} />
          <form action="/auth/signout" method="POST">
            <button type="submit" className="p-2 rounded-lg text-ink/50 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
              <LogOut className="w-5 h-5" />
            </button>
          </form>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="p-2 rounded-lg text-ink hover:bg-ink/[0.05] transition-colors cursor-pointer"
            aria-label="Toggle group menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-[300px] bg-[#fbfcfb] shadow-2xl flex flex-col">
            <div className="px-5 h-[60px] flex items-center justify-between border-b border-line shrink-0">
              <span className="text-lg font-semibold tracking-tight text-ink">
                Pay<span className="text-emerald-600">Mint</span>
              </span>
              <button onClick={() => setMenuOpen(false)} className="p-2 text-ink/50 hover:text-ink cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <GroupList groups={groups} pathname={pathname} collapsed={false} onNavigate={() => setMenuOpen(false)} />
            <UserFooter user={user} avatarUrl={avatarUrl} initials={initials} collapsed={false} onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main
        className={`flex-1 ml-0 min-h-screen transition-[margin-left] duration-300 ${
          collapsed ? 'lg:ml-[76px]' : 'lg:ml-[240px]'
        }`}
      >
        {children}
      </main>
    </div>
  );
}