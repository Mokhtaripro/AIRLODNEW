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
  const url = card ? getCardUrl(card.code) : '';

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!card) return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-[var(--text-muted)]">Create a card first</p></div>;

  return (
    <div className="px-4 py-5 md:px-8 md:py-7 fade-in">
      <h1 className="text-xl font-bold mb-5">Share</h1>

      <div className="flex flex-col md:flex-row gap-5">
        {/* QR */}
        <div className="card p-8 flex flex-col items-center gap-4">
          <QRCodeSVG value={url} size={180} level="H" fgColor={card.theme_color || '#000'} />
          <p className="text-xs text-[var(--text-muted)]">Scan to view card</p>
        </div>

        {/* Actions */}
        <div className="flex-1 max-w-md space-y-3">
          <div className="card p-4">
            <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Card URL</p>
            <div className="flex items-center gap-2">
              <code className="text-sm text-[var(--accent)] flex-1 truncate">{url}</code>
              <button onClick={copy} className="btn-ghost !p-2">
                {copied ? <Check className="w-4 h-4 text-[var(--success)]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button onClick={async () => { if (navigator.share) await navigator.share({ title: card.name || 'AIRLOD', url }); else copy(); }}
            className="btn-solid w-full !py-3"><Share2 className="w-4 h-4" /> Share Card</button>
          <button onClick={copy} className="btn-outline w-full !py-3"><Copy className="w-4 h-4" /> Copy Link</button>
          <button className="btn-outline w-full !py-3"><Download className="w-4 h-4" /> Download QR</button>

          <div className="card p-4 flex items-start gap-3 mt-2">
            <div className="w-9 h-9 rounded-xl bg-[var(--accent-bg)] flex items-center justify-center flex-shrink-0">
              <Wifi className="w-4 h-4 text-[var(--accent)]" />
            </div>
            <div>
              <p className="text-sm font-medium mb-0.5">NFC Products</p>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">Connect to your AIRLOD NFC product for instant sharing.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
