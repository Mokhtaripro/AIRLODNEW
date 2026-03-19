'use client';

import { useRouter } from 'next/navigation';
import { User, Bell, Shield, Palette, HelpCircle, LogOut, ChevronRight, Wifi } from 'lucide-react';
import { useApp } from '@/lib/store';
import { getInitials } from '@/lib/utils';

export default function SettingsPage() {
  const router = useRouter();
  const { state } = useApp();

  const settingsGroups = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Profile', desc: 'Manage your account' },
        { icon: Bell, label: 'Notifications', desc: 'Push & email settings' },
        { icon: Shield, label: 'Privacy', desc: 'Security settings' },
      ],
    },
    {
      title: 'App',
      items: [
        { icon: Palette, label: 'Appearance', desc: 'Theme & display' },
        { icon: Wifi, label: 'NFC Settings', desc: 'Manage NFC products' },
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
    <div className="p-4 pt-5 md:p-8 animate-fade-in">
      <h1 className="text-xl md:text-2xl font-bold mb-6">Settings</h1>

      <div className="max-w-2xl">
        {/* User card */}
        <div className="card-flat p-4 md:p-5 mb-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[var(--accent-light)] flex items-center justify-center">
            <span className="text-lg font-bold text-[var(--accent)]">
              {state.user?.full_name ? getInitials(state.user.full_name) : 'U'}
            </span>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-[var(--text-primary)]">{state.user?.full_name || 'User'}</p>
            <p className="text-sm text-[var(--text-muted)]">{state.user?.email || 'demo@airlod.com'}</p>
          </div>
        </div>

        {/* Settings Groups */}
        {settingsGroups.map(group => (
          <div key={group.title} className="mb-5">
            <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2 px-1">
              {group.title}
            </h3>
            <div className="card-flat overflow-hidden divide-y divide-[var(--border)]">
              {group.items.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    className="w-full flex items-center gap-3 p-4 hover:bg-[var(--bg-secondary)] transition-colors text-left"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center">
                      <Icon className="w-4 h-4 text-[var(--text-secondary)]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[var(--text-primary)]">{item.label}</p>
                      <p className="text-xs text-[var(--text-muted)]">{item.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Logout */}
        <button
          onClick={() => router.push('/auth/login')}
          className="card-flat w-full p-4 flex items-center gap-3 text-[var(--danger)] hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>

        <p className="text-center text-xs text-[var(--text-muted)] mt-6 lg:hidden">
          AIRLOD v2.0.0
        </p>
      </div>
    </div>
  );
}
