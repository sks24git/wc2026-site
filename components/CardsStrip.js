'use client';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
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
        {card.status === 'done' ? (
          <>зашло <span className="num">{card.wins}/{card.settled}</span></>
        ) : (
          <><span className={'cmp-st ' + card.status}>{STATUS_LABEL[card.status]}</span>{' · '}{card.pending} ст.</>
        )}
      </span>
    </Link>
  );
}

export default function CardsStrip() {
  const days = buildDays();
  const curDate = days[currentDayIndex(days)]?.date;
  const ref = useRef(null);
  const [ov, setOv] = useState({ l: false, r: false });

  const refresh = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setOv({ l: el.scrollLeft > 4, r: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 });
  }, []);

  useEffect(() => {
    const el = ref.current?.querySelector('[data-cur="1"]');
    if (el) el.scrollIntoView({ inline: 'center', block: 'nearest' });
    refresh();
    const c = ref.current;
    c?.addEventListener('scroll', refresh, { passive: true });
    window.addEventListener('resize', refresh);
    return () => { c?.removeEventListener('scroll', refresh); window.removeEventListener('resize', refresh); };
  }, [refresh]);

  const nudge = (dir) => ref.current?.scrollBy({ left: dir * 316, behavior: 'smooth' });

  return (
    <div className="cmp-wrap">
      {(ov.l || ov.r) && (
        <div className="cmp-bar">
          <button type="button" className="cmp-nav" disabled={!ov.l} onClick={() => nudge(-1)} aria-label="Раньше">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button type="button" className="cmp-nav" disabled={!ov.r} onClick={() => nudge(1)} aria-label="Позже">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>
      )}

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
