'use client';

import { Phone, Mail, Globe, MapPin, Instagram, Facebook, Linkedin, Music, Twitter, Camera, Youtube, MessageCircle, Star, Video, Image, FileText, Link, Users, Share2, UserPlus, Wifi } from 'lucide-react';
import type { Card, CardLink } from '@/types';
import { LINK_META } from '@/types';

const ICON_MAP: Record<string, React.ElementType> = {
  Phone, Mail, Instagram, Globe, Linkedin, Users, Facebook, Music, Twitter,
  Camera, Youtube, MessageCircle, Star, Video, Image, FileText, Link, MapPin,
};

interface PublicCardViewProps {
  card: Card | null;
  links: CardLink[];
  code: string;
}

export default function PublicCardView({ card, links, code }: PublicCardViewProps) {
  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center p-8">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
            <Wifi className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-xl font-semibold text-gray-800 mb-2">Card Not Found</h1>
          <p className="text-gray-500 text-sm mb-4">
            The card &quot;{code}&quot; doesn&apos;t exist or has been deactivated.
          </p>
          <a href="https://airlod.com" className="text-indigo-500 text-sm font-medium hover:underline">
            Get your own AIRLOD card →
          </a>
        </div>
      </div>
    );
  }

  const themeColor = card.theme_color || '#000000';
  const isLight = themeColor === '#FFFFFF' || themeColor === '#EAB308' || themeColor === '#FFFC00';

  const handleAddContact = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${card.name}
${card.phone ? `TEL:${card.phone}` : ''}
${card.email ? `EMAIL:${card.email}` : ''}
${card.address ? `ADR:;;${card.address}` : ''}
${card.description ? `TITLE:${card.description}` : ''}
${card.bio ? `NOTE:${card.bio}` : ''}
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${card.name || 'contact'}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `${card.name} - Digital Business Card`,
        url: window.location.href,
      });
    }
  };

  const getLinkHref = (link: CardLink): string => {
    switch (link.type) {
      case 'phone':
      case 'business_phone':
        return `tel:${link.value}`;
      case 'email':
        return `mailto:${link.value}`;
      case 'whatsapp':
        return `https://wa.me/${link.value.replace(/\D/g, '')}`;
      case 'instagram':
        return link.value.startsWith('http') ? link.value : `https://instagram.com/${link.value.replace('@', '')}`;
      case 'facebook':
        return link.value.startsWith('http') ? link.value : `https://facebook.com/${link.value}`;
      case 'linkedin':
        return link.value.startsWith('http') ? link.value : `https://linkedin.com/in/${link.value}`;
      case 'twitter':
        return link.value.startsWith('http') ? link.value : `https://twitter.com/${link.value.replace('@', '')}`;
      case 'tiktok':
        return link.value.startsWith('http') ? link.value : `https://tiktok.com/@${link.value.replace('@', '')}`;
      case 'youtube':
        return link.value.startsWith('http') ? link.value : `https://youtube.com/${link.value}`;
      case 'snapchat':
        return link.value.startsWith('http') ? link.value : `https://snapchat.com/add/${link.value}`;
      case 'website':
      case 'google_reviews':
        return link.value.startsWith('http') ? link.value : `https://${link.value}`;
      case 'address':
        return `https://maps.google.com/?q=${encodeURIComponent(link.value)}`;
      default:
        return link.value.startsWith('http') ? link.value : `https://${link.value}`;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(135deg, ${themeColor}22, ${themeColor}08, white)` }}>
      <div className="max-w-[520px] mx-auto min-h-screen">
        {/* Header / Profile Section */}
        <div
          className="pt-12 pb-8 px-6 text-center relative overflow-hidden"
          style={{ background: `linear-gradient(180deg, ${themeColor}, ${themeColor}99)` }}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-32 h-32 rounded-full border-2 border-white/30" />
            <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full border-2 border-white/20" />
          </div>

          {/* Avatar */}
          <div className="relative z-10">
            <div
              className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold shadow-lg"
              style={{
                background: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.15)',
                color: isLight ? '#333' : '#fff',
              }}
            >
              {card.photo_url ? (
                <img src={card.photo_url} alt={card.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                card.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?'
              )}
            </div>

            <h1
              className="text-2xl font-bold mb-1"
              style={{ color: isLight ? '#111' : '#fff' }}
            >
              {card.name}
            </h1>
            {card.description && (
              <p
                className="text-sm mb-2"
                style={{ color: isLight ? '#333' : 'rgba(255,255,255,0.8)' }}
              >
                {card.description}
              </p>
            )}
            {card.bio && (
              <p
                className="text-xs max-w-[300px] mx-auto leading-relaxed"
                style={{ color: isLight ? '#555' : 'rgba(255,255,255,0.6)' }}
              >
                {card.bio}
              </p>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 px-6 -mt-5 relative z-10 mb-6">
          <button
            onClick={handleAddContact}
            className="flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02]"
            style={{ background: themeColor, color: isLight ? '#111' : '#fff' }}
          >
            <UserPlus className="w-4 h-4" /> Save Contact
          </button>
          <button
            onClick={handleShare}
            className="py-3 px-5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 bg-white shadow-lg text-gray-700 transition-transform hover:scale-[1.02]"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Links */}
        <div className="px-6 pb-8 space-y-3">
          {links.map((link, i) => {
            const meta = LINK_META[link.type];
            const IconComponent = ICON_MAP[meta?.icon || 'Link'] || Link;
            const href = getLinkHref(link);

            return (
              <a
                key={link.id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: (card.color_link_icons ? meta?.color || '#666' : themeColor) + '15' }}
                >
                  <IconComponent
                    className="w-5 h-5"
                    style={{ color: card.color_link_icons ? meta?.color : themeColor }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{meta?.label || link.label}</p>
                  <p className="text-xs text-gray-400 truncate">{link.value}</p>
                </div>
              </a>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center pb-8 pt-4">
          <a
            href="https://airlod.com"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Wifi className="w-3 h-3" />
            Powered by AIRLOD
          </a>
        </div>
      </div>
    </div>
  );
}
