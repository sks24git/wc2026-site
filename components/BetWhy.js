'use client';
import { useState } from 'react';
import { L } from '@/lib/i18n';
import { useLang, useT } from '@/app/providers';

// Исходный прогноз ставки (клик-раскрытие): почему взяли и что ждали.
// Показывается только если у ставки есть поле why {ru,en}.
export default function BetWhy({ bet }) {
  const lang = useLang();
  const T = useT();
  const [open, setOpen] = useState(false);
  if (!bet.why) return null;
  return (
    <div className="vt-why-wrap">
      <button type="button" className={'vt-why-toggle' + (open ? ' on' : '')} aria-expanded={open} onClick={() => setOpen(!open)}>
        {T('bets.why')}
        <svg viewBox="0 0 10 6" width="9" height="6" aria-hidden="true"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      {open && <p className="vt-why">{L(bet.why, lang)}</p>}
    </div>
  );
}
