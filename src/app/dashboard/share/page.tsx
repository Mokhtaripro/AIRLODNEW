'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Share2, Download, Check, Wifi } from 'lucide-react';
import { useApp } from '@/lib/store';
import { getCardUrl } from '@/lib/utils';

export default function SharePage() {
  const { state } = useApp();
  const card = state.currentCard || state.cards[0];
  const [copied, setCopied] = useState(false);

  const cardUrl = card ? getCardUrl(card.code) : '';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(cardUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `${card?.name || 'AIRLOD'} - Digital Business Card`,
        text: 'Check out my digital business card!',
        url: cardUrl,
      });
    } else {
      handleCopy();
    }
  };

  if (!card) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-[var(--text-muted)]">Create a card first</p>
      </div>
    );
  }

  return (
    <div className="p-4 pt-5 md:p-8 animate-fade-in">
      <h1 className="text-xl md:text-2xl font-bold mb-6">Share</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* QR Code */}
        <div className="flex justify-center lg:justify-start">
          <div className="card p-6 md:p-8 inline-flex flex-col items-center gap-4">
            <div className="qr-container !shadow-none !p-0">
              <QRCodeSVG
                value={cardUrl}
                size={200}
                level="H"
                includeMargin={false}
                fgColor={card.theme_color || '#000000'}
              />
            </div>
            <p className="text-sm text-[var(--text-secondary)]">Scan to view card</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex-1 max-w-lg space-y-4">
          {/* URL */}
          <div className="card-flat p-4">
            <p className="text-xs text-[var(--text-muted)] mb-2">Card URL</p>
            <div className="flex items-center gap-2">
              <code className="text-sm text-[var(--accent)] flex-1 truncate">{cardUrl}</code>
              <button onClick={handleCopy} className="btn-secondary !p-2">
                {copied ? <Check className="w-4 h-4 text-[var(--success)]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <button onClick={handleShare} className="btn-dark w-full flex items-center justify-center gap-2 !py-3">
              <Share2 className="w-4 h-4" /> Share Card
            </button>
            <button onClick={handleCopy} className="btn-secondary w-full flex items-center justify-center gap-2 !py-3">
              <Copy className="w-4 h-4" /> Copy Link
            </button>
            <button className="btn-secondary w-full flex items-center justify-center gap-2 !py-3">
              <Download className="w-4 h-4" /> Download QR Code
            </button>
          </div>

          {/* NFC */}
          <div className="card-flat p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-light)] flex items-center justify-center flex-shrink-0">
              <Wifi className="w-5 h-5 text-[var(--accent)]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">NFC Products</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Connect this card to your AIRLOD NFC product for instant contact sharing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
