'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Flags from '@/components/Flags';
import SideTally from '@/components/SideTally';
import { formatDay } from '@/lib/calc';
import { L } from '@/lib/i18n';
import { kickoffInstant } from '@/lib/datetime';
import { useLang, useT, useTimeFmt } from '@/app/providers';

const WINDOW = 24 * 3600 * 1000; // 24 часа

const startMs = (m) => kickoffInstant(m.date, m.timeMsk);
const byAsc = (a, b) => startMs(a) - startMs(b);
const byDesc = (a, b) => startMs(b) - startMs(a);

function bucketize(matches, now) {
  if (now == null) {
    return {
      soon: matches.filter((m) => !m.result).sort(byAsc),
      recent: [],
      later: [],
      older: matches.filter((m) => m.result).sort(byDesc),
    };
  }
  const soon = [], recent = [], later = [], older = [];
  for (const m of matches) {
    const s = startMs(m);
    if (s >= now) (s <= now + WINDOW ? soon : later).push(m);
    else (s >= now - WINDOW ? recent : older).push(m);
  }
  soon.sort(byAsc); later.sort(byAsc); recent.sort(byDesc); older.sort(byDesc);
  return { soon, recent, later, older };
}

function Fixture({ m, live, lang, tf }) {
  const inst = kickoffInstant(m.date, m.timeMsk);
  const when = `${tf.time(inst)} ${tf.zoneShort(inst)}`;
  return (
    <Link className="fixture" href={'/matches/' + m.id + '/'}>
      <div className="fixture-meta">
        {L(m.stage, lang)} · {formatDay(m.date, lang)} · {live ? <span className="hot">{when}</span> : when}
      </div>
      <div className="fixture-head">
        <Flags cc={m.cc} />
        <span className="fixture-title">{L(m.title, lang)}</span>
        {m.result && <span className="fixture-score num">{m.result}</span>}
      </div>
      {m.lede && <p className="fixture-lede">{L(m.lede, lang)}</p>}
      {!m.result && <div className="fixture-venue">{L(m.venue, lang)}</div>}
      {m.tally && (
        <div className="fixture-tally">
          <SideTally side="Паша" t={m.tally.pasha} />
          <SideTally side="AI" t={m.tally.ai} />
        </div>
      )}
    </Link>
  );
}

export default function MatchesView({ matches }) {
  const lang = useLang();
  const T = useT();
  const tf = useTimeFmt();
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(t);
  }, []);

  const { soon, recent, later, older } = useMemo(() => bucketize(matches, now), [matches, now]);

  return (
    <div>
      {soon.length > 0 && (
        <>
          <div className="sect"><span className="sect-label">{T('matches.soon')}</span></div>
          <section aria-label={T('a11y.soonMatches')}>
            {soon.map((m) => <Fixture key={m.id} m={m} live lang={lang} tf={tf} />)}
          </section>
        </>
      )}

      {recent.length > 0 && (
        <>
          <div className="sect"><span className="sect-label">{T('matches.recent')}</span></div>
          <section aria-label={T('a11y.recentMatches')}>
            {recent.map((m) => <Fixture key={m.id} m={m} lang={lang} tf={tf} />)}
          </section>
        </>
      )}

      {soon.length === 0 && recent.length === 0 && (
        <p className="empty">{T('matches.none24')}</p>
      )}

      {later.length > 0 && (
        <details className="disclosure">
          <summary>
            {T('matches.moreAhead')} <span className="count">{later.length}</span>
            <Chevron />
          </summary>
          <section aria-label={T('a11y.futureMatches')}>
            {later.map((m) => <Fixture key={m.id} m={m} lang={lang} tf={tf} />)}
          </section>
        </details>
      )}

      {older.length > 0 && (
        <details className="disclosure">
          <summary>
            {T('matches.past')} <span className="count">{older.length}</span>
            <Chevron />
          </summary>
          <section aria-label={T('a11y.pastMatches')}>
            {older.map((m) => <Fixture key={m.id} m={m} lang={lang} tf={tf} />)}
          </section>
        </details>
      )}
    </div>
  );
}

function Chevron() {
  return (
    <svg className="chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}
