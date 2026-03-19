'use client';

import { useState } from 'react';
import { Search, UserPlus, Mail, Phone, Building2 } from 'lucide-react';
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
    <div className="p-4 pt-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Contacts</h1>
        <button className="glass-button !p-2.5">
          <UserPlus className="w-5 h-5" />
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search contacts..."
          className="glass-input !pl-10"
        />
      </div>

      {/* Contact Count */}
      <p className="text-sm text-[var(--text-muted)] mb-4">{filtered.length} contacts</p>

      {/* Contact List */}
      <div className="space-y-3">
        {filtered.map((contact, i) => (
          <div key={contact.id} className="glass-card p-4 animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[var(--accent)]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-[var(--accent)]">
                  {getInitials(contact.name)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{contact.name}</p>
                {contact.company && (
                  <p className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3 h-3" /> {contact.company}
                  </p>
                )}
              </div>
              <span className="text-xs text-[var(--text-muted)]">{timeAgo(contact.created_at)}</span>
            </div>

            <div className="flex gap-2 mt-3 pl-14">
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="glass-button !p-2 !rounded-lg">
                  <Mail className="w-3.5 h-3.5" />
                </a>
              )}
              {contact.phone && (
                <a href={`tel:${contact.phone}`} className="glass-button !p-2 !rounded-lg">
                  <Phone className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-[var(--text-muted)]">No contacts found</p>
        </div>
      )}
    </div>
  );
}
