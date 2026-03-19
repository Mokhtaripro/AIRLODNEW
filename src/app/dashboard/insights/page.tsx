'use client';

import { TrendingUp, Users, MousePointer, Zap } from 'lucide-react';
import { useApp } from '@/lib/store';
import { DEMO_INSIGHTS } from '@/lib/mock-data';
import { LINK_META } from '@/types';

export default function InsightsPage() {
  const { state } = useApp();
  const ins = DEMO_INSIGHTS;
  const links = state.links.filter(l => l.card_id === state.currentCard?.id);

  const stats = [
    { label: 'Total Views', value: ins.totalLods, icon: TrendingUp },
    { label: 'Link Taps', value: ins.linkTaps, icon: MousePointer },
    { label: 'Connections', value: ins.newConnections, icon: Users },
    { label: 'Tap Rate', value: `${ins.tapThroughRate}%`, icon: Zap },
  ];

  return (
    <div className="px-4 py-5 md:px-8 md:py-7 fade-in">
      <h1 className="text-xl font-bold mb-5">Insights</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="stat-card fade-in" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--accent-bg)] flex items-center justify-center">
                  <Icon className="w-4 h-4 text-[var(--accent)]" />
                </div>
              </div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">{s.label}</p>
              <div className="mini-chart mt-3">
                {ins.dailyData.map((d, j) => (
                  <div key={j} className="mini-chart-bar" style={{ height: `${Math.max(10, (d.views / Math.max(...ins.dailyData.map(x => x.views), 1)) * 100)}%` }} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Ranking */}
        <div className="card p-5 flex-1">
          <p className="section-title">Performance</p>
          <div className="flex items-center gap-8">
            <div>
              <p className="text-3xl font-bold text-[var(--accent)]">{ins.worldRanking}%</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Top ranking</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{ins.popStreak}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Day streak</p>
            </div>
          </div>
        </div>

        {/* Link engagement */}
        <div className="card overflow-hidden flex-1">
          <div className="p-4 pb-2">
            <p className="section-title !mb-0">Link Engagement</p>
          </div>
          {links.map(link => {
            const meta = LINK_META[link.type];
            return (
              <div key={link.id} className="flex items-center gap-3 px-4 py-3 border-t border-[var(--border)] hover:bg-[var(--bg-hover)] transition">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: (meta?.color || '#666') + '12' }}>
                  <span className="text-xs font-semibold" style={{ color: meta?.color }}>{meta?.label?.charAt(0) || '?'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{meta?.label || link.type}</p>
                  <p className="text-[11px] text-[var(--text-muted)] truncate">{link.value}</p>
                </div>
                <span className="text-xs text-[var(--text-light)]">0 taps</span>
              </div>
            );
          })}
          {links.length === 0 && <p className="text-sm text-[var(--text-muted)] text-center py-8">No links yet</p>}
        </div>
      </div>
    </div>
  );
}
