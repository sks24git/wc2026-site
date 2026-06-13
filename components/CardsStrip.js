'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { buildCards, currentIndex, STATUS_LABEL } from '@/lib/cards';
import { money, formatDay } from '@/lib/calc';

export default function CardsStrip() {
  const cards = buildCards();
  const cur = currentIndex(cards);
  const ref = useRef(null);

  // прокрутить к текущей карте по центру
  useEffect(() => {
    const el = ref.current?.querySelector('[data-cur="1"]');
    if (el) el.scrollIntoView({ inline: 'center', block: 'nearest' });
  }, []);

  return (
    <div className="strip" ref={ref}>
      {cards.map((c, n) => {
        const cls = c.side === 'AI' ? 'ai' : 'pasha';
        const plClass = c.status === 'soon' ? '' : c.pl > 0 ? 'pos' : c.pl < 0 ? 'neg' : '';
        return (
          <Link key={c.key} data-cur={n === cur ? '1' : undefined} className={'minicard ' + cls + ' st-' + c.status} href={'/cards/#' + c.key}>
            <div className="mc-top">
              <span className={'mc-av ' + cls} aria-hidden="true">{c.side === 'AI' ? 'AI' : 'П'}</span>
              <span className="mc-date">{formatDay(c.date)}</span>
            </div>
            <div className={'mc-pl num ' + plClass}>{c.status === 'soon' ? money(0).replace('0 ₽', '—') : money(c.pl)}</div>
            <div className="mc-meta">
              <span className={'mc-st ' + c.status}>{STATUS_LABEL[c.status]}</span>
              {' · '}{c.status === 'done' ? `${c.wins}/${c.settled}` : `${c.pending} ст.`}
            </div>
          </Link>
        );
      })}
      <Link className="minicard more" href="/cards/"><span className="mc-more">Все →</span></Link>
    </div>
  );
}
