'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { CreditCard, Users, Share2, QrCode, Settings, PenSquare, BarChart3, Wifi } from 'lucide-react';

const navItems = [
  { href: '/dashboard/cards', label: 'Cards', icon: CreditCard },
  { href: '/dashboard/editor', label: 'Editor', icon: PenSquare },
  { href: '/dashboard/contacts', label: 'Contacts', icon: Users },
  { href: '/dashboard/share', label: 'Share', icon: Share2 },
  { href: '/dashboard/insights', label: 'Insights', icon: BarChart3 },
  { href: '/dashboard/scan', label: 'Scan', icon: QrCode },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="p-6 mb-2">
        <Link href="/dashboard/cards" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center">
            <Wifi className="w-4.5 h-4.5 text-black" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Airl<span className="text-[var(--accent)]">o</span>d
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
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2 : 1.5} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[var(--border-glass)]">
        <p className="text-[10px] text-[var(--text-muted)] text-center">
          AIRLOD v2.0.0
        </p>
      </div>
    </aside>
  );
}
