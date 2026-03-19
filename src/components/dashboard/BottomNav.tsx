'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { CreditCard, Users, Share2, QrCode, Settings, BarChart3 } from 'lucide-react';

const navItems = [
  { href: '/dashboard/cards', label: 'Cards', icon: CreditCard },
  { href: '/dashboard/contacts', label: 'Contacts', icon: Users },
  { href: '/dashboard/share', label: 'Share', icon: Share2 },
  { href: '/dashboard/scan', label: 'Scan', icon: QrCode },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      <div className="flex items-center justify-around max-w-[600px] mx-auto relative">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-1 px-3 transition-all ${
                isActive
                  ? 'text-white'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 1.5} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}

        {/* Floating action button - insights */}
        <Link
          href="/dashboard/insights"
          className="absolute -top-6 left-1/2 -translate-x-1/2 fab"
          style={{ width: 48, height: 48 }}
        >
          <BarChart3 className="w-5 h-5" />
        </Link>
      </div>
    </nav>
  );
}
