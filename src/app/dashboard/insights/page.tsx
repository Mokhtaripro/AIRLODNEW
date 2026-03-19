'use client';

import { X, PenSquare, Info } from 'lucide-react';
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
    { label: 'Lods', value: insights.totalLods, color: 'rgba(239, 68, 68, 0.3)' },
    { label: 'Link Taps', value: insights.linkTaps, color: 'rgba(239, 68, 68, 0.3)' },
    { label: 'New Connections', value: insights.newConnections, color: 'rgba(239, 68, 68, 0.3)' },
    { label: 'Tap Through Rate', value: insights.tapThroughRate, color: 'rgba(239, 68, 68, 0.3)' },
  ];

  return (
    <div className="p-4 pt-6 md:p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="glass-button !p-2 lg:hidden">
            <X className="w-5 h-5" />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold">Insights</h1>
        </div>
        <button
          onClick={() => router.push('/dashboard/editor?id=' + state.currentCard?.id)}
          className="glass-button flex items-center gap-2 !py-2 !px-4"
        >
          <PenSquare className="w-4 h-4" /> <span className="hidden md:inline">Edit Card</span>
        </button>
      </div>

      {/* Top Stats - wider on desktop */}
      <div className="glass-card p-5 md:p-6 mb-6" style={{ borderColor: 'rgba(239, 68, 68, 0.2)' }}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-xs text-[var(--text-secondary)] mb-1">World Ranking</p>
            <p className="text-3xl font-bold">{insights.worldRanking}%</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Top {insights.worldRanking}% of professionals
            </p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-secondary)] mb-1">Pop Streak</p>
            <p className="text-3xl font-bold">{insights.popStreak}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {insights.popStreak} consecutive day{insights.popStreak > 1 ? 's' : ''}
            </p>
          </div>
          <div className="hidden lg:block">
            <p className="text-xs text-[var(--text-secondary)] mb-1">Total Lods</p>
            <p className="text-3xl font-bold">{insights.totalLods}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">Card views total</p>
          </div>
          <div className="hidden lg:block">
            <p className="text-xs text-[var(--text-secondary)] mb-1">Tap Through Rate</p>
            <p className="text-3xl font-bold">{insights.tapThroughRate}%</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">Views that tap links</p>
          </div>
        </div>
      </div>

      {/* Time Period */}
      <div className="flex justify-center mb-6">
        <button className="btn-dark !py-2 !px-6 !text-sm !rounded-full">
          Last 7 Days
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Stats Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-3 mb-6">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="stat-card animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-2">
                  <Info className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                </div>
                <p className="text-2xl font-bold mb-1">{stat.value}</p>
                <p className="text-xs text-[var(--text-secondary)]">{stat.label}</p>
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
            ))}
          </div>
        </div>

        {/* Link Engagement */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-3">Link Engagement</h3>
          <div className="space-y-2">
            {cardLinks.map(link => {
              const meta = LINK_META[link.type];
              return (
                <div key={link.id} className="link-item">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: (meta?.color || '#666') + '20' }}
                  >
                    <span style={{ color: meta?.color }}>{meta?.label?.charAt(0) || '?'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{meta?.label || link.type}</p>
                    <p className="text-xs text-[var(--text-muted)] truncate">{link.value}</p>
                  </div>
                  <span className="text-sm text-[var(--text-muted)]">0 taps</span>
                </div>
              );
            })}
            {cardLinks.length === 0 && (
              <p className="text-sm text-[var(--text-muted)] text-center py-8">
                No links added yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
