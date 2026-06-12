import Link from 'next/link';
import { matches } from '@/data/matches';
import { formatDay } from '@/lib/calc';
import Flags from '@/components/Flags';

export const metadata = { title: 'Матчи · ЧМ-26' };

function FixtureCard({ m }) {
  return (
    <Link className="fixture" href={'/matches/' + m.id + '/'}>
      <div className="fixture-meta">{m.stage} · {formatDay(m.date)} · {m.timeMsk}{' '}МСК</div>
      <div className="fixture-head">
        <Flags cc={m.cc} />
        <span className="fixture-title">{m.title}</span>
        {m.result && <span className="fixture-score num">{m.result}</span>}
      </div>
      {m.lede && <p className="fixture-lede">{m.lede}</p>}
      {!m.result && <div className="fixture-venue">{m.venue}</div>}
    </Link>
  );
}

export default function MatchesPage() {
  const sorted = [...matches].sort((a, b) =>
    (b.date + b.timeMsk).localeCompare(a.date + a.timeMsk)
  );
  const upcoming = sorted.filter((m) => !m.result);
  const played = sorted.filter((m) => m.result);

  return (
    <div>
      <h1>Матчи</h1>

      <div className="sect"><span className="sect-label">Афиша</span></div>
      <section aria-label="Афиша">
        {upcoming.length === 0 ? <p className="empty">Все матчи сыграны</p> : upcoming.map((m) => <FixtureCard key={m.id} m={m} />)}
      </section>

      <div className="sect"><span className="sect-label">Результаты</span></div>
      <section aria-label="Результаты">
        {played.length === 0 ? <p className="empty">Ещё нет сыгранных матчей</p> : played.map((m) => <FixtureCard key={m.id} m={m} />)}
      </section>
    </div>
  );
}
