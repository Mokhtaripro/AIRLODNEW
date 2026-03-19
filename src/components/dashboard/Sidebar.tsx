'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { CreditCard, Users, Share2, BarChart3, Settings, HelpCircle, MoreVertical } from 'lucide-react';
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
      <div className="px-5 pt-6 pb-8">
        <Link href="/dashboard/cards" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center">
            <span className="text-white text-sm font-bold">A</span>
          </div>
          <span className="text-[17px] font-bold tracking-tight text-[var(--text)]">AIRLOD</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3">
        <p className="text-[10px] font-semibold uppercase text-[var(--text-muted)] tracking-wider px-3 mb-2">Menu</p>
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2.2 : 1.6} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 space-y-1">
        <Link href="/dashboard/settings" className="nav-item">
          <HelpCircle className="w-[18px] h-[18px]" strokeWidth={1.6} />
          Support
        </Link>

        <div className="h-px bg-[var(--border)] mx-2 my-2" />

        <div className="flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-sm)] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-[var(--accent-bg)] flex items-center justify-center">
            <span className="text-xs font-bold text-[var(--accent)]">
              {state.user?.full_name ? getInitials(state.user.full_name) : 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-[var(--text)] truncate leading-tight">
              {state.user?.full_name || 'User'}
            </p>
            <p className="text-[11px] text-[var(--text-muted)] leading-tight">Free plan</p>
          </div>
          <MoreVertical className="w-4 h-4 text-[var(--text-light)]" />
        </div>
      </div>
    </aside>
  );
}
