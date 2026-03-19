'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Share2, Search, Check, Wifi } from 'lucide-react';
import { useApp } from '@/lib/store';
import { getCardUrl, getInitials } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';
import { generateCardCode } from '@/lib/utils';
import type { Card } from '@/types';

const ONBOARDING_STEPS = [
  { label: 'Create your card', done: true },
  { label: 'Set up your card', done: true },
  { label: 'Add your links', done: true },
  { label: 'Share your card', done: false },
  { label: 'Capture a lead', done: false },
];

export default function CardsPage() {
  const { state, dispatch } = useApp();
  const router = useRouter();
  const [search, setSearch] = useState('');

  const completedSteps = ONBOARDING_STEPS.filter(s => s.done).length;

  const handleCreateCard = () => {
    const newCard: Card = {
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
      theme_color: '#00b4d8',
      color_link_icons: false,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_CARD', payload: newCard });
    dispatch({ type: 'SET_CURRENT_CARD', payload: newCard });
    router.push(`/dashboard/editor?id=${newCard.id}`);
  };

  const handleEditCard = (card: Card) => {
    dispatch({ type: 'SET_CURRENT_CARD', payload: card });
    router.push(`/dashboard/editor?id=${card.id}`);
  };

  const handleShareCard = (card: Card) => {
    dispatch({ type: 'SET_CURRENT_CARD', payload: card });
    router.push('/dashboard/share');
  };

  if (state.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 pt-5 md:p-8 animate-fade-in">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-xl md:text-2xl font-bold">My Cards</h1>
          <button
            onClick={handleCreateCard}
            className="w-7 h-7 rounded-full bg-[var(--text-primary)] text-white flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Search (desktop) */}
          <div className="hidden md:flex items-center gap-2 border border-[var(--border)] rounded-[var(--radius-sm)] px-3 py-2 bg-white min-w-[240px]">
            <Search className="w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm w-full text-[var(--text-primary)]"
            />
          </div>

          <button
            onClick={() => {
              const card = state.cards[0];
              if (card) handleShareCard(card);
            }}
            className="btn-dark !py-2 !px-4 text-sm"
          >
            Share Your Card <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Onboarding Steps */}
      <div className="card-flat p-5 mb-6 border-2 border-dashed border-[var(--accent)] bg-[var(--accent-light)]/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-[var(--text-primary)]">Get Started with AIRLOD</h2>
            <p className="text-sm text-[var(--text-secondary)]">Complete these steps to make your experience better</p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <div className="progress-bar">
              {ONBOARDING_STEPS.map((step, i) => (
                <div key={i} className={`progress-segment ${step.done ? 'filled' : ''}`} />
              ))}
            </div>
            <span className="text-sm text-[var(--text-secondary)] ml-2">{completedSteps}/{ONBOARDING_STEPS.length} Complete</span>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-1">
          {ONBOARDING_STEPS.map((step, i) => (
            <div key={i} className={`onboarding-step min-w-[140px] flex-1 ${step.done ? 'completed' : ''}`}>
              <div className={`step-dot ${step.done ? 'completed' : ''}`}>
                {step.done && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className="text-xs font-medium text-[var(--text-primary)]">{step.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {state.cards.map((card, index) => {
          const cardLinks = state.links.filter(l => l.card_id === card.id);
          return (
            <div
              key={card.id}
              className="card overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              {/* Cover Image */}
              <div
                className="h-28 relative"
                style={{
                  background: `linear-gradient(135deg, ${card.theme_color || '#00b4d8'}, ${card.theme_color || '#00b4d8'}88)`,
                }}
              >
                {/* Avatar */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                  <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center border-4 border-white">
                    {card.photo_url ? (
                      <img src={card.photo_url} alt={card.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-lg font-bold" style={{ color: card.theme_color || 'var(--accent)' }}>
                        {card.name ? getInitials(card.name) : <Wifi className="w-6 h-6" />}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Info */}
              <div className="pt-10 pb-5 px-5 text-center">
                <h3 className="font-semibold text-[var(--text-primary)]">
                  {card.name || card.title || 'New Card'}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                  {card.description || `${cardLinks.length} links`}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-center gap-2 mt-4">
                  <button
                    onClick={() => handleEditCard(card)}
                    className="btn-secondary flex items-center gap-1.5 !py-2 !px-4 !text-sm"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit Card
                  </button>
                  <button
                    onClick={() => handleShareCard(card)}
                    className="btn-dark flex items-center gap-1.5 !py-2 !px-4 !text-sm"
                  >
                    <Share2 className="w-3.5 h-3.5" /> Share Card
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Create New Card */}
        <div
          className="dashed-card min-h-[260px] cursor-pointer"
          onClick={handleCreateCard}
        >
          <div className="w-14 h-14 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center">
            <Plus className="w-6 h-6 text-[var(--text-muted)]" />
          </div>
          <p className="font-semibold text-[var(--text-primary)]">Create New Card</p>
        </div>
      </div>
    </div>
  );
}
