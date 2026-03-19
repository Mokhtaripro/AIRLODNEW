'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, GripVertical, Trash2, Plus, Eye, Save } from 'lucide-react';
import { useApp } from '@/lib/store';
import { THEME_COLORS, LINK_META } from '@/types';
import { getInitials } from '@/lib/utils';
import type { Card, CardLink, LinkType } from '@/types';
import LinkStoreModal from '@/components/editor/LinkStoreModal';

function EditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state, dispatch } = useApp();
  const [showStore, setShowStore] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const cardId = searchParams.get('id');
  const card = state.cards.find(c => c.id === cardId) || state.currentCard;
  const links = state.links.filter(l => l.card_id === card?.id).sort((a, b) => a.order_index - b.order_index);

  const [f, setF] = useState({
    title: '', name: '', description: '', bio: '',
    phone: '', email: '', address: '',
    theme_color: '#1a73e8', color_link_icons: false,
  });

  useEffect(() => {
    if (card) setF({
      title: card.title || '', name: card.name || '',
      description: card.description || '', bio: card.bio || '',
      phone: card.phone || '', email: card.email || '',
      address: card.address || '',
      theme_color: card.theme_color || '#1a73e8',
      color_link_icons: card.color_link_icons || false,
    });
  }, [card]);

  const set = (k: string, v: string | boolean) => setF(p => ({ ...p, [k]: v }));

  const save = () => {
    if (!card) return;
    dispatch({ type: 'UPDATE_CARD', payload: { ...card, ...f, updated_at: new Date().toISOString() } });
    router.push('/dashboard/cards');
  };

  const addLink = (type: LinkType) => {
    if (!card) return;
    const meta = LINK_META[type];
    const link: CardLink = {
      id: crypto.randomUUID(), card_id: card.id, type,
      label: meta?.label || type, value: '',
      order_index: links.length, is_active: true,
      created_at: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_LINK', payload: link });
    setShowStore(false);
    setEditingId(link.id);
  };

  if (!card) return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-[var(--text-muted)]">Card not found</p></div>;

  return (
    <div className="px-4 py-5 md:px-8 md:py-7 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <button onClick={() => router.push('/dashboard/cards')} className="btn-ghost !p-2">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold hidden md:block">Edit Card</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => window.open(`/${card.code}`, '_blank')} className="btn-outline !text-xs">
            <Eye className="w-3.5 h-3.5" /> Preview
          </button>
          <button onClick={save} className="btn-primary !text-xs">
            <Save className="w-3.5 h-3.5" /> Save
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Form */}
        <div className="flex-1 space-y-4">
          <div className="card p-5">
            <p className="section-title">Card Information</p>
            <div className="space-y-3">
              <input value={f.title} onChange={e => set('title', e.target.value)} placeholder="Card Title" className="input" />
              <input value={f.name} onChange={e => set('name', e.target.value)} placeholder="Full Name" className="input" />
              <input value={f.description} onChange={e => set('description', e.target.value)} placeholder="Job title" className="input" />
              <textarea value={f.bio} onChange={e => set('bio', e.target.value)} placeholder="Bio" rows={3} className="input resize-none" />
            </div>
          </div>

          <div className="card p-5">
            <p className="section-title">Contact</p>
            <div className="space-y-3">
              <input value={f.phone} onChange={e => set('phone', e.target.value)} placeholder="Phone" className="input" />
              <input value={f.email} onChange={e => set('email', e.target.value)} placeholder="Email" className="input" />
              <input value={f.address} onChange={e => set('address', e.target.value)} placeholder="Address" className="input" />
            </div>
          </div>

          <div className="card p-5">
            <p className="section-title">Theme</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {THEME_COLORS.map(c => (
                <button
                  key={c}
                  className={`color-dot ${f.theme_color === c ? 'selected' : ''}`}
                  style={{ backgroundColor: c, border: c === '#FFFFFF' ? '2px solid var(--border)' : undefined }}
                  onClick={() => set('theme_color', c)}
                />
              ))}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--text-secondary)]">Color Link Icons</span>
              <button className={`toggle ${f.color_link_icons ? 'active' : ''}`} onClick={() => set('color_link_icons', !f.color_link_icons)} />
            </div>
          </div>
        </div>

        {/* Right — Preview + Links */}
        <div className="flex-1 space-y-4">
          {/* Preview */}
          <div className="hidden lg:block card overflow-hidden">
            <div className="h-16 relative" style={{ background: `linear-gradient(135deg, ${f.theme_color}, ${f.theme_color}99)` }}>
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white shadow flex items-center justify-center border-[3px] border-white">
                <span className="text-sm font-bold" style={{ color: f.theme_color }}>{f.name ? getInitials(f.name) : '?'}</span>
              </div>
            </div>
            <div className="pt-7 pb-4 px-4 text-center">
              <p className="font-semibold text-sm">{f.name || 'Your Name'}</p>
              <p className="text-[11px] text-[var(--text-muted)]">{f.description || 'Your title'}</p>
            </div>
          </div>

          {/* Links */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="section-title !mb-0">Links ({links.length})</p>
              <button onClick={() => setShowStore(true)} className="btn-primary !text-xs !py-1.5 !px-3">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
            <div className="space-y-2">
              {links.map(link => {
                const meta = LINK_META[link.type];
                return (
                  <div key={link.id} className="link-item">
                    <GripVertical className="w-4 h-4 text-[var(--text-light)] cursor-grab flex-shrink-0" />
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: (f.color_link_icons ? meta?.color || '#666' : f.theme_color) + '15' }}>
                      <span className="text-[11px] font-semibold" style={{ color: f.color_link_icons ? meta?.color : f.theme_color }}>
                        {meta?.label?.charAt(0) || '?'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      {editingId === link.id ? (
                        <input
                          value={link.value}
                          onChange={e => dispatch({ type: 'UPDATE_LINK', payload: { ...link, value: e.target.value } })}
                          onBlur={() => setEditingId(null)}
                          onKeyDown={e => e.key === 'Enter' && setEditingId(null)}
                          placeholder={`Enter ${meta?.label || 'value'}...`}
                          className="bg-transparent border-none outline-none text-sm w-full"
                          autoFocus
                        />
                      ) : (
                        <p className="text-sm truncate">{link.value || meta?.label || link.type}</p>
                      )}
                    </div>
                    <button onClick={() => setEditingId(editingId === link.id ? null : link.id)} className="text-[var(--accent)] text-xs font-medium hover:underline">Edit</button>
                    <button className={`toggle ${link.is_active ? 'active' : ''}`}
                      onClick={() => dispatch({ type: 'UPDATE_LINK', payload: { ...link, is_active: !link.is_active } })}
                      style={{ transform: 'scale(0.8)' }} />
                    <button onClick={() => dispatch({ type: 'DELETE_LINK', payload: link.id })} className="text-[var(--text-light)] hover:text-[var(--danger)] transition">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
            {links.length === 0 && (
              <div className="text-center py-8">
                <p className="text-sm text-[var(--text-muted)] mb-3">No links yet</p>
                <button onClick={() => setShowStore(true)} className="btn-outline !text-sm"><Plus className="w-4 h-4" /> Add Content</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showStore && <LinkStoreModal onClose={() => setShowStore(false)} onSelectLink={addLink} existingTypes={links.map(l => l.type)} />}
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="w-7 h-7 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" /></div>}>
      <EditorContent />
    </Suspense>
  );
}
