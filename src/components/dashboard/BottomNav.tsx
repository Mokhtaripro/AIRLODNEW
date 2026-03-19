'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { CreditCard, Users, Share2, BarChart3, Settings } from 'lucide-react';

const items = [
  { href: '/dashboard/cards', label: 'Cards', icon: CreditCard },
  { href: '/dashboard/contacts', label: 'Contacts', icon: Users },
  { href: '/dashboard/insights', label: 'Insights', icon: BarChart3 },
  { href: '/dashboard/share', label: 'Share', icon: Share2 },
  { href: '/dashboard/settings', label: 'More', icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {items.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-0.5 py-1 px-2 min-w-[52px] transition-colors"
              style={{ color: active ? 'var(--accent)' : 'var(--text-muted)' }}
            >
              <Icon className="w-[20px] h-[20px]" strokeWidth={active ? 2.2 : 1.5} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
