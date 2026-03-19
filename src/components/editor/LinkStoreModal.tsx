'use client';

import { useState } from 'react';
import { X, Search, Phone, Mail, Instagram, Globe, Linkedin, Users, Facebook, Music, Twitter, Camera, Youtube, MessageCircle, Star, Video, Image, FileText, Link } from 'lucide-react';
import { LINK_CATEGORIES, LINK_META } from '@/types';
import type { LinkType } from '@/types';

const ICON_MAP: Record<string, React.ElementType> = {
  Phone, Mail, Instagram, Globe, Linkedin, Users, Facebook, Music, Twitter,
  Camera, Youtube, MessageCircle, Star, Video, Image, FileText, Link,
};

interface LinkStoreModalProps {
  onClose: () => void;
  onSelectLink: (type: LinkType) => void;
  existingTypes: string[];
}

export default function LinkStoreModal({ onClose, onSelectLink, existingTypes }: LinkStoreModalProps) {
  const [search, setSearch] = useState('');

  const filterLinks = (types: readonly string[]) => {
    return types.filter(type => {
      const meta = LINK_META[type];
      if (!meta) return false;
      if (search && !meta.label.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  };

  const renderLinkButton = (type: string) => {
    const meta = LINK_META[type];
    if (!meta) return null;
    const IconComponent = ICON_MAP[meta.icon] || Link;
    const isAdded = existingTypes.includes(type);

    return (
      <button
        key={type}
        onClick={() => onSelectLink(type as LinkType)}
        className="link-item !p-3 w-full"
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: meta.color + '20' }}
        >
          <IconComponent className="w-4.5 h-4.5" style={{ color: meta.color }} />
        </div>
        <span className="text-sm flex-1 text-left">{meta.label}</span>
        {isAdded ? (
          <span className="text-[var(--accent)] text-sm">✓</span>
        ) : (
          <span className="text-[var(--text-muted)] text-lg">+</span>
        )}
      </button>
    );
  };

  const categories = [
    { key: 'recommended', label: 'Recommended', horizontal: true },
    { key: 'contact_info', label: 'Contact info', horizontal: false },
    { key: 'social_media', label: 'Social media', horizontal: false },
    { key: 'for_business', label: 'For Business', horizontal: false },
    { key: 'content', label: 'Content', horizontal: false },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-[430px] max-h-[85vh] glass-strong rounded-t-3xl animate-slide-up overflow-hidden">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-[var(--border-glass-strong)]" />
        </div>

        {/* Header */}
        <div className="px-5 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Link Store</h2>
            <p className="text-xs text-[var(--text-muted)]">Add info to your card</p>
          </div>
          <button onClick={onClose} className="glass-button !p-2 !rounded-full">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="See all links"
              className="glass-input !pl-10 !text-sm"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="overflow-y-auto px-5 pb-8" style={{ maxHeight: 'calc(85vh - 160px)' }}>
          {categories.map(cat => {
            const types = filterLinks(LINK_CATEGORIES[cat.key as keyof typeof LINK_CATEGORIES]);
            if (types.length === 0) return null;

            return (
              <div key={cat.key} className="mb-5">
                <h3 className="text-sm font-semibold mb-3">{cat.label}</h3>
                {cat.horizontal ? (
                  <div className="grid grid-cols-2 gap-2">
                    {types.map(type => {
                      const meta = LINK_META[type];
                      const IconComponent = ICON_MAP[meta?.icon || 'Link'] || Link;
                      return (
                        <button
                          key={type}
                          onClick={() => onSelectLink(type as LinkType)}
                          className="glass-card !rounded-xl p-3 flex items-center gap-2 hover:!bg-[var(--bg-glass-hover)]"
                        >
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: meta.color + '20' }}
                          >
                            <IconComponent className="w-4 h-4" style={{ color: meta.color }} />
                          </div>
                          <span className="text-sm">{meta.label}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {types.map(renderLinkButton)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
