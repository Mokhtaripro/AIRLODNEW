'use client';

import { useState } from 'react';
import { QrCode, Camera, Wifi } from 'lucide-react';

export default function ScanPage() {
  const [scanning, setScanning] = useState(false);

  return (
    <div className="p-4 pt-6 md:p-8 animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Scan</h1>

      <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start justify-center max-w-3xl mx-auto">
        {/* Scanner area */}
        <div className="glass-card p-8 flex flex-col items-center w-full md:flex-1">
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-2xl border-2 border-dashed border-[var(--accent)] flex items-center justify-center mb-4 relative">
            {scanning ? (
              <div className="w-full h-1 bg-[var(--accent)] absolute top-0 animate-pulse rounded" />
            ) : (
              <QrCode className="w-16 h-16 text-[var(--text-muted)]" />
            )}
          </div>
          <p className="text-sm text-[var(--text-secondary)] text-center mb-6">
            Scan a QR code or NFC tag to view a digital business card
          </p>
          <button
            onClick={() => setScanning(!scanning)}
            className="btn-primary flex items-center gap-2"
          >
            <Camera className="w-4 h-4" />
            {scanning ? 'Stop Scanning' : 'Start Camera'}
          </button>
        </div>

        {/* NFC section */}
        <div className="glass-card p-6 w-full md:flex-1 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[var(--accent)]/10 flex items-center justify-center mb-4">
            <Wifi className="w-8 h-8 text-[var(--accent)]" />
          </div>
          <h3 className="font-semibold mb-2">NFC Ready</h3>
          <p className="text-sm text-[var(--text-secondary)] text-center">
            Hold an NFC card or tag near your device to read it
          </p>
        </div>
      </div>
    </div>
  );
}
