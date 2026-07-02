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

function EmptySlot({ past, T }) {
  return (
    <div className="vs-col-empty">
      <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 22h14M5 2h14M6 2v5a6 6 0 0 0 12 0V2M6 22v-5a6 6 0 0 1 12 0v5" />
      </svg>
      <span>{past ? T('bets.noPick') : T('bets.waiting')}</span>
    </div>
  );
}

/* Колонка «двух голосов»: Паша = купон-обрывок от руки, AI = чек терминала */
function VoiceColumn({ side, list, past, T, lang, dateStr, accentId }) {
  const pasha = side === 'Паша';
  const title = pasha
    ? (lang === 'en' ? 'PASHA’S COUPON' : 'КУПОН ПАШИ')
    : (lang === 'en' ? 'TERMINAL RECEIPT' : 'ЧЕК ТЕРМИНАЛА') + ' · ' + dateStr;
  return (
    <div className={'vs-col ' + (pasha ? 'pasha' : 'ai')}>
      <div className={'mv-voice ' + (pasha ? 'mv-scrap' : 'mv-receipt')}>
        <div className={pasha ? 'mv-scrap-head' : 'mv-rec-head'}>
          <span>{title}</span>
          <ColPL t={sideTally(list)} T={T} lang={lang} />
        </div>
        {list.length === 0
          ? <EmptySlot past={past} T={T} />
          : list.map((b) => (
            <VsTicket
              key={b.id}
              bet={b}
              accent={pasha && b.id === accentId ? (lang === 'en' ? 'sure!' : 'верю!') : undefined}
            />
          ))}
      </div>
    </div>
  );
}

export default function MatchView({ m, linked, md }) {
  const lang = useLang();
  const T = useT();
  const tf = useTimeFmt();
  const inst = kickoffInstant(m.date, m.timeMsk);
  const dateStr = m.date.slice(8, 10) + '.' + m.date.slice(5, 7);

  const pashaList = linked.filter((b) => b.side === 'Паша');
  const aiList = linked.filter((b) => b.side === 'AI');
  // рукописная пометка «верю!» — у ставки Паши с максимальным кэфом
  const accentId = pashaList.length
    ? pashaList.reduce((a, b) => (b.odds > a.odds ? b : a)).id
    : null;

  return (
    <div>
      <div className="mv-hero">
        <div className="fixture-meta">{L(m.stage, lang)} · {formatDay(m.date, lang)} · {tf.time(inst)} {tf.zoneShort(inst)}</div>
        <div className="fixture-head">
          <Flags cc={m.cc} size={30} />
          <h1>{L(m.title, lang)}</h1>
        </div>
        {m.result && <div className="mv-score num">{m.result}</div>}
        <div className="fixture-venue">{L(m.venue, lang)}{m.weather ? ' · ' + L(m.weather, lang) : ''}</div>
      </div>

      {linked.length > 0 && (
        <>
          <div className="sect"><span className="sect-label">{T('match.betsTitle')}</span></div>
          <section className="vs-card" aria-label={T('a11y.matchBets')}>
            <div className="vs-cols mv-cols">
              <VoiceColumn side="Паша" list={pashaList} past={!!m.result} T={T} lang={lang} dateStr={dateStr} accentId={accentId} />
              <VoiceColumn side="AI" list={aiList} past={!!m.result} T={T} lang={lang} dateStr={dateStr} accentId={accentId} />
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
