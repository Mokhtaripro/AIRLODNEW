'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { Plus, ChevronDown, MoreHorizontal, Wifi, Pencil, Eye } from 'lucide-react';
import { useApp } from '@/lib/store';
import { getCardUrl } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';
import { generateCardCode } from '@/lib/utils';
import type { Card } from '@/types';

export default function CardsPage() {
  const { state, dispatch } = useApp();
  const router = useRouter();
  const [showCardMenu, setShowCardMenu] = useState<string | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const currentCard = selectedCardId
    ? state.cards.find(c => c.id === selectedCardId) || state.cards[0]
    : state.cards[0];

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
      theme_color: '#000000',
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

  const handlePreviewCard = (card: Card) => {
    window.open(`/${card.code}`, '_blank');
  };

  const handleDeleteCard = (cardId: string) => {
    dispatch({ type: 'DELETE_CARD', payload: cardId });
    setShowCardMenu(null);
  };

  if (state.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 pt-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="glass-input flex items-center gap-2 !w-auto !py-2 !px-4 flex-1 mr-3">
          <span className="text-[var(--text-muted)] text-sm">
            {currentCard?.title || 'Set Card Title'}
          </span>
        </div>
        <button className="glass-button flex items-center gap-2 !py-2 !px-4 font-semibold">
          Cards <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* QR Code */}
      {currentCard && (
        <div className="flex justify-center mb-6 animate-fade-in">
          <div className="qr-container shadow-lg">
            <QRCodeSVG
              value={getCardUrl(currentCard.code)}
              size={160}
              level="H"
              includeMargin={false}
              imageSettings={{
                src: '',
                height: 24,
                width: 24,
                excavate: true,
              }}
            />
          </div>
        </div>
      )}

      {/* Card List */}
      <div className="space-y-4">
        {state.cards.map((card, index) => (
          <div
            key={card.id}
            className="glass-card p-5 animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => setSelectedCardId(card.id)}
          >
            {/* NFC Icon */}
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 rounded-full bg-[var(--bg-glass-strong)] flex items-center justify-center">
                <Wifi className="w-6 h-6 text-[var(--text-secondary)]" />
              </div>
            </div>

            <h3 className="text-center text-lg font-medium mb-4">
              {card.name || card.title || 'New Card'}
            </h3>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={(e) => { e.stopPropagation(); handleEditCard(card); }}
                className="glass-button flex items-center gap-2 !py-2 !px-5"
              >
                <Pencil className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handlePreviewCard(card); }}
                className="glass-button flex items-center gap-2 !py-2 !px-5"
              >
                <Eye className="w-3.5 h-3.5" /> Preview
              </button>
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowCardMenu(showCardMenu === card.id ? null : card.id); }}
                  className="glass-button !py-2 !px-3"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                {showCardMenu === card.id && (
                  <div className="absolute right-0 top-full mt-2 glass-strong rounded-xl p-2 min-w-[160px] z-20 animate-fade-in">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleEditCard(card); }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-[var(--bg-glass-hover)] text-sm transition-colors"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(getCardUrl(card.code)); setShowCardMenu(null); }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-[var(--bg-glass-hover)] text-sm transition-colors"
                    >
                      Copier le lien
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteCard(card.id); }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-400 text-sm transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Create New Card */}
        <div
          className="dashed-card cursor-pointer min-h-[200px]"
          onClick={handleCreateCard}
        >
          <div className="w-12 h-12 rounded-full bg-[var(--bg-glass-strong)] flex items-center justify-center">
            <Plus className="w-6 h-6 text-[var(--text-secondary)]" />
          </div>
          <p className="text-sm text-[var(--text-secondary)] text-center max-w-[200px]">
            Create another card with different information and customization
          </p>
          <button className="btn-primary !py-2.5 !px-6 text-sm">
            Create New Card
          </button>
        </div>
      </div>
    </div>
  );
}
