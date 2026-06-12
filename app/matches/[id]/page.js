import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { matches, getMatch } from '@/data/matches';
import { bets } from '@/data/bets';
import { formatDay } from '@/lib/calc';
import Ticket from '@/components/Ticket';

export function generateStaticParams() {
  return matches.map((m) => ({ id: m.id }));
}

export function generateMetadata({ params }) {
  const m = getMatch(params.id);
  return { title: (m ? m.title : 'Матч') + ' · ЧМ-26' };
}

export default function MatchPage({ params }) {
  const m = getMatch(params.id);
  if (!m) return null; // при static export несуществующий id отдаёт 404 от хостинга
  const linked = bets.filter((b) => b.matchId === m.id);

  return (
    <div>
      <Link className="back-link" href="/matches/">← Все матчи</Link>
      <div className="kicker">{m.stage} · {formatDay(m.date)} · {m.timeMsk}{' '}МСК</div>
      <h1>{m.flags} {m.title}</h1>
      {m.result && <p className="fixture-result num" style={{ marginBottom: 12 }}>Итог: {m.result}</p>}
      <p className="fixture-venue" style={{ marginBottom: 16 }}>{m.venue}</p>

      {linked.length > 0 && (
        <section aria-label="Ставки на матч" style={{ marginBottom: 18 }}>
          <div className="kicker">Наши ставки на матч</div>
          {linked.map((b) => <Ticket key={b.id} bet={b} />)}
        </section>
      )}

      <article className="panel md">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.analysis}</ReactMarkdown>
      </article>
    </div>
  );
}
