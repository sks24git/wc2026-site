'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Flags from '@/components/Flags';
import SideTally from '@/components/SideTally';
import { formatDay } from '@/lib/calc';

const WINDOW = 24 * 3600 * 1000; // 24 часа

function startMs(m) {
  const [Y, M, D] = m.date.split('-').map(Number);
  const [h, mn] = m.timeMsk.split(':').map(Number);
  return Date.UTC(Y, M - 1, D, h - 3, mn); // timeMsk (МСК = UTC+3) → UTC
}
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

function Fixture({ m, live }) {
  return (
    <Link className="fixture" href={'/matches/' + m.id + '/'}>
      <div className="fixture-meta">
        {m.stage} · {formatDay(m.date)} · {live ? <span className="hot">{m.timeMsk} МСК</span> : m.timeMsk + ' МСК'}
      </div>
      <div className="fixture-head">
        <Flags cc={m.cc} />
        <span className="fixture-title">{m.title}</span>
        {m.result && <span className="fixture-score num">{m.result}</span>}
      </div>
      {m.lede && <p className="fixture-lede">{m.lede}</p>}
      {!m.result && <div className="fixture-venue">{m.venue}</div>}
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
          <div className="sect"><span className="sect-label">Скоро · ближайшие 24 ч</span></div>
          <section aria-label="Ближайшие матчи">
            {soon.map((m) => <Fixture key={m.id} m={m} live />)}
          </section>
        </>
      )}

      {recent.length > 0 && (
        <>
          <div className="sect"><span className="sect-label">Недавние · последние 24 ч</span></div>
          <section aria-label="Недавние матчи">
            {recent.map((m) => <Fixture key={m.id} m={m} />)}
          </section>
        </>
      )}

      {soon.length === 0 && recent.length === 0 && (
        <p className="empty">В ближайшие сутки матчей нет — смотри афишу ниже</p>
      )}

      {later.length > 0 && (
        <details className="disclosure">
          <summary>
            Дальше в афише <span className="count">{later.length}</span>
            <Chevron />
          </summary>
          <section aria-label="Будущие матчи">
            {later.map((m) => <Fixture key={m.id} m={m} />)}
          </section>
        </details>
      )}

      {older.length > 0 && (
        <details className="disclosure">
          <summary>
            Прошедшие матчи <span className="count">{older.length}</span>
            <Chevron />
          </summary>
          <section aria-label="Сыгранные матчи">
            {older.map((m) => <Fixture key={m.id} m={m} />)}
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
