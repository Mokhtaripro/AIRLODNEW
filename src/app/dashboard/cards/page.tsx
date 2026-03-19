'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, ExternalLink, Search, Check } from 'lucide-react';
import { useApp } from '@/lib/store';
import { getInitials } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';
import { generateCardCode } from '@/lib/utils';
import type { Card } from '@/types';

export default function CardsPage() {
  const { state, dispatch } = useApp();
  const router = useRouter();
  const [search, setSearch] = useState('');

  const steps = [
    { label: 'Create your card', done: state.cards.length > 0 },
    { label: 'Set up your card', done: state.links.length > 0 },
    { label: 'Share your card', done: false },
    { label: 'Capture a lead', done: false },
  ];
  const doneCount = steps.filter(s => s.done).length;

  const handleCreate = () => {
    const card: Card = {
      id: uuidv4(),
      user_id: state.user?.id || 'demo',
      code: generateCardCode(),
      title: 'New Card',
      name: '',
      description: '',
      bio: '',
      phone: '',
      email: '',
      address: '',
      photo_url: undefined,
      theme_color: '#1a73e8',
      color_link_icons: false,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_CARD', payload: card });
    dispatch({ type: 'SET_CURRENT_CARD', payload: card });
    router.push(`/dashboard/editor?id=${card.id}`);
  };

  const edit = (c: Card) => {
    dispatch({ type: 'SET_CURRENT_CARD', payload: c });
    router.push(`/dashboard/editor?id=${c.id}`);
  };

  const share = (c: Card) => {
    dispatch({ type: 'SET_CURRENT_CARD', payload: c });
    router.push('/dashboard/share');
  };

  const filtered = state.cards.filter(c =>
    !search || (c.name + c.title + c.description).toLowerCase().includes(search.toLowerCase())
  );

  if (state.loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-7 h-7 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 py-5 md:px-8 md:py-7 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold">My Cards</h1>
          <button onClick={handleCreate} className="w-6 h-6 rounded-full bg-[var(--text)] text-white flex items-center justify-center hover:opacity-80 transition">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 border border-[var(--border)] rounded-[var(--radius-sm)] px-3 py-2 bg-white w-[220px]">
            <Search className="w-4 h-4 text-[var(--text-light)]" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>
          <button onClick={() => share(state.cards[0])} className="btn-primary !text-sm">
            Share Your Card <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Onboarding */}
      {doneCount < steps.length && (
        <div className="card p-5 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-[15px] font-semibold text-[var(--text)]">Get Started</h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Complete these steps to set up your card</p>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <div className="progress-bar">
                {steps.map((s, i) => <div key={i} className={`progress-seg ${s.done ? 'filled' : ''}`} />)}
              </div>
              <span className="text-xs text-[var(--text-muted)] ml-1">{doneCount}/{steps.length}</span>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-[var(--radius-sm)] border min-w-[160px] flex-1 ${
                  step.done ? 'border-[var(--accent)] bg-[var(--accent-bg)]' : 'border-[var(--border)] bg-white'
                }`}
              >
                <div className={`step-check ${step.done ? 'done' : ''}`}>
                  {step.done && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                </div>
                <span className="text-xs font-medium text-[var(--text)]">{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((card, i) => {
          const links = state.links.filter(l => l.card_id === card.id);
          return (
            <div key={card.id} className="card card-hover overflow-hidden fade-in" style={{ animationDelay: `${i * 60}ms` }}>
              {/* Cover */}
              <div className="h-24 relative" style={{ background: `linear-gradient(135deg, ${card.theme_color || '#1a73e8'}, ${card.theme_color || '#1a73e8'}99)` }}>
                <div className="absolute -bottom-7 left-1/2 -translate-x-1/2">
                  <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center border-[3px] border-white">
                    {card.photo_url ? (
                      <img src={card.photo_url} alt={card.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-base font-bold" style={{ color: card.theme_color || 'var(--accent)' }}>
                        {card.name ? getInitials(card.name) : 'A'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="pt-9 pb-5 px-5 text-center">
                <h3 className="font-semibold text-[15px] text-[var(--text)]">
                  {card.name || card.title || 'New Card'}
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  {card.description || `${links.length} links`}
                </p>

                <div className="flex items-center justify-center gap-2 mt-4">
                  <button onClick={() => edit(card)} className="btn-outline !text-xs !py-2 !px-4">
                    <Pencil className="w-3.5 h-3.5" /> Edit Card
                  </button>
                  <button onClick={() => share(card)} className="btn-primary !text-xs !py-2 !px-4">
                    <ExternalLink className="w-3.5 h-3.5" /> Share
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Create card */}
        <div className="dashed-card min-h-[220px]" onClick={handleCreate}>
          <div className="w-12 h-12 rounded-full bg-[var(--bg-muted)] flex items-center justify-center">
            <Plus className="w-5 h-5 text-[var(--text-muted)]" />
          </div>
          <p className="text-sm font-medium text-[var(--text-secondary)]">Create New Card</p>
        </div>
      </div>
    </div>
  );
}
