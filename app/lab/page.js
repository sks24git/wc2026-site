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

/* E: своя иконка под каждый тир (щит / молния / огонь) */
const TIER_ICON = {
  green: <path d="M12 2l7 3v6c0 4.2-2.9 7.4-7 8.5-4.1-1.1-7-4.3-7-8.5V5l7-3z" />,        // щит — надёжно
  yellow: <path d="M13 2L4 13h6l-1 9 9-12h-6l1-8z" />,                                    // молния — риск повыше
  red: <path d="M12 2c1 3 4 4 4 8a4 4 0 11-8 0c0-1.5.6-2.6 1.4-3.4C9.6 7 11 6 12 2z" />,  // огонь — лотерея
};
function TierIcon({ tier }) {
  const col = TIER_COLOR[tier];
  return (
    <span className="ind-icon" title={TIERS[tier].label} aria-hidden="true">
      <svg viewBox="0 0 24 24" width="16" height="16" fill={col}>{TIER_ICON[tier]}</svg>
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
