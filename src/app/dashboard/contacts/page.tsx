'use client';

import { useState } from 'react';
import { Search, UserPlus, Download, Mail, Phone } from 'lucide-react';
import { DEMO_CONTACTS } from '@/lib/mock-data';
import { getInitials, timeAgo } from '@/lib/utils';
import type { Contact } from '@/types';

export default function ContactsPage() {
  const [contacts] = useState<Contact[]>(DEMO_CONTACTS);
  const [search, setSearch] = useState('');

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.company?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 pt-5 md:p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-xl md:text-2xl font-bold">Contacts</h1>
          <span className="badge">({filtered.length})</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary !text-sm hidden md:flex">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="btn-dark !text-sm">
            <UserPlus className="w-4 h-4" /> Create Lead
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 border border-[var(--border)] rounded-[var(--radius-sm)] px-3 py-2.5 bg-white mb-5 max-w-full">
        <Search className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search name, email or company"
          className="bg-transparent border-none outline-none text-sm w-full text-[var(--text-primary)]"
        />
      </div>

      {/* Table (desktop) */}
      <div className="card-flat overflow-hidden hidden md:block">
        {/* Header */}
        <div className="table-header" style={{ gridTemplateColumns: '40px 1fr 200px 120px 120px' }}>
          <div>
            <input type="checkbox" className="w-4 h-4 rounded" />
          </div>
          <div>Contact</div>
          <div>Company</div>
          <div>Date</div>
          <div>Actions</div>
        </div>

        {/* Rows */}
        {filtered.map((contact) => (
          <div
            key={contact.id}
            className="table-row"
            style={{ gridTemplateColumns: '40px 1fr 200px 120px 120px' }}
          >
            <div>
              <input type="checkbox" className="w-4 h-4 rounded" />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--accent-light)] flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-[var(--accent)]">
                  {getInitials(contact.name)}
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-medium text-sm text-[var(--text-primary)]">{contact.name}</p>
                <p className="text-xs text-[var(--text-muted)] truncate">{contact.email || ''}</p>
              </div>
            </div>
            <div className="text-sm text-[var(--text-secondary)]">{contact.company || '—'}</div>
            <div className="text-sm text-[var(--text-muted)]">{timeAgo(contact.created_at)}</div>
            <div className="flex items-center gap-2">
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="btn-ghost !p-1.5">
                  <Mail className="w-4 h-4" />
                </a>
              )}
              {contact.phone && (
                <a href={`tel:${contact.phone}`} className="btn-ghost !p-1.5">
                  <Phone className="w-4 h-4" />
                </a>
              )}
              <button className="btn-ghost !p-1.5">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-[var(--text-muted)] text-sm">
            No contacts found
          </div>
        )}
      </div>

      {/* Mobile list */}
      <div className="space-y-2 md:hidden">
        {filtered.map((contact) => (
          <div key={contact.id} className="card-flat p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--accent-light)] flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-[var(--accent)]">
                  {getInitials(contact.name)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{contact.name}</p>
                <p className="text-xs text-[var(--text-muted)] truncate">{contact.email || contact.company || ''}</p>
              </div>
              <span className="text-xs text-[var(--text-muted)]">{timeAgo(contact.created_at)}</span>
            </div>
            <div className="flex gap-2 mt-3 ml-[52px]">
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="btn-secondary !p-2 !text-xs">
                  <Mail className="w-3.5 h-3.5" />
                </a>
              )}
              {contact.phone && (
                <a href={`tel:${contact.phone}`} className="btn-secondary !p-2 !text-xs">
                  <Phone className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
