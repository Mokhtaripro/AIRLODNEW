'use client';

import { useRouter } from 'next/navigation';
import { User, Bell, Shield, Palette, HelpCircle, LogOut, ChevronRight, Wifi } from 'lucide-react';
import { useApp } from '@/lib/store';
import { getInitials } from '@/lib/utils';

export default function SettingsPage() {
  const router = useRouter();
  const { state } = useApp();

  const groups = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Profile', desc: 'Manage your account' },
        { icon: Bell, label: 'Notifications', desc: 'Push & email settings' },
        { icon: Shield, label: 'Privacy', desc: 'Security & privacy' },
      ],
    },
    {
      title: 'App',
      items: [
        { icon: Palette, label: 'Appearance', desc: 'Theme & display' },
        { icon: Wifi, label: 'NFC', desc: 'Manage NFC products' },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help Center', desc: 'FAQ & support' },
      ],
    },
  ];

  return (
    <div className="px-4 py-5 md:px-8 md:py-7 fade-in">
      <h1 className="text-xl font-bold mb-5">Settings</h1>

      <div className="max-w-xl">
        {/* User */}
        <div className="card p-4 mb-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[var(--accent-bg)] flex items-center justify-center">
            <span className="text-base font-bold text-[var(--accent)]">
              {state.user?.full_name ? getInitials(state.user.full_name) : 'U'}
            </span>
          </div>
          <div>
            <p className="font-semibold text-[15px]">{state.user?.full_name || 'User'}</p>
            <p className="text-xs text-[var(--text-muted)]">{state.user?.email || 'demo@airlod.com'}</p>
          </div>
        </div>

        {groups.map(g => (
          <div key={g.title} className="mb-4">
            <p className="text-[10px] font-semibold uppercase text-[var(--text-muted)] tracking-wider mb-2 px-1">{g.title}</p>
            <div className="card overflow-hidden divide-y divide-[var(--border)]">
              {g.items.map(item => {
                const Icon = item.icon;
                return (
                  <button key={item.label} className="w-full flex items-center gap-3 p-3.5 hover:bg-[var(--bg-hover)] transition text-left">
                    <div className="w-8 h-8 rounded-lg bg-[var(--bg-muted)] flex items-center justify-center">
                      <Icon className="w-4 h-4 text-[var(--text-secondary)]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-[11px] text-[var(--text-muted)]">{item.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--text-light)]" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <button onClick={() => router.push('/auth/login')} className="card w-full p-3.5 flex items-center gap-3 text-[var(--danger)] hover:bg-red-50 transition mt-2">
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
