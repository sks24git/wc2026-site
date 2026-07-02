'use client';
import { L } from '@/lib/i18n';
import { useLang, useT } from '@/app/providers';

// Прогноз ставки: почему взяли и что ждали. Показывается всегда, если у ставки
// есть поле why {ru,en}. У несыгранной подпись «прогноз», у рассчитанной —
// «исходный прогноз» (чтобы отличать от итога в note).
export default function BetWhy({ bet }) {
  const lang = useLang();
  const T = useT();
  if (!bet.why) return null;
  return (
    <div className="vt-why-wrap">
      <span className="vt-why-label">{T(bet.status === 'pending' ? 'bets.whyPending' : 'bets.why')}</span>
      <p className="vt-why">{L(bet.why, lang)}</p>
    </div>
  );
}
