import { buildDays } from '@/lib/cards';
import CardsDeck from '@/components/CardsDeck';
import Heading from '@/components/Heading';

export const metadata = { title: 'Карты дня · ЧМ-26' };

export default function CardsPage() {
  return (
    <div>
      <Heading tkey="cards.title" />
      <Heading tag="p" tkey="cards.sub" className="sub-note" />
      <CardsDeck days={buildDays()} />
    </div>
  );
}
