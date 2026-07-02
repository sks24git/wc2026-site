'use client';
import { useEffect, useState } from 'react';
import DayCard, { EmptyDayCard } from '@/components/DayCard';
import { formatDay } from '@/lib/calc';
import { currentDayIndex } from '@/lib/cards';
import { useLang, useT } from '@/app/providers';

export default function CardsDeck({ days }) {
  const lang = useLang();
  const T = useT();
  const [i, setI] = useState(() => currentDayIndex(days));
  const idx = Math.min(i, Math.max(0, days.length - 1));
  const day = days[idx];

  // открыть нужный день по hash (#2026-06-14) с миниатюры на главной
  useEffect(() => {
    const h = decodeURIComponent((window.location.hash || '').replace('#', '')).slice(0, 10);
    if (!h) return;
    const pos = days.findIndex((d) => d.date === h);
    if (pos >= 0) setI(pos);
  }, [days]);

  if (!day) return <p className="empty">{T('cards.none')}</p>;
  const go = (d) => setI(() => (idx + d + days.length) % days.length);
  const past = idx < currentDayIndex(days); // день раньше текущего активного → не «ждём», а «без прогноза»

  return (
    <div className="deck">
      <div className="deck-top">
        <button className="deck-arrow" aria-label={T('cards.prevDay')} onClick={() => go(-1)} disabled={days.length < 2}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <div className="deck-day">{formatDay(day.date, lang)}</div>
        <button className="deck-arrow" aria-label={T('cards.nextDay')} onClick={() => go(1)} disabled={days.length < 2}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      </div>

      <div className="deck-pair">
        {day.ai ? <DayCard card={day.ai} /> : <EmptyDayCard side="AI" past={past} />}
        {day.pasha ? <DayCard card={day.pasha} /> : <EmptyDayCard side="Паша" past={past} />}
      </div>

      <div className="deck-dots" role="tablist">
        {days.map((d, n) => (
          <button key={d.date} className={'dot' + (n === idx ? ' on' : '')} aria-label={formatDay(d.date, lang)} aria-selected={n === idx} onClick={() => setI(n)} />
        ))}
      </div>
    </div>
  );
}
