'use client';

import { useRouter } from 'next/navigation';
import { User, Bell, Shield, Palette, HelpCircle, LogOut, ChevronRight, Wifi } from 'lucide-react';
import { useApp } from '@/lib/store';

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
    <div className="p-4 pt-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* User card */}
      <div className="glass-card p-4 mb-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-[var(--accent)]/20 flex items-center justify-center">
          <span className="text-lg font-bold text-[var(--accent)]">
            {state.user?.full_name?.charAt(0) || 'U'}
          </span>
        </div>
        <div className="flex-1">
          <p className="font-semibold">{state.user?.full_name || 'User'}</p>
          <p className="text-sm text-[var(--text-muted)]">{state.user?.email || 'demo@airlod.com'}</p>
        </div>
      </div>

      {/* Settings Groups */}
      {settingsGroups.map(group => (
        <div key={group.title} className="mb-6">
          <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3 px-1">
            {group.title}
          </h3>
          <div className="glass-card overflow-hidden divide-y divide-[var(--border-glass)]">
            {group.items.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className="w-full flex items-center gap-3 p-4 hover:bg-[var(--bg-glass-hover)] transition-colors text-left"
                >
                  <div className="w-9 h-9 rounded-xl bg-[var(--bg-glass-strong)] flex items-center justify-center">
                    <Icon className="w-4.5 h-4.5 text-[var(--text-secondary)]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.label}</p>
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
        className="glass-card w-full p-4 flex items-center gap-3 text-red-400 hover:bg-red-500/10 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        <span className="text-sm font-medium">Sign Out</span>
      </button>

      {/* Version */}
      <p className="text-center text-xs text-[var(--text-muted)] mt-8">
        AIRLOD v2.0.0
      </p>
    </div>
  );
}
