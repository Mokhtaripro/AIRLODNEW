'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Share2, Download, Check } from 'lucide-react';
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
    <div className="p-4 pt-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Share</h1>

      {/* QR Code */}
      <div className="flex justify-center mb-6">
        <div className="glass-card p-6 inline-flex flex-col items-center gap-4">
          <div className="qr-container">
            <QRCodeSVG
              value={cardUrl}
              size={200}
              level="H"
              includeMargin={false}
            />
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            Scan to view card
          </p>
        </div>
      </div>

      {/* Card URL */}
      <div className="glass-card p-4 mb-4">
        <p className="text-xs text-[var(--text-muted)] mb-2">Card URL</p>
        <div className="flex items-center gap-2">
          <code className="text-sm text-[var(--accent)] flex-1 truncate">{cardUrl}</code>
          <button onClick={handleCopy} className="glass-button !p-2">
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Share Actions */}
      <div className="space-y-3">
        <button onClick={handleShare} className="btn-primary w-full flex items-center justify-center gap-2">
          <Share2 className="w-4 h-4" /> Share Card
        </button>
        <button onClick={handleCopy} className="glass-button w-full flex items-center justify-center gap-2">
          <Copy className="w-4 h-4" /> Copy Link
        </button>
        <button className="glass-button w-full flex items-center justify-center gap-2">
          <Download className="w-4 h-4" /> Download QR Code
        </button>
      </div>

      {/* NFC Info */}
      <div className="glass-card p-4 mt-6">
        <h3 className="text-sm font-semibold mb-2">NFC Products</h3>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          Connect this card to your AIRLOD NFC product. When someone taps your NFC card/tag,
          they&apos;ll be redirected to your digital business card at{' '}
          <span className="text-[var(--accent)]">{cardUrl}</span>
        </p>
      </div>
    </div>
  );
}
