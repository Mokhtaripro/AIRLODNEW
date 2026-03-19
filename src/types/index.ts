export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Card {
  id: string;
  user_id: string;
  code: string; // unique code for NFC/URL e.g. app.airlod.com/CODE
  title: string;
  name: string;
  description?: string;
  bio?: string;
  phone?: string;
  email?: string;
  address?: string;
  photo_url?: string;
  theme_color: string;
  color_link_icons: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CardLink {
  id: string;
  card_id: string;
  type: LinkType;
  label: string;
  value: string;
  icon?: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

export type LinkType =
  | 'phone' | 'email' | 'website' | 'address'
  | 'instagram' | 'facebook' | 'linkedin' | 'tiktok' | 'twitter' | 'snapchat' | 'youtube' | 'whatsapp'
  | 'google_reviews' | 'business_phone'
  | 'video' | 'image' | 'file'
  | 'contacts' | 'custom';

export interface CardView {
  id: string;
  card_id: string;
  viewer_ip?: string;
  viewer_user_agent?: string;
  created_at: string;
}

export interface LinkTap {
  id: string;
  link_id: string;
  card_id: string;
  created_at: string;
}

export interface Contact {
  id: string;
  user_id: string;
  card_id?: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  notes?: string;
  created_at: string;
}

export interface InsightData {
  totalLods: number;
  linkTaps: number;
  newConnections: number;
  tapThroughRate: number;
  worldRanking: number;
  popStreak: number;
  dailyData: { date: string; views: number; taps: number }[];
  linkEngagement: { link: CardLink; taps: number }[];
}

export const LINK_CATEGORIES = {
  recommended: ['phone', 'email', 'instagram', 'website', 'linkedin', 'contacts'],
  contact_info: ['phone', 'email', 'contacts'],
  social_media: ['instagram', 'facebook', 'linkedin', 'tiktok', 'twitter', 'snapchat', 'youtube'],
  for_business: ['website', 'google_reviews', 'business_phone'],
  content: ['video', 'image', 'file'],
} as const;

export const LINK_META: Record<string, { label: string; icon: string; color: string }> = {
  phone: { label: 'Number', icon: 'Phone', color: '#25D366' },
  email: { label: 'Email', icon: 'Mail', color: '#4A90D9' },
  website: { label: 'Website', icon: 'Globe', color: '#6C5CE7' },
  address: { label: 'Address', icon: 'MapPin', color: '#E17055' },
  instagram: { label: 'Instagram', icon: 'Instagram', color: '#E4405F' },
  facebook: { label: 'Facebook', icon: 'Facebook', color: '#1877F2' },
  linkedin: { label: 'LinkedIn', icon: 'Linkedin', color: '#0A66C2' },
  tiktok: { label: 'TikTok', icon: 'Music', color: '#000000' },
  twitter: { label: 'X / Twitter', icon: 'Twitter', color: '#1DA1F2' },
  snapchat: { label: 'Snapchat', icon: 'Camera', color: '#FFFC00' },
  youtube: { label: 'YouTube', icon: 'Youtube', color: '#FF0000' },
  whatsapp: { label: 'WhatsApp', icon: 'MessageCircle', color: '#25D366' },
  google_reviews: { label: 'Reviews', icon: 'Star', color: '#FBBC05' },
  business_phone: { label: 'Business Number', icon: 'Phone', color: '#34A853' },
  video: { label: 'Video', icon: 'Video', color: '#6C5CE7' },
  image: { label: 'Image', icon: 'Image', color: '#00B894' },
  file: { label: 'File', icon: 'FileText', color: '#636E72' },
  contacts: { label: 'Contacts', icon: 'Users', color: '#00CEC9' },
  custom: { label: 'Custom Link', icon: 'Link', color: '#2D3436' },
};

export const THEME_COLORS = [
  '#FFFFFF', '#000000', '#8B5CF6', '#EC4899', '#EF4444', '#F97316', '#EAB308', '#22C55E', '#06B6D4', '#3B82F6', '#6366F1',
];
