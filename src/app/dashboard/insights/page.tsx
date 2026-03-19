'use client';

import { PenSquare, Info, TrendingUp, Users, MousePointer, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { DEMO_INSIGHTS } from '@/lib/mock-data';
import { LINK_META } from '@/types';

export default function InsightsPage() {
  const router = useRouter();
  const { state } = useApp();
  const insights = DEMO_INSIGHTS;
  const cardLinks = state.links.filter(l => l.card_id === state.currentCard?.id);

  const stats = [
    { label: 'Total Lods', value: insights.totalLods, icon: TrendingUp, desc: 'Card views' },
    { label: 'Link Taps', value: insights.linkTaps, icon: MousePointer, desc: 'Total taps' },
    { label: 'Connections', value: insights.newConnections, icon: Users, desc: 'New leads' },
    { label: 'Tap Rate', value: `${insights.tapThroughRate}%`, icon: Zap, desc: 'Engagement' },
  ];

  return (
    <div className="p-4 pt-5 md:p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-bold">Insights</h1>
        <button
          onClick={() => router.push('/dashboard/editor?id=' + state.currentCard?.id)}
          className="btn-secondary !text-sm"
        >
          <PenSquare className="w-4 h-4" /> Edit Card
        </button>
      </div>

      {/* Top Banner */}
      <div className="card-flat p-5 mb-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
        <div className="flex-1">
          <p className="text-xs text-[var(--text-muted)] mb-1">World Ranking</p>
          <p className="text-3xl font-bold text-[var(--text-primary)]">{insights.worldRanking}%</p>
          <p className="text-sm text-[var(--text-secondary)]">You&apos;re in the top {insights.worldRanking}% of professionals</p>
        </div>
        <div className="flex-1">
          <p className="text-xs text-[var(--text-muted)] mb-1">Pop Streak</p>
          <p className="text-3xl font-bold text-[var(--text-primary)]">{insights.popStreak}</p>
          <p className="text-sm text-[var(--text-secondary)]">{insights.popStreak} consecutive active days</p>
        </div>
      </div>

      {/* Time Period */}
      <div className="flex justify-center mb-6">
        <button className="btn-secondary !rounded-full !text-sm">Last 7 Days</button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Stats */}
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="stat-card animate-fade-in" style={{ animationDelay: `${index * 0.08}s` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--accent-light)] flex items-center justify-center">
                      <Icon className="w-4 h-4 text-[var(--accent)]" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-[var(--text-primary)]">{stat.value}</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">{stat.label}</p>
                  <div className="mini-chart mt-3">
                    {insights.dailyData.map((day, i) => (
                      <div
                        key={i}
                        className="mini-chart-bar"
                        style={{ height: `${Math.max(10, (day.views / Math.max(...insights.dailyData.map(d => d.views), 1)) * 100)}%` }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Link Engagement */}
        <div className="flex-1">
          <h3 className="font-semibold mb-3">Link Engagement</h3>
          <div className="card-flat overflow-hidden">
            {cardLinks.map(link => {
              const meta = LINK_META[link.type];
              return (
                <div key={link.id} className="flex items-center gap-3 p-3 border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-secondary)] transition-colors">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: (meta?.color || '#666') + '15' }}
                  >
                    <span className="text-sm" style={{ color: meta?.color }}>{meta?.label?.charAt(0) || '?'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)]">{meta?.label || link.type}</p>
                    <p className="text-xs text-[var(--text-muted)] truncate">{link.value}</p>
                  </div>
                  <span className="text-sm text-[var(--text-muted)]">0 taps</span>
                </div>
              );
            })}
            {cardLinks.length === 0 && (
              <p className="text-sm text-[var(--text-muted)] text-center py-8">No links added yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
