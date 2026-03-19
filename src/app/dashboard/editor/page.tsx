'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Wifi, GripVertical, Pencil, Trash2, Plus } from 'lucide-react';
import { useApp } from '@/lib/store';
import { THEME_COLORS, LINK_META } from '@/types';
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
    theme_color: '#000000',
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
        theme_color: card.theme_color || '#000000',
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
    if (card) {
      window.open(`/${card.code}`, '_blank');
    }
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
    if (link) {
      dispatch({ type: 'UPDATE_LINK', payload: { ...link, value } });
    }
  };

  const handleToggleLink = (linkId: string) => {
    const link = state.links.find(l => l.id === linkId);
    if (link) {
      dispatch({ type: 'UPDATE_LINK', payload: { ...link, is_active: !link.is_active } });
    }
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
    <div className="p-4 pt-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push('/dashboard/cards')}
          className="glass-button !p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Wifi className="w-5 h-5 text-[var(--text-secondary)]" />
          <span className="text-sm text-[var(--text-secondary)]">
            {cardLinks.filter(l => l.is_active).length} Links
          </span>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-3 mb-6">
        <input
          type="text"
          value={form.title}
          onChange={e => updateForm('title', e.target.value)}
          placeholder="Set Card Title"
          className="glass-input text-lg font-medium"
        />
        <input
          type="text"
          value={form.name}
          onChange={e => updateForm('name', e.target.value)}
          placeholder="Name"
          className="glass-input"
        />
        <input
          type="text"
          value={form.description}
          onChange={e => updateForm('description', e.target.value)}
          placeholder="Description"
          className="glass-input"
        />
        <textarea
          value={form.bio}
          onChange={e => updateForm('bio', e.target.value)}
          placeholder="Bio"
          rows={3}
          className="glass-input resize-none"
        />
      </div>

      {/* Contact Fields */}
      <div className="space-y-3 mb-6">
        <input
          type="tel"
          value={form.phone}
          onChange={e => updateForm('phone', e.target.value)}
          placeholder="Phone"
          className="glass-input"
        />
        <input
          type="email"
          value={form.email}
          onChange={e => updateForm('email', e.target.value)}
          placeholder="E-mail"
          className="glass-input"
        />
        <input
          type="text"
          value={form.address}
          onChange={e => updateForm('address', e.target.value)}
          placeholder="Address"
          className="glass-input"
        />
      </div>

      {/* Profile Themes */}
      <div className="glass-card p-4 mb-4">
        <h3 className="text-sm font-medium mb-3">Profile Themes</h3>
        <div className="flex flex-wrap gap-2">
          {THEME_COLORS.map(color => (
            <button
              key={color}
              className={`color-dot ${form.theme_color === color ? 'selected' : ''}`}
              style={{
                backgroundColor: color,
                border: color === '#FFFFFF' ? '2px solid var(--border-glass-strong)' : undefined,
              }}
              onClick={() => updateForm('theme_color', color)}
            />
          ))}
        </div>
      </div>

      {/* Color Link Icons Toggle */}
      <div className="glass-card p-4 mb-6 flex items-center justify-between">
        <span className="text-sm">Color Link Icons</span>
        <button
          className={`toggle ${form.color_link_icons ? 'active' : ''}`}
          onClick={() => updateForm('color_link_icons', !form.color_link_icons)}
        />
      </div>

      {/* Links */}
      <div className="space-y-2 mb-4">
        {cardLinks.map(link => {
          const meta = LINK_META[link.type];
          return (
            <div key={link.id} className="link-item">
              <GripVertical className="w-4 h-4 text-[var(--text-muted)] cursor-grab" />
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: form.color_link_icons ? (meta?.color || '#666') + '20' : 'var(--bg-glass-strong)' }}
              >
                <span className="text-xs" style={{ color: form.color_link_icons ? meta?.color : 'var(--text-secondary)' }}>
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
                  <span className="text-sm truncate block">
                    {link.value || meta?.label || link.type}
                  </span>
                )}
              </div>
              <button
                onClick={() => setEditingLink(editingLink === link.id ? null : link.id)}
                className="text-[var(--text-muted)] hover:text-white transition-colors text-xs"
              >
                Edit
              </button>
              <button
                className={`toggle ${link.is_active ? 'active' : ''}`}
                onClick={() => handleToggleLink(link.id)}
                style={{ transform: 'scale(0.8)' }}
              />
              <button
                onClick={() => handleDeleteLink(link.id)}
                className="text-[var(--text-muted)] hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Add Content CTA */}
      <div className="glass-card p-4 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/20 flex items-center justify-center">
            <Plus className="w-4 h-4 text-[var(--accent)]" />
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            Add Contact info, links, &amp; more to your digital business card
          </p>
        </div>
        <button
          onClick={() => setShowLinkStore(true)}
          className="btn-dark w-full !py-3"
        >
          Add Content
        </button>
      </div>

      {/* Bottom Actions */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setShowLinkStore(true)}
          className="glass-button flex-1 !py-3"
        >
          Add Content
        </button>
        <button
          onClick={handlePreview}
          className="glass-button flex-1 !py-3"
        >
          Preview Card
        </button>
      </div>

      <button
        onClick={handleSave}
        className="btn-primary w-full !py-3.5 text-base"
      >
        Save
      </button>

      {/* Link Store Modal */}
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
