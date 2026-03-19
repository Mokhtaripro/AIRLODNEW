'use client';

import { useState } from 'react';
import { QrCode, Camera, Wifi } from 'lucide-react';

export default function ScanPage() {
  const [scanning, setScanning] = useState(false);

  return (
    <div className="p-4 pt-5 md:p-8 animate-fade-in">
      <h1 className="text-xl md:text-2xl font-bold mb-6">Scan</h1>

      <div className="flex flex-col md:flex-row gap-5 max-w-3xl mx-auto">
        {/* Scanner */}
        <div className="card p-6 md:p-8 flex-1 flex flex-col items-center">
          <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl border-2 border-dashed border-[var(--accent)] flex items-center justify-center mb-4 relative bg-[var(--accent-light)]/30">
            {scanning ? (
              <div className="w-full h-1 bg-[var(--accent)] absolute top-0 animate-pulse rounded" />
            ) : (
              <QrCode className="w-14 h-14 text-[var(--text-muted)]" />
            )}
          </div>
          <p className="text-sm text-[var(--text-secondary)] text-center mb-5">
            Scan a QR code to view a digital business card
          </p>
          <button
            onClick={() => setScanning(!scanning)}
            className="btn-dark flex items-center gap-2"
          >
            <Camera className="w-4 h-4" />
            {scanning ? 'Stop Scanning' : 'Start Camera'}
          </button>
        </div>

        {/* NFC */}
        <div className="card p-6 md:p-8 flex-1 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[var(--accent-light)] flex items-center justify-center mb-4">
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
