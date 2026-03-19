import { notFound } from 'next/navigation';
import PublicCardView from '@/components/public/PublicCardView';
import { DEMO_CARDS, DEMO_LINKS } from '@/lib/mock-data';

interface Props {
  params: Promise<{ code: string }>;
}

export default async function PublicCardPage({ params }: Props) {
  const { code } = await params;

  // In production, fetch from Supabase
  // const { data: card } = await supabase.from('cards').select('*').eq('code', code).eq('is_active', true).single();

  // Demo mode: check demo cards
  const card = DEMO_CARDS.find(c => c.code === code);

  if (!card) {
    // Show a generic "card not found" for unknown codes
    return <PublicCardView card={null} links={[]} code={code} />;
  }

  const links = DEMO_LINKS.filter(l => l.card_id === card.id && l.is_active);

  return <PublicCardView card={card} links={links} code={code} />;
}

export async function generateMetadata({ params }: Props) {
  const { code } = await params;
  const card = DEMO_CARDS.find(c => c.code === code);

  return {
    title: card ? `${card.name} - AIRLOD` : 'AIRLOD - Digital Business Card',
    description: card?.description || 'Digital business card powered by AIRLOD',
    openGraph: {
      title: card?.name || 'AIRLOD',
      description: card?.description || 'Digital business card powered by AIRLOD',
    },
  };
}
