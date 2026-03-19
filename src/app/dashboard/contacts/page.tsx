'use client';

import { useState } from 'react';
import { Search, UserPlus, Download, Mail, Phone, MoreHorizontal } from 'lucide-react';
import { DEMO_CONTACTS } from '@/lib/mock-data';
import { getInitials, timeAgo } from '@/lib/utils';
import type { Contact } from '@/types';

export default function ContactsPage() {
  const [contacts] = useState<Contact[]>(DEMO_CONTACTS);
  const [search, setSearch] = useState('');

  const filtered = contacts.filter(c =>
    (c.name + (c.email || '') + (c.company || '')).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-4 py-5 md:px-8 md:py-7 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">Contacts</h1>
          <span className="badge">{filtered.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-outline !text-xs hidden md:flex"><Download className="w-3.5 h-3.5" /> Export</button>
          <button className="btn-primary !text-xs"><UserPlus className="w-3.5 h-3.5" /> Create Lead</button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-[var(--border)] rounded-[var(--radius-sm)] px-3 py-2.5 mb-4">
        <Search className="w-4 h-4 text-[var(--text-light)] flex-shrink-0" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search name, email or company"
          className="bg-transparent border-none outline-none text-sm w-full"
        />
      </div>

      {/* Desktop table */}
      <div className="card overflow-hidden hidden md:block">
        <div className="table-head" style={{ gridTemplateColumns: '1fr 180px 140px 100px' }}>
          <div>Contact</div>
          <div>Company</div>
          <div>Date</div>
          <div className="text-right">Actions</div>
        </div>
        {filtered.map(c => (
          <div key={c.id} className="table-row" style={{ gridTemplateColumns: '1fr 180px 140px 100px' }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[var(--accent-bg)] flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-[var(--accent)]">{getInitials(c.name)}</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-[var(--text)] leading-tight">{c.name}</p>
                <p className="text-[12px] text-[var(--text-muted)] truncate">{c.email || ''}</p>
              </div>
            </div>
            <div className="text-sm text-[var(--text-secondary)]">{c.company || '—'}</div>
            <div className="text-sm text-[var(--text-muted)]">{timeAgo(c.created_at)}</div>
            <div className="flex items-center justify-end gap-1">
              {c.email && <a href={`mailto:${c.email}`} className="btn-ghost !p-1.5"><Mail className="w-4 h-4" /></a>}
              {c.phone && <a href={`tel:${c.phone}`} className="btn-ghost !p-1.5"><Phone className="w-4 h-4" /></a>}
              <button className="btn-ghost !p-1.5"><MoreHorizontal className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-sm text-[var(--text-muted)] text-center py-10">No contacts found</p>}
      </div>

      {/* Mobile list */}
      <div className="space-y-2 md:hidden">
        {filtered.map(c => (
          <div key={c.id} className="card p-3.5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[var(--accent-bg)] flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-[var(--accent)]">{getInitials(c.name)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-tight">{c.name}</p>
                <p className="text-[12px] text-[var(--text-muted)] truncate">{c.email || c.company || ''}</p>
              </div>
              <span className="text-[11px] text-[var(--text-light)]">{timeAgo(c.created_at)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
