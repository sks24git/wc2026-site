import Link from 'next/link';
import { matches } from '@/data/matches';
import { formatDay } from '@/lib/calc';

export const metadata = { title: 'Матчи · ЧМ-26' };

export default function MatchesPage() {
  const sorted = [...matches].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <div>
      <h1>Матчи</h1>
      {sorted.length === 0 ? <p className="empty">Карточек пока нет</p> : (
        sorted.map((m) => (
          <Link key={m.id} className="fixture" href={'/matches/' + m.id + '/'}>
            <div className="fixture-top">
              <span className="fixture-stage">{m.stage}</span>
              <span className="fixture-time num">{formatDay(m.date)} · {m.timeMsk}</span>
            </div>
            <div className="fixture-title">{m.flags} {m.title}</div>
            {m.result ? (
              <div className="fixture-result num">{m.result}</div>
            ) : (
              <div className="fixture-venue">{m.venue}</div>
            )}
          </Link>
        ))
      )}
    </div>
  );
}
