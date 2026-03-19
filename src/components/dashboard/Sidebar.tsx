'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { CreditCard, Users, Share2, BarChart3, Settings, HelpCircle, Wifi, MoreVertical } from 'lucide-react';
import { useApp } from '@/lib/store';
import { getInitials } from '@/lib/utils';

const navItems = [
  { href: '/dashboard/cards', label: 'My Cards', icon: CreditCard },
  { href: '/dashboard/contacts', label: 'Contacts', icon: Users },
  { href: '/dashboard/insights', label: 'Insights', icon: BarChart3 },
  { href: '/dashboard/share', label: 'Share', icon: Share2 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { state } = useApp();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="px-5 py-5 mb-1">
        <Link href="/dashboard/cards" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--text-primary)] flex items-center justify-center">
            <Wifi className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-[var(--text-primary)]">
            airlod
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
            >
              <Icon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2 : 1.5} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-3">
        {/* Help */}
        <Link href="/dashboard/settings" className="sidebar-item mb-2">
          <HelpCircle className="w-[18px] h-[18px]" strokeWidth={1.5} />
          <span>Support</span>
        </Link>

        {/* User profile */}
        <div className="flex items-center gap-3 p-3 rounded-[var(--radius-sm)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-[var(--accent-light)] flex items-center justify-center">
            <span className="text-xs font-semibold text-[var(--accent)]">
              {state.user?.full_name ? getInitials(state.user.full_name) : 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--text-primary)] truncate">
              {state.user?.full_name || 'User'}
            </p>
            <p className="text-[11px] text-[var(--text-muted)] uppercase">User</p>
          </div>
          <MoreVertical className="w-4 h-4 text-[var(--text-muted)]" />
        </div>
      </div>
    </aside>
  );
}
