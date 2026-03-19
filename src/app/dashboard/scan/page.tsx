'use client';

import { useState } from 'react';
import { QrCode, Camera, Wifi } from 'lucide-react';

export default function ScanPage() {
  const [scanning, setScanning] = useState(false);

  return (
    <div className="px-4 py-5 md:px-8 md:py-7 fade-in">
      <h1 className="text-xl font-bold mb-5">Scan</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
        <div className="card p-6 flex flex-col items-center text-center">
          <div className="w-40 h-40 rounded-xl border-2 border-dashed border-[var(--accent)] bg-[var(--accent-bg)] flex items-center justify-center mb-4">
            <QrCode className="w-10 h-10 text-[var(--text-muted)]" />
          </div>
          <p className="text-sm text-[var(--text-secondary)] mb-4">Scan a QR code to view a card</p>
          <button onClick={() => setScanning(!scanning)} className="btn-solid">
            <Camera className="w-4 h-4" /> {scanning ? 'Stop' : 'Start Camera'}
          </button>
        </div>

        <div className="card p-6 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-[var(--accent-bg)] flex items-center justify-center mb-4">
            <Wifi className="w-7 h-7 text-[var(--accent)]" />
          </div>
          <h3 className="font-semibold text-sm mb-1">NFC Ready</h3>
          <p className="text-xs text-[var(--text-muted)]">Hold an NFC tag near your device</p>
        </div>
      </div>
    </div>
  );
}
