import { buildCards } from '@/lib/cards';
import CardsDeck from '@/components/CardsDeck';

export const metadata = { title: 'Карты дня · ЧМ-26' };

export default function CardsPage() {
  return (
    <div>
      <h1>Карты дня</h1>
      <p className="sub-note">Постер за день — листай стрелками или точками, переключай сторону. Можно скринить и кидать в чат.</p>
      <CardsDeck cards={buildCards()} />
    </div>
  );
}
