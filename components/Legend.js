import { TIERS, TIER_ORDER, rubFmt } from '@/lib/calc';

export default function Legend() {
  return (
    <div className="legend" aria-label="Система Светофор">
      {TIER_ORDER.map((k) => {
        const t = TIERS[k];
        return (
          <div key={k} className="legend-row">
            <span className={'tdot tier-' + k} aria-hidden="true" />
            <span className="legend-sum num">{rubFmt(t.sum)}</span>
            <span className="legend-note">кф {t.odds} · {t.note}</span>
          </div>
        );
      })}
      <p className="legend-cap">Лимит на матч: до 7 500 ₽ в прематче, до 10 000 ₽ с лайвом.</p>
    </div>
  );
}
