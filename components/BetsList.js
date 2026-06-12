'use client';
import { useState } from 'react';
import { bets } from '@/data/bets';
import { pl, fmt, formatDay } from '@/lib/calc';
import Ticket from '@/components/Ticket';

const FILTERS = [
  { key: 'all', label: 'Все' },
  { key: 'pasha', label: 'Паша' },
  { key: 'ai', label: 'AI' },
  { key: 'contest', label: 'Конкурс ЛС' },
  { key: 'pending', label: 'В игре' },
];

function matchFilter(b, f) {
  if (f === 'pasha') return b.side === 'Паша';
  if (f === 'ai') return b.side === 'AI';
  if (f === 'contest') return Boolean(b.contest);
  if (f === 'pending') return b.status === 'pending';
  return true;
}

export default function BetsList() {
  const [filter, setFilter] = useState('all');
  const filtered = bets.filter((b) => matchFilter(b, filter));

  const byDay = {};
  for (const b of filtered) {
    (byDay[b.date] = byDay[b.date] || []).push(b);
  }
  const days = Object.keys(byDay).sort().reverse();

  return (
    <div>
      <div className="chips" role="group" aria-label="Фильтр ставок">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            className={'chip' + (filter === f.key ? ' on' : '')}
            aria-pressed={filter === f.key}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {days.length === 0 && <p className="empty">По этому фильтру ставок нет</p>}
      {days.map((d) => {
        const list = byDay[d];
        const settled = list.filter((b) => b.status !== 'pending' && b.status !== 'void');
        const dayPl = list.reduce((s, b) => s + pl(b), 0);
        return (
          <section key={d} className="day-group" aria-label={formatDay(d)}>
            <div className="day-head">
              <span className="day-title">{formatDay(d)}</span>
              <span className="leader" aria-hidden="true" />
              <span className={'day-pl ' + (settled.length === 0 ? '' : dayPl > 0 ? 'pos' : dayPl < 0 ? 'neg' : '')}>
                {settled.length === 0 ? 'в игре' : fmt(dayPl) + ' ед'}
              </span>
            </div>
            {list.map((b) => <Ticket key={b.id} bet={b} />)}
          </section>
        );
      })}
    </div>
  );
}
