'use client';

import { useState } from 'react';
import { X, Search, Phone, Mail, Instagram, Globe, Linkedin, Users, Facebook, Music, Twitter, Camera, Youtube, MessageCircle, Star, Video, Image, FileText, Link } from 'lucide-react';
import { LINK_CATEGORIES, LINK_META } from '@/types';
import type { LinkType } from '@/types';

const ICONS: Record<string, React.ElementType> = {
  Phone, Mail, Instagram, Globe, Linkedin, Users, Facebook, Music, Twitter,
  Camera, Youtube, MessageCircle, Star, Video, Image, FileText, Link,
};

interface Props {
  onClose: () => void;
  onSelectLink: (type: LinkType) => void;
  existingTypes: string[];
}

export default function LinkStoreModal({ onClose, onSelectLink, existingTypes }: Props) {
  const [search, setSearch] = useState('');

  const filter = (types: readonly string[]) =>
    types.filter(t => {
      const m = LINK_META[t];
      return m && (!search || m.label.toLowerCase().includes(search.toLowerCase()));
    });

  const cats = [
    { key: 'recommended', label: 'Recommended', grid: true },
    { key: 'contact_info', label: 'Contact' },
    { key: 'social_media', label: 'Social' },
    { key: 'for_business', label: 'Business' },
    { key: 'content', label: 'Content' },
  ] as const;

  const renderItem = (type: string) => {
    const m = LINK_META[type];
    if (!m) return null;
    const Icon = ICONS[m.icon] || Link;
    const added = existingTypes.includes(type);

    return (
      <button
        key={type}
        onClick={() => onSelectLink(type as LinkType)}
        className="flex items-center gap-3 p-2.5 rounded-[var(--radius-sm)] hover:bg-[var(--bg-hover)] transition w-full"
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: m.color + '12' }}>
          <Icon className="w-4 h-4" style={{ color: m.color }} />
        </div>
        <span className="text-sm flex-1 text-left">{m.label}</span>
        {added ? <span className="text-xs font-medium text-[var(--accent)]">Added</span> : <span className="text-[var(--text-light)] text-lg leading-none">+</span>}
      </button>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-[460px] max-h-[85vh] md:max-h-[75vh] bg-white rounded-t-2xl md:rounded-2xl slide-up overflow-hidden shadow-xl">
        <div className="flex justify-center pt-2 pb-0 md:hidden"><div className="w-9 h-1 rounded-full bg-[var(--border)]" /></div>

        <div className="flex items-center justify-between px-5 py-3">
          <div>
            <h2 className="text-base font-semibold">Add Link</h2>
            <p className="text-[11px] text-[var(--text-muted)]">Choose what to add</p>
          </div>
          <button onClick={onClose} className="btn-ghost !p-1.5 !rounded-full"><X className="w-4 h-4" /></button>
        </div>

        <div className="px-5 mb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-light)]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="input !pl-9 !text-sm" />
          </div>
        </div>

        <div className="overflow-y-auto px-5 pb-5" style={{ maxHeight: 'calc(75vh - 130px)' }}>
          {cats.map(cat => {
            const types = filter(LINK_CATEGORIES[cat.key as keyof typeof LINK_CATEGORIES]);
            if (!types.length) return null;
            return (
              <div key={cat.key} className="mb-4">
                <p className="text-[10px] font-semibold uppercase text-[var(--text-muted)] tracking-wider mb-1.5">{cat.label}</p>
                {'grid' in cat && cat.grid ? (
                  <div className="grid grid-cols-2 gap-1.5">
                    {types.map(t => {
                      const m = LINK_META[t];
                      const Icon = ICONS[m?.icon || 'Link'] || Link;
                      return (
                        <button key={t} onClick={() => onSelectLink(t as LinkType)} className="card p-2.5 flex items-center gap-2 hover:bg-[var(--bg-hover)] transition">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: m.color + '12' }}>
                            <Icon className="w-3.5 h-3.5" style={{ color: m.color }} />
                          </div>
                          <span className="text-xs font-medium">{m.label}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div>{types.map(renderItem)}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
