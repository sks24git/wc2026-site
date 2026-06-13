import { bets } from '@/lib/content';
import { pl, money, fmtOdds, stakeOf, rubFmt, STATUS_LABELS, TIERS } from '@/lib/calc';

export const metadata = { title: 'Lab · варианты' };

const TIER_FILL = { green: 3, yellow: 2, red: 1 };
const TIER_COLOR = { green: '#22a559', yellow: '#eab308', red: '#e0473a' };
const cb = bets.filter((b) => b.matchId === 'canada-bosnia');
const pasha = cb.filter((b) => b.side === 'Паша');
const ai = cb.filter((b) => b.side === 'AI');

/* ── Вариант A: цвет = результат, тир = полоски риска ── */
function TicketA({ bet }) {
  const settled = bet.status === 'win' || bet.status === 'lose';
  const p = pl(bet);
  const fill = TIER_FILL[bet.tier];
  return (
    <article className={'la ' + bet.status}>
      <span className="la-meter" title={TIERS[bet.tier].label} aria-hidden="true">
        {[0, 1, 2].map((i) => <i key={i} className={i < fill ? 'on' : ''} />)}
      </span>
      <div className="la-body">
        <div className="la-top">
          <span className="la-bet">{bet.bet}</span>
          <span className="la-odds num">{fmtOdds(bet.odds)}</span>
        </div>
        <div className="la-bot">
          <span className="la-sub">{rubFmt(stakeOf(bet))}{bet.contest ? ' · конкурс' : ''} · {STATUS_LABELS[bet.status]}</span>
          <span className={'la-pl num ' + (settled ? (p > 0 ? 'pos' : 'neg') : 'idle')}>
            {bet.status === 'pending' ? 'в игре' : money(p)}
          </span>
        </div>
      </div>
    </article>
  );
}

/* ── Вариант B: цвет = тир (светофор), результат = иконка ✓/✗, P/L нейтральный ── */
function TicketB({ bet }) {
  const p = pl(bet);
  const ic = bet.status === 'win' ? '✓' : bet.status === 'lose' ? '✗' : bet.status === 'void' ? '↩' : '⏳';
  return (
    <article className={'lb ' + bet.status}>
      <span className="tdot" style={{ background: TIER_COLOR[bet.tier] }} aria-hidden="true" />
      <div className="la-body">
        <div className="la-top">
          <span className="la-bet">{bet.bet}</span>
          <span className="la-odds num">{fmtOdds(bet.odds)}</span>
        </div>
        <div className="la-bot">
          <span className="la-sub">{rubFmt(stakeOf(bet))}{bet.contest ? ' · конкурс' : ''}</span>
          <span className="lb-res">
            <span className={'lb-ic ' + bet.status}>{ic}</span>
            <span className="lb-pl num">{bet.status === 'pending' ? 'в игре' : money(p).replace('−', '−').replace('+', '+')}</span>
          </span>
        </div>
      </div>
    </article>
  );
}

/* ── Вариант C: тир = кружок, результат = левая полоса + цвет P/L ── */
function TicketC({ bet }) {
  const settled = bet.status === 'win' || bet.status === 'lose';
  const p = pl(bet);
  return (
    <article className={'lc ' + bet.status}>
      <span className="tdot" style={{ background: TIER_COLOR[bet.tier] }} aria-hidden="true" />
      <div className="la-body">
        <div className="la-top">
          <span className="la-bet">{bet.bet}</span>
          <span className="la-odds num">{fmtOdds(bet.odds)}</span>
        </div>
        <div className="la-bot">
          <span className="la-sub">{rubFmt(stakeOf(bet))}{bet.contest ? ' · конкурс' : ''} · {STATUS_LABELS[bet.status]}</span>
          <span className={'la-pl num ' + (settled ? (p > 0 ? 'pos' : 'neg') : 'idle')}>
            {bet.status === 'pending' ? 'в игре' : money(p)}
          </span>
        </div>
      </div>
    </article>
  );
}

function Cols({ T }) {
  return (
    <div className="lab-cols">
      <div className="lab-col">
        <div className="lab-col-head pasha">Паша</div>
        {pasha.map((b) => <T key={b.id} bet={b} />)}
      </div>
      <div className="lab-col">
        <div className="lab-col-head ai">AI</div>
        {ai.map((b) => <T key={b.id} bet={b} />)}
      </div>
    </div>
  );
}

export default function LabPage() {
  return (
    <div className="lab">
      <h1>Варианты цветовой системы</h1>
      <p className="lab-note">Один и тот же матч (Канада 1:1 Босния). Выбери, какой вариант делаем везде.</p>

      <div className="sect"><span className="sect-label">Вариант A — цвет = результат, надёжность = полоски</span></div>
      <p className="lab-hint">Полоски <b>▮▮▮ / ▮▮▯ / ▮▯▯</b> (нейтральные) = тир. Зелёный/красный = только результат. Самый чистый.</p>
      <Cols T={TicketA} />

      <div className="sect"><span className="sect-label">Вариант B — цвет = тир (светофор), результат = ✓/✗</span></div>
      <p className="lab-hint">Кружок 🟢🟡🔴 = тир (как сейчас). Результат — иконкой ✓/✗ и знаком ±, деньги нейтральным.</p>
      <Cols T={TicketB} />

      <div className="sect"><span className="sect-label">Вариант C — тир = кружок + полоса результата слева</span></div>
      <p className="lab-hint">Кружок = тир, цветная полоса слева + цвет P/L = результат. Два цвета в строке.</p>
      <Cols T={TicketC} />
    </div>
  );
}
