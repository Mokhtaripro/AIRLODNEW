'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Wifi, GripVertical, Trash2, Plus, Eye, Save } from 'lucide-react';
import { useApp } from '@/lib/store';
import { THEME_COLORS, LINK_META } from '@/types';
import { getInitials } from '@/lib/utils';
import type { Card, CardLink, LinkType } from '@/types';
import LinkStoreModal from '@/components/editor/LinkStoreModal';

function EditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state, dispatch } = useApp();
  const [showLinkStore, setShowLinkStore] = useState(false);
  const [editingLink, setEditingLink] = useState<string | null>(null);

  const cardId = searchParams.get('id');
  const card = state.cards.find(c => c.id === cardId) || state.currentCard;

  const cardLinks = state.links.filter(l => l.card_id === card?.id)
    .sort((a, b) => a.order_index - b.order_index);

  const [form, setForm] = useState({
    title: '',
    name: '',
    description: '',
    bio: '',
    phone: '',
    email: '',
    address: '',
    theme_color: '#00b4d8',
    color_link_icons: false,
  });

  useEffect(() => {
    if (card) {
      setForm({
        title: card.title || '',
        name: card.name || '',
        description: card.description || '',
        bio: card.bio || '',
        phone: card.phone || '',
        email: card.email || '',
        address: card.address || '',
        theme_color: card.theme_color || '#00b4d8',
        color_link_icons: card.color_link_icons || false,
      });
    }
  }, [card]);

  const updateForm = (field: string, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!card) return;
    const updatedCard: Card = {
      ...card,
      ...form,
      updated_at: new Date().toISOString(),
    };
    dispatch({ type: 'UPDATE_CARD', payload: updatedCard });
    router.push('/dashboard/cards');
  };

  const handlePreview = () => {
    if (card) window.open(`/${card.code}`, '_blank');
  };

  const handleAddLink = (type: LinkType) => {
    if (!card) return;
    const meta = LINK_META[type];
    const newLink: CardLink = {
      id: crypto.randomUUID(),
      card_id: card.id,
      type,
      label: meta?.label || type,
      value: '',
      order_index: cardLinks.length,
      is_active: true,
      created_at: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_LINK', payload: newLink });
    setShowLinkStore(false);
    setEditingLink(newLink.id);
  };

  const handleUpdateLink = (linkId: string, value: string) => {
    const link = state.links.find(l => l.id === linkId);
    if (link) dispatch({ type: 'UPDATE_LINK', payload: { ...link, value } });
  };

  const handleToggleLink = (linkId: string) => {
    const link = state.links.find(l => l.id === linkId);
    if (link) dispatch({ type: 'UPDATE_LINK', payload: { ...link, is_active: !link.is_active } });
  };

  const handleDeleteLink = (linkId: string) => {
    dispatch({ type: 'DELETE_LINK', payload: linkId });
  };

  if (!card) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-[var(--text-muted)]">Card not found</p>
      </div>
    );
  }

  return (
    <div className="p-4 pt-5 md:p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/dashboard/cards')} className="btn-ghost !p-2">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold hidden md:block">Edit Card</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handlePreview} className="btn-secondary !text-sm">
            <Eye className="w-4 h-4" /> <span className="hidden md:inline">Preview</span>
          </button>
          <button onClick={handleSave} className="btn-primary !text-sm">
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Form */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* Basic Info */}
          <div className="card-flat p-5">
            <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Card Information</h2>
            <div className="space-y-3">
              <input type="text" value={form.title} onChange={e => updateForm('title', e.target.value)} placeholder="Card Title" className="input" />
              <input type="text" value={form.name} onChange={e => updateForm('name', e.target.value)} placeholder="Full Name" className="input" />
              <input type="text" value={form.description} onChange={e => updateForm('description', e.target.value)} placeholder="Job title / Description" className="input" />
              <textarea value={form.bio} onChange={e => updateForm('bio', e.target.value)} placeholder="Bio" rows={3} className="input resize-none" />
            </div>
          </div>

          {/* Contact */}
          <div className="card-flat p-5">
            <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Contact Details</h2>
            <div className="space-y-3">
              <input type="tel" value={form.phone} onChange={e => updateForm('phone', e.target.value)} placeholder="Phone" className="input" />
              <input type="email" value={form.email} onChange={e => updateForm('email', e.target.value)} placeholder="Email" className="input" />
              <input type="text" value={form.address} onChange={e => updateForm('address', e.target.value)} placeholder="Address" className="input" />
            </div>
          </div>

          {/* Theme */}
          <div className="card-flat p-5">
            <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Profile Theme</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {THEME_COLORS.map(color => (
                <button
                  key={color}
                  className={`color-dot ${form.theme_color === color ? 'selected' : ''}`}
                  style={{
                    backgroundColor: color,
                    border: color === '#FFFFFF' ? '2px solid var(--border)' : undefined,
                  }}
                  onClick={() => updateForm('theme_color', color)}
                />
              ))}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--text-secondary)]">Color Link Icons</span>
              <button
                className={`toggle ${form.color_link_icons ? 'active' : ''}`}
                onClick={() => updateForm('color_link_icons', !form.color_link_icons)}
              />
            </div>
          </div>
        </div>

        {/* Right: Preview + Links */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* Live Preview (desktop) */}
          <div className="hidden lg:block card overflow-hidden">
            <div
              className="h-20 relative"
              style={{ background: `linear-gradient(135deg, ${form.theme_color}, ${form.theme_color}88)` }}
            >
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
                <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center border-3 border-white">
                  <span className="text-sm font-bold" style={{ color: form.theme_color }}>
                    {form.name ? getInitials(form.name) : '?'}
                  </span>
                </div>
              </div>
            </div>
            <div className="pt-8 pb-4 px-4 text-center">
              <p className="font-semibold text-sm">{form.name || 'Your Name'}</p>
              <p className="text-xs text-[var(--text-muted)]">{form.description || 'Your description'}</p>
              <p className="text-[10px] text-[var(--text-muted)] mt-2">
                {cardLinks.filter(l => l.is_active).length} active links
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="card-flat p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">Links ({cardLinks.length})</h2>
              <button onClick={() => setShowLinkStore(true)} className="btn-primary !text-xs !py-1.5 !px-3">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            <div className="space-y-2">
              {cardLinks.map(link => {
                const meta = LINK_META[link.type];
                return (
                  <div key={link.id} className="link-item">
                    <GripVertical className="w-4 h-4 text-[var(--text-muted)] cursor-grab" />
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: form.color_link_icons ? (meta?.color || '#666') + '15' : 'var(--bg-tertiary)' }}
                    >
                      <span className="text-xs font-medium" style={{ color: form.color_link_icons ? meta?.color : 'var(--text-secondary)' }}>
                        {meta?.label?.charAt(0) || '?'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      {editingLink === link.id ? (
                        <input
                          type="text"
                          value={link.value}
                          onChange={e => handleUpdateLink(link.id, e.target.value)}
                          onBlur={() => setEditingLink(null)}
                          onKeyDown={e => e.key === 'Enter' && setEditingLink(null)}
                          placeholder={`Enter ${meta?.label || 'value'}...`}
                          className="bg-transparent border-none outline-none text-sm w-full"
                          autoFocus
                        />
                      ) : (
                        <span className="text-sm truncate block text-[var(--text-primary)]">
                          {link.value || meta?.label || link.type}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setEditingLink(editingLink === link.id ? null : link.id)}
                      className="text-[var(--accent)] text-xs font-medium hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      className={`toggle ${link.is_active ? 'active' : ''}`}
                      onClick={() => handleToggleLink(link.id)}
                      style={{ transform: 'scale(0.75)' }}
                    />
                    <button
                      onClick={() => handleDeleteLink(link.id)}
                      className="text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            {cardLinks.length === 0 && (
              <div className="text-center py-8">
                <p className="text-sm text-[var(--text-muted)] mb-3">No links added yet</p>
                <button onClick={() => setShowLinkStore(true)} className="btn-secondary !text-sm">
                  <Plus className="w-4 h-4" /> Add Content
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showLinkStore && (
        <LinkStoreModal
          onClose={() => setShowLinkStore(false)}
          onSelectLink={handleAddLink}
          existingTypes={cardLinks.map(l => l.type)}
        />
      )}
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <EditorContent />
    </Suspense>
  );
}
