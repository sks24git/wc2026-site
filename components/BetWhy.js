'use client';
import { L } from '@/lib/i18n';
import { useLang, useT } from '@/app/providers';

// Исходный прогноз ставки: почему взяли и что ждали. Показывается всегда,
// если у ставки есть поле why {ru,en}.
export default function BetWhy({ bet }) {
  const lang = useLang();
  const T = useT();
  if (!bet.why) return null;
  return (
    <div className="vt-why-wrap">
      <span className="vt-why-label">{T('bets.why')}</span>
      <p className="vt-why">{L(bet.why, lang)}</p>
    </div>
  );
}
