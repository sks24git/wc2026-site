'use client';
import Link from 'next/link';
import { formatDay, sideTally, money } from '@/lib/calc';
import { L, sideLabel } from '@/lib/i18n';
import { kickoffInstant } from '@/lib/datetime';
import { useLang, useT, useTimeFmt } from '@/app/providers';
import VsTicket from '@/components/VsTicket';
import Flags from '@/components/Flags';
import Analysis from '@/components/Analysis';

function ColPL({ t, T, lang }) {
  if (!t || t.n === 0) return null;
  if (t.pendingN && !t.anySettled) return <span className="vs-col-pl num idle">{T('common.inPlay')}</span>;
  const cls = t.pl > 0 ? 'pos' : t.pl < 0 ? 'neg' : '';
  return <span className={'vs-col-pl num ' + cls}>{money(t.pl, lang)}</span>;
}

function BetColumn({ side, list, past, T, lang }) {
  return (
    <div className={'vs-col ' + (side === 'Паша' ? 'pasha' : 'ai')}>
      <div className="vs-col-head">
        <span className="vs-col-who">{sideLabel(side, lang)}</span>
        <ColPL t={sideTally(list)} T={T} lang={lang} />
      </div>
      {list.length === 0 ? (
        <div className="vs-col-empty">
          <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 22h14M5 2h14M6 2v5a6 6 0 0 0 12 0V2M6 22v-5a6 6 0 0 1 12 0v5" />
          </svg>
          <span>{past ? T('bets.noPick') : T('bets.waiting')}</span>
        </div>
      ) : list.map((b) => <VsTicket key={b.id} bet={b} />)}
    </div>
  );
}

export default function MatchView({ m, linked, md }) {
  const lang = useLang();
  const T = useT();
  const tf = useTimeFmt();
  const inst = kickoffInstant(m.date, m.timeMsk);

  return (
    <div>
      <div className="hero" style={{ paddingTop: 20, paddingBottom: 18 }}>
        <div className="fixture-meta">{L(m.stage, lang)} · {formatDay(m.date, lang)} · {tf.time(inst)} {tf.zoneShort(inst)}</div>
        <div className="fixture-head" style={{ marginTop: 6 }}>
          <Flags cc={m.cc} size={30} />
          <h1 style={{ margin: 0 }}>{L(m.title, lang)}</h1>
        </div>
        {m.result && <div className="fixture-result num">{m.result}</div>}
        <div className="fixture-venue">{L(m.venue, lang)}{m.weather ? ' · ' + L(m.weather, lang) : ''}</div>
      </div>

      {linked.length > 0 && (
        <>
          <div className="sect"><span className="sect-label">{T('match.betsTitle')}</span></div>
          <section className="vs-card" aria-label={T('a11y.matchBets')}>
            <div className="vs-cols">
              <BetColumn side="Паша" list={linked.filter((b) => b.side === 'Паша')} past={!!m.result} T={T} lang={lang} />
              <BetColumn side="AI" list={linked.filter((b) => b.side === 'AI')} past={!!m.result} T={T} lang={lang} />
            </div>
          </section>
        </>
      )}

      {(md.ru || md.en) && (
        <>
          <div className="sect"><span className="sect-label">{T('match.analysis')}</span></div>
          <Analysis md={md} />
        </>
      )}

      <Link className="back-link" href="/matches/">{T('match.back')}</Link>
    </div>
  );
}
