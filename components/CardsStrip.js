'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { buildDays, currentDayIndex } from '@/lib/cards';
import { money, formatDay } from '@/lib/calc';
import { useLang, useT } from '@/app/providers';

// Карты дня на главной — полоса слотов альбома: сыгранные дни = вклеенные
// мини-наклейки со штампами, текущий день = пустой слот «ждём наклейку»
// с карандашными текущими суммами.
function Row({ card, who, lang, T }) {
  if (!card) {
    return (
      <span className="mrow">
        <span className={'mwho ' + who}>{who === 'ai' ? 'AI' : lang === 'en' ? 'P' : 'П'}</span>
        <span className="mval">—</span>
      </span>
    );
  }
  const plClass = card.status === 'soon' ? '' : card.pl > 0 ? 'pos' : card.pl < 0 ? 'neg' : '';
  return (
    <span className="mrow">
      <span className={'mwho ' + who}>{who === 'ai' ? 'AI' : lang === 'en' ? 'P' : 'П'}</span>
      <span className={'mval ' + plClass}>{card.status === 'soon' ? '—' : money(card.pl, lang)}</span>
      {card.status === 'done' ? (
        <>
          <span className="mcnt num">{card.wins}/{card.settled}</span>
          <span className={'stampword ' + (card.pl >= 0 ? 'hit' : 'miss')}>{T(card.pl >= 0 ? 'stamp.hit' : 'stamp.miss')}</span>
        </>
      ) : (
        <span className="mcnt num">{card.pending} {T('common.stakeShort')}</span>
      )}
    </span>
  );
}

export default function CardsStrip() {
  const lang = useLang();
  const T = useT();
  const days = buildDays();
  const curIdx = currentDayIndex(days);
  const curDate = days[curIdx]?.date;
  const ref = useRef(null);
  const [ov, setOv] = useState({ l: false, r: false });

  const refresh = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setOv({ l: el.scrollLeft > 4, r: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 });
  }, []);

  useEffect(() => {
    // Центрируем текущий день только по горизонтали внутри полосы:
    // scrollIntoView здесь нельзя — он прокручивает и страницу по вертикали,
    // из-за чего главная открывалась «съехавшей» вниз к картам дня.
    const box = ref.current;
    const el = box?.querySelector('[data-cur="1"]');
    if (box && el) {
      const b = box.getBoundingClientRect();
      const e = el.getBoundingClientRect();
      box.scrollLeft += e.left - b.left - (b.width - e.width) / 2;
    }
    refresh();
    const c = ref.current;
    c?.addEventListener('scroll', refresh, { passive: true });
    window.addEventListener('resize', refresh);
    return () => { c?.removeEventListener('scroll', refresh); window.removeEventListener('resize', refresh); };
  }, [refresh]);

  const nudge = (dir) => ref.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });

  return (
    <div className="cmp-wrap">
      {(ov.l || ov.r) && (
        <div className="cmp-bar">
          <button type="button" className="cmp-nav" disabled={!ov.l} onClick={() => nudge(-1)} aria-label={T('cards.prevDay')}>
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button type="button" className="cmp-nav" disabled={!ov.r} onClick={() => nudge(1)} aria-label={T('cards.nextDay')}>
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>
      )}

      <div className="cmp" ref={ref}>
        <div className="cmp-grid">
          {days.map((d, i) => {
            const cur = d.date === curDate;
            const live = d.pasha?.status === 'live' || d.ai?.status === 'live';
            return (
              <div key={d.date} data-cur={cur ? '1' : undefined} className={'slot' + (cur ? ' cur' : '')}>
                <span className="slot-no">
                  {T('slot.n')}{i + 1}{cur ? ' · ' + T('slot.today') : ''}
                </span>
                {cur && live ? (
                  <Link href={'/cards/#' + d.date} className="slot-cur-link">
                    <span className="slot-day">{formatDay(d.date, lang)}</span>
                    <p className="slot-note">{T('slot.waiting')}</p>
                    <p className="slot-pencil">
                      {(lang === 'en' ? 'P' : 'П')} {d.pasha ? money(d.pasha.pl, lang) : '—'}{d.pasha?.pending ? ` · ${d.pasha.pending} ${T('common.stakeShort')}` : ''}
                      <br />
                      AI {d.ai ? money(d.ai.pl, lang) : '—'}{d.ai?.pending ? ` · ${d.ai.pending} ${T('common.stakeShort')}` : ''}
                    </p>
                    <span className="ghost-no" aria-hidden="true">{i + 1}</span>
                  </Link>
                ) : (
                  <Link className="mini" href={'/cards/#' + d.date}>
                    <span className="mini-day">{formatDay(d.date, lang)}</span>
                    <Row card={d.pasha} who="pasha" lang={lang} T={T} />
                    <Row card={d.ai} who="ai" lang={lang} T={T} />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Link className="cmp-all" href="/cards/">{T('cardsStrip.all')}</Link>
    </div>
  );
}
