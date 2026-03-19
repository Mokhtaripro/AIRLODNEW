import { v4 as uuidv4 } from 'uuid';
import type { Card, CardLink, Contact, InsightData } from '@/types';

export const DEMO_USER = {
  id: 'demo-user-001',
  email: 'demo@airlod.com',
  full_name: 'John Doe',
  avatar_url: undefined,
  created_at: new Date().toISOString(),
};

export const DEMO_CARDS: Card[] = [
  {
    id: 'card-001',
    user_id: 'demo-user-001',
    code: 'johndoe',
    title: 'Personal Card',
    name: 'John Doe',
    description: 'Digital Marketing Expert',
    bio: 'Passionate about connecting people through technology. 10+ years of experience in digital marketing and brand strategy.',
    phone: '+33 6 12 34 56 78',
    email: 'john@example.com',
    address: 'Paris, France',
    photo_url: undefined,
    theme_color: '#000000',
    color_link_icons: false,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const DEMO_LINKS: CardLink[] = [
  { id: uuidv4(), card_id: 'card-001', type: 'email', label: 'Email', value: 'john@example.com', order_index: 0, is_active: true, created_at: new Date().toISOString() },
  { id: uuidv4(), card_id: 'card-001', type: 'phone', label: 'Phone', value: '+33 6 12 34 56 78', order_index: 1, is_active: true, created_at: new Date().toISOString() },
  { id: uuidv4(), card_id: 'card-001', type: 'instagram', label: 'Instagram', value: '@johndoe', order_index: 2, is_active: true, created_at: new Date().toISOString() },
  { id: uuidv4(), card_id: 'card-001', type: 'linkedin', label: 'LinkedIn', value: 'linkedin.com/in/johndoe', order_index: 3, is_active: true, created_at: new Date().toISOString() },
  { id: uuidv4(), card_id: 'card-001', type: 'website', label: 'Website', value: 'https://johndoe.com', order_index: 4, is_active: true, created_at: new Date().toISOString() },
  { id: uuidv4(), card_id: 'card-001', type: 'facebook', label: 'Facebook', value: 'facebook.com/johndoe', order_index: 5, is_active: true, created_at: new Date().toISOString() },
];

export const DEMO_CONTACTS: Contact[] = [
  { id: uuidv4(), user_id: 'demo-user-001', name: 'Marie Dupont', email: 'marie@example.com', phone: '+33 6 98 76 54 32', company: 'TechCorp', created_at: new Date().toISOString() },
  { id: uuidv4(), user_id: 'demo-user-001', name: 'Pierre Martin', email: 'pierre@example.com', company: 'StartupXYZ', created_at: new Date().toISOString() },
  { id: uuidv4(), user_id: 'demo-user-001', name: 'Sophie Bernard', phone: '+33 6 11 22 33 44', created_at: new Date().toISOString() },
];

export const DEMO_INSIGHTS: InsightData = {
  totalLods: 11,
  linkTaps: 0,
  newConnections: 11,
  tapThroughRate: 11,
  worldRanking: 17,
  popStreak: 1,
  dailyData: Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 86400000).toISOString().split('T')[0],
    views: Math.floor(Math.random() * 5),
    taps: Math.floor(Math.random() * 3),
  })),
  linkEngagement: [],
};
