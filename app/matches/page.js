import { matches } from '@/lib/content';
import { bets } from '@/lib/content';
import { sideTally } from '@/lib/calc';
import MatchesView from '@/components/MatchesView';

export const metadata = { title: 'Матчи · ЧМ-26' };

export default function MatchesPage() {
  // только сериализуемые поля для клиентского компонента (без markdown-разбора)
  const slim = matches.map((m) => {
    const linked = bets.filter((b) => b.matchId === m.id);
    const tally = linked.length
      ? { pasha: sideTally(linked.filter((b) => b.side === 'Паша')), ai: sideTally(linked.filter((b) => b.side === 'AI')) }
      : null;
    return {
      id: m.id, date: m.date, timeMsk: m.timeMsk, title: m.title,
      cc: m.cc, stage: m.stage, venue: m.venue, lede: m.lede, result: m.result || null,
      tally,
    };
  });
  return (
    <div>
      <h1>Матчи</h1>
      <MatchesView matches={slim} />
    </div>
  );
}
