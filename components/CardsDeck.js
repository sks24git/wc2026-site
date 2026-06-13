'use client';
import { useEffect, useState } from 'react';
import DayCard from '@/components/DayCard';

const SIDES = [
  { key: 'all', label: 'Все' },
  { key: 'Паша', label: 'Паша' },
  { key: 'AI', label: 'AI' },
];

export default function CardsDeck({ cards }) {
  const [side, setSide] = useState('all');
  const [i, setI] = useState(0);

  const deck = side === 'all' ? cards : cards.filter((c) => c.side === side);
  const idx = Math.min(i, Math.max(0, deck.length - 1));
  const card = deck[idx];

  // открыть нужную карту по hash (#2026-06-14-ai), напр. с миниатюры на главной
  useEffect(() => {
    const h = decodeURIComponent((window.location.hash || '').replace('#', ''));
    if (!h) return;
    const pos = cards.findIndex((c) => c.key === h);
    if (pos >= 0) { setSide('all'); setI(pos); }
  }, [cards]);

  function go(d) {
    setI((v) => {
      const n = (idx + d + deck.length) % deck.length;
      return n;
    });
  }
  function pick(k) { setSide(k); setI(0); }

  if (!card) return <p className="empty">Карт пока нет</p>;

  return (
    <div className="deck">
      <div className="deck-top">
        <div className="seg" role="group" aria-label="Сторона">
          {SIDES.map((s) => (
            <button key={s.key} className={'seg-btn' + (side === s.key ? ' on' : '') + (s.key === 'Паша' ? ' t-pasha' : s.key === 'AI' ? ' t-ai' : '')} aria-pressed={side === s.key} onClick={() => pick(s.key)}>
              {s.label}
            </button>
          ))}
        </div>
        <div className="deck-count num">{idx + 1} / {deck.length}</div>
      </div>

      <div className="deck-stage">
        <button className="deck-arrow" aria-label="Предыдущая" onClick={() => go(-1)} disabled={deck.length < 2}>‹</button>
        <DayCard card={card} />
        <button className="deck-arrow" aria-label="Следующая" onClick={() => go(1)} disabled={deck.length < 2}>›</button>
      </div>

      <div className="deck-dots" role="tablist">
        {deck.map((c, n) => (
          <button key={c.key} className={'dot' + (n === idx ? ' on' : '')} aria-label={c.key} aria-selected={n === idx} onClick={() => setI(n)} />
        ))}
      </div>
    </div>
  );
}
