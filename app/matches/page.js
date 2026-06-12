import { matches } from '@/data/matches';
import MatchesView from '@/components/MatchesView';

export const metadata = { title: 'Матчи · ЧМ-26' };

export default function MatchesPage() {
  // только сериализуемые поля для клиентского компонента (без markdown-разбора)
  const slim = matches.map((m) => ({
    id: m.id, date: m.date, timeMsk: m.timeMsk, title: m.title,
    cc: m.cc, stage: m.stage, venue: m.venue, lede: m.lede, result: m.result || null,
  }));
  return (
    <div>
      <h1>Матчи</h1>
      <MatchesView matches={slim} />
    </div>
  );
}
