'use client';
import { useEffect, useState } from 'react';
import DayCard, { EmptyDayCard } from '@/components/DayCard';
import { formatDay } from '@/lib/calc';
import { currentDayIndex } from '@/lib/cards';

export default function CardsDeck({ days }) {
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

  if (!day) return <p className="empty">Карт пока нет</p>;
  const go = (d) => setI((v) => (idx + d + days.length) % days.length);

  return (
    <div className="deck">
      <div className="deck-top">
        <button className="deck-arrow" aria-label="Прошлый день" onClick={() => go(-1)} disabled={days.length < 2}>‹</button>
        <div className="deck-day">{formatDay(day.date)}</div>
        <button className="deck-arrow" aria-label="Следующий день" onClick={() => go(1)} disabled={days.length < 2}>›</button>
      </div>

      <div className="deck-pair">
        {day.ai ? <DayCard card={day.ai} /> : <EmptyDayCard side="AI" />}
        {day.pasha ? <DayCard card={day.pasha} /> : <EmptyDayCard side="Паша" />}
      </div>

      <div className="deck-dots" role="tablist">
        {days.map((d, n) => (
          <button key={d.date} className={'dot' + (n === idx ? ' on' : '')} aria-label={formatDay(d.date)} aria-selected={n === idx} onClick={() => setI(n)} />
        ))}
      </div>
    </div>
  );
}
