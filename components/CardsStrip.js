'use client';
import { Fragment, useEffect, useRef } from 'react';
import Link from 'next/link';
import { buildDays, currentDayIndex, STATUS_LABEL } from '@/lib/cards';
import { money, formatDay } from '@/lib/calc';

function Cell({ card, cur }) {
  if (!card) return <div className="cmp-cell empty" aria-hidden="true">—</div>;
  const cls = card.side === 'AI' ? 'ai' : 'pasha';
  const plClass = card.status === 'soon' ? '' : card.pl > 0 ? 'pos' : card.pl < 0 ? 'neg' : '';
  return (
    <Link
      data-cur={cur ? '1' : undefined}
      className={'cmp-cell ' + cls + ' st-' + card.status + (cur ? ' cur' : '')}
      href={'/cards/#' + card.date}
    >
      <span className={'cmp-pl num ' + plClass}>{card.status === 'soon' ? '—' : money(card.pl)}</span>
      <span className="cmp-meta">
        <span className={'cmp-st ' + card.status}>{STATUS_LABEL[card.status]}</span>
        {' · '}{card.status === 'done' ? `${card.wins}/${card.settled}` : `${card.pending} ст.`}
      </span>
    </Link>
  );
}

export default function CardsStrip() {
  const days = buildDays();
  const curDate = days[currentDayIndex(days)]?.date;
  const ref = useRef(null);

  // прокрутить к текущему дню по центру
  useEffect(() => {
    const el = ref.current?.querySelector('[data-cur="1"]');
    if (el) el.scrollIntoView({ inline: 'center', block: 'nearest' });
  }, []);

  return (
    <div className="cmp-wrap">
      <div className="cmp" ref={ref}>
        <div className="cmp-grid">
          {/* липкий столбец-подпись строк */}
          <div className="cmp-lbl corner" aria-hidden="true" />
          <div className="cmp-lbl"><span className="mc-av pasha" aria-hidden="true">П</span></div>
          <div className="cmp-lbl"><span className="mc-av ai" aria-hidden="true">AI</span></div>

          {/* колонка на каждый день: дата · Паша · AI */}
          {days.map((d) => (
            <Fragment key={d.date}>
              <div className={'cmp-date' + (d.date === curDate ? ' cur' : '')}>{formatDay(d.date)}</div>
              <Cell card={d.pasha} cur={d.date === curDate} />
              <Cell card={d.ai} cur={d.date === curDate} />
            </Fragment>
          ))}
        </div>
      </div>
      <Link className="cmp-all" href="/cards/">Все карты дня по матчам →</Link>
    </div>
  );
}
