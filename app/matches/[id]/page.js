import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { matches, getMatch } from '@/data/matches';
import { bets } from '@/data/bets';
import { formatDay } from '@/lib/calc';
import Ticket from '@/components/Ticket';
import Flags from '@/components/Flags';

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
      <div className="hero" style={{ paddingTop: 20, paddingBottom: 18 }}>
        <div className="fixture-meta">{m.stage} · {formatDay(m.date)} · {m.timeMsk}{' '}МСК</div>
        <div className="fixture-head" style={{ marginTop: 6 }}>
          <Flags cc={m.cc} size={30} />
          <h1 style={{ margin: 0 }}>{m.title}</h1>
        </div>
        {m.result && <div className="fixture-result num">{m.result}</div>}
        <div className="fixture-venue">{m.venue}{m.weather ? ' · ' + m.weather : ''}</div>
      </div>

      {linked.length > 0 && (
        <>
          <div className="sect"><span className="sect-label">Ставки на матч</span></div>
          <section aria-label="Ставки на матч">
            {linked.map((b) => <Ticket key={b.id} bet={b} />)}
          </section>
        </>
      )}

      <div className="sect"><span className="sect-label">Разбор</span></div>
      <article className="md">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.analysis}</ReactMarkdown>
      </article>

      <Link className="back-link" href="/matches/">← Все матчи</Link>
    </div>
  );
}
