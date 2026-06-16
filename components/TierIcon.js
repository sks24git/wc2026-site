import { tierLabel, tierNote } from '@/lib/calc';

// Иконка надёжности (Светофор): щит / молния / огонь — Lucide, единый размер, цвет = тир.
// Серверо-безопасна (без хуков); язык тултипа приходит пропом (по умолчанию ru).
const TIER_COLOR = { green: '#22a559', yellow: '#eab308', red: '#e0473a' };
const PATHS = {
  green: 'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z',
  yellow: 'M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z',
  red: 'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z',
};

export default function TierIcon({ tier, size = 17, lang = 'ru' }) {
  const title = TIER_COLOR[tier] ? `${tierLabel(tier, lang)} · ${tierNote(tier, lang)}` : '';
  return (
    <span className="tier-ic" title={title}>
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={TIER_COLOR[tier]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={PATHS[tier]} />
      </svg>
    </span>
  );
}
