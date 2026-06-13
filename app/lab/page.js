import { bets } from '@/lib/content';
import { pl, money, fmtOdds, stakeOf, rubFmt, STATUS_LABELS, TIERS } from '@/lib/calc';

export const metadata = { title: 'Lab · варианты' };

const TIER_FILL = { green: 3, yellow: 2, red: 1 };
const TIER_COLOR = { green: '#22a559', yellow: '#eab308', red: '#e0473a' };
const cb = bets.filter((b) => b.matchId === 'canada-bosnia');
const pasha = cb.filter((b) => b.side === 'Паша');
const ai = cb.filter((b) => b.side === 'AI');

/* единый правый блок результата — выровнен по вертикали, с возвратом */
function ResultRight({ bet }) {
  const st = bet.status;
  const p = pl(bet);
  const ic = st === 'win' ? '✓' : st === 'lose' ? '✗' : st === 'void' ? '↩' : '·';
  const txt = st === 'pending' ? 'в игре' : st === 'void' ? 'возврат' : money(p);
  return (
    <span className="res">
      <span className={'res-ic ' + st} aria-hidden="true">{ic}</span>
      <span className={'res-sum num ' + st}>{txt}</span>
    </span>
  );
}

function Row({ indicator, bet }) {
  return (
    <article className={'lr ' + bet.status}>
      {indicator}
      <div className="lr-body">
        <div className="lr-top">
          <span className="lr-bet">{bet.bet}</span>
          <span className="lr-odds num">{fmtOdds(bet.odds)}</span>
        </div>
        <div className="lr-bot">
          <span className="lr-sub">{rubFmt(stakeOf(bet))}{bet.contest ? ' · конкурс' : ''}</span>
          <ResultRight bet={bet} />
        </div>
      </div>
    </article>
  );
}

/* D: антенка цветами светофора */
function Antenna({ tier }) {
  const fill = TIER_FILL[tier], col = TIER_COLOR[tier];
  return (
    <span className="ind-ant" title={TIERS[tier].label} aria-hidden="true">
      {[0, 1, 2].map((i) => <i key={i} style={i < fill ? { background: col } : undefined} />)}
    </span>
  );
}

/* E: своя иконка под каждый тир (щит / молния / огонь) — Lucide, единый оптический размер */
const TIER_ICON = {
  green: <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />,
  yellow: <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />,
  red: <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z" />,
};
function TierIcon({ tier }) {
  const col = TIER_COLOR[tier];
  return (
    <span className="ind-icon" title={TIERS[tier].label} aria-hidden="true">
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke={col} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{TIER_ICON[tier]}</svg>
    </span>
  );
}

function Cols({ indicator }) {
  return (
    <div className="lab-cols">
      <div className="lab-col">
        <div className="lab-col-head pasha">Паша</div>
        {pasha.map((b) => <Row key={b.id} bet={b} indicator={indicator(b)} />)}
      </div>
      <div className="lab-col">
        <div className="lab-col-head ai">AI</div>
        {ai.map((b) => <Row key={b.id} bet={b} indicator={indicator(b)} />)}
      </div>
    </div>
  );
}

export default function LabPage() {
  return (
    <div className="lab">
      <h1>Финал: индикатор надёжности + результат</h1>
      <p className="lab-note">Канада 1:1 Босния. Правый блок результата (✓/✗/↩ + сумма) одинаковый, выровнен. Сравни индикатор тира слева.</p>

      <div className="sect"><span className="sect-label">Вариант D — антенка цветами светофора</span></div>
      <p className="lab-hint">Сигнал-бары 🟢🟡🔴, высота = надёжность (3/2/1). Форма + цвет.</p>
      <Cols indicator={(b) => <Antenna tier={b.tier} />} />

      <div className="sect"><span className="sect-label">Вариант E — своя иконка под тир (щит / молния / огонь)</span></div>
      <p className="lab-hint">🛡 щит = надёжная · ⚡ молния = средний риск · 🔥 огонь = лотерея. Цвет иконки — светофор.</p>
      <Cols indicator={(b) => <TierIcon tier={b.tier} />} />
    </div>
  );
}
