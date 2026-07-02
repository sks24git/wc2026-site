'use client';
import { bets } from '@/lib/content';
import { aggregate, money, rubFmt } from '@/lib/calc';
import { sideLabel } from '@/lib/i18n';
import { useLang, useT } from '@/app/providers';

// «Счёт дуэли» — компакт-версия героя главной для внутренних страниц:
// узкая вклеенная полоска с плашками сторон, балансами моно-цифрами
// и рукописной дельтой лидера по центру. Большая витрина — только на главной.
export default function ScoreStrip() {
  const lang = useLang();
  const t = useT();
  const pasha = aggregate(bets.filter((b) => b.side === 'Паша'));
  const ai = aggregate(bets.filter((b) => b.side === 'AI'));
  const leaderSide = pasha.bal === ai.bal ? null : pasha.bal > ai.bal ? 'Паша' : 'AI';
  const gap = Math.abs(pasha.bal - ai.bal);
  const val = (v) => (
    <span className={'sl-val num ' + (v > 0 ? 'pos' : v < 0 ? 'neg' : '')}>{money(v, lang)}</span>
  );
  return (
    <section className="scoreline" aria-label={t('a11y.battle')}>
      <span className="sl-side">
        <span className="sl-plate pasha">{sideLabel('Паша', lang)}</span>
        {val(pasha.bal)}
      </span>
      <span className="sl-gap" aria-hidden="true">
        {leaderSide
          ? `${sideLabel(leaderSide, lang)} ${t('battle.aheadMid')} ${rubFmt(gap, lang)}`
          : t('battle.even')}
      </span>
      <span className="sl-side">
        {val(ai.bal)}
        <span className="sl-plate ai">{sideLabel('AI', lang)}</span>
      </span>
    </section>
  );
}
