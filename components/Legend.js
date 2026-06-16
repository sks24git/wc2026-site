'use client';
import { TIERS, TIER_ORDER, rubFmt, tierNote } from '@/lib/calc';
import { useLang, useT } from '@/app/providers';
import TierIcon from '@/components/TierIcon';

export default function Legend() {
  const lang = useLang();
  const t = useT();
  return (
    <div className="legend" aria-label={t('stats.trafficLight')}>
      {TIER_ORDER.map((k) => {
        const tier = TIERS[k];
        return (
          <div key={k} className="legend-row">
            <TierIcon tier={k} lang={lang} />
            <span className="legend-sum num">{rubFmt(tier.sum, lang)}</span>
            <span className="legend-note">{t('legend.odds')} {tier.odds} · {tierNote(k, lang)}</span>
          </div>
        );
      })}
      <p className="legend-cap">{t('legend.cap')}</p>
    </div>
  );
}
