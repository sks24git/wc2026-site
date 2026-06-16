import { matches } from '@/lib/content';
import { bets } from '@/lib/content';
import { sideTally } from '@/lib/calc';
import MatchesView from '@/components/MatchesView';
import Heading from '@/components/Heading';

export const metadata = { title: 'Матчи · ЧМ-26' };

export default function MatchesPage() {
  // только сериализуемые поля для клиентского компонента (двуязычные поля идут как {ru,en})
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
      <Heading tkey="matches.title" />
      <MatchesView matches={slim} />
    </div>
  );
}
