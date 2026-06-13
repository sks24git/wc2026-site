import { buildDays } from '@/lib/cards';
import CardsDeck from '@/components/CardsDeck';

export const metadata = { title: 'Карты дня · ЧМ-26' };

export default function CardsPage() {
  return (
    <div>
      <h1>Карты дня</h1>
      <p className="sub-note">Разворот дня: AI слева, Паша справа. Листай по дням стрелками или точками — можно скринить и кидать в чат.</p>
      <CardsDeck days={buildDays()} />
    </div>
  );
}
