import { TIERS, TIER_ORDER, rubFmt } from '@/lib/calc';
import TierIcon from '@/components/TierIcon';

export default function Legend() {
  return (
    <div className="legend" aria-label="Система Светофор">
      {TIER_ORDER.map((k) => {
        const t = TIERS[k];
        return (
          <div key={k} className="legend-row">
            <TierIcon tier={k} />
            <span className="legend-sum num">{rubFmt(t.sum)}</span>
            <span className="legend-note">кф {t.odds} · {t.note}</span>
          </div>
        );
      })}
      <p className="legend-cap">Иконка = надёжность (🛡 щит · ⚡ риск · 🔥 лотерея). Цвет суммы — результат. Лимит на матч: до 7 500 ₽ в прематче, до 10 000 ₽ с лайвом.</p>
    </div>
  );
}
