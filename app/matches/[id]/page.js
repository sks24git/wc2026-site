import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { matches, getMatch, betsForMatch } from '@/lib/content';
import { readAnalysis } from '@/lib/analysis';
import { formatDay, sideTally, money } from '@/lib/calc';
import VsTicket from '@/components/VsTicket';
import Flags from '@/components/Flags';

function ColPL({ t }) {
  if (!t || t.n === 0) return null;
  if (t.pendingN && !t.anySettled) return <span className="vs-col-pl num idle">в игре</span>;
  const cls = t.pl > 0 ? 'pos' : t.pl < 0 ? 'neg' : '';
  return <span className={'vs-col-pl num ' + cls}>{money(t.pl)}</span>;
}

function BetColumn({ side, list, past }) {
  return (
    <div className={'vs-col ' + (side === 'Паша' ? 'pasha' : 'ai')}>
      <div className="vs-col-head">
        <span className="vs-col-who">{side}</span>
        <ColPL t={sideTally(list)} />
      </div>
      {list.length === 0 ? (
        <div className="vs-col-empty">
          <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 22h14M5 2h14M6 2v5a6 6 0 0 0 12 0V2M6 22v-5a6 6 0 0 1 12 0v5" />
          </svg>
          <span>{past ? 'без прогноза' : 'ждём ставку'}</span>
        </div>
      ) : list.map((b) => <VsTicket key={b.id} bet={b} />)}
    </div>
  );
}

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
  const linked = betsForMatch(m.id);
  const analysis = readAnalysis(m.id);

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
          <div className="sect"><span className="sect-label">Ставки на матч · Паша vs AI</span></div>
          <section className="vs-card" aria-label="Ставки на матч">
            <div className="vs-cols">
              <BetColumn side="Паша" list={linked.filter((b) => b.side === 'Паша')} past={!!m.result} />
              <BetColumn side="AI" list={linked.filter((b) => b.side === 'AI')} past={!!m.result} />
            </div>
          </section>
        </>
      )}

      {analysis && (
        <>
          <div className="sect"><span className="sect-label">Разбор</span></div>
          <article className="md">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{analysis}</ReactMarkdown>
          </article>
        </>
      )}

      <Link className="back-link" href="/matches/">← Все матчи</Link>
    </div>
  );
}
