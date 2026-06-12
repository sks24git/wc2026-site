import { bets } from '@/lib/content';
import { aggregate, money, rubFmt } from '@/lib/calc';

function pct(x) {
  return x === null ? '—' : (x > 0 ? '+' : '') + x.toFixed(0) + '%';
}

export default function BattleBoard() {
  const pasha = aggregate(bets.filter((b) => b.side === 'Паша'));
  const ai = aggregate(bets.filter((b) => b.side === 'AI'));
  const leader = pasha.bal === ai.bal ? null : pasha.bal > ai.bal ? 'Паша' : 'AI';
  const gap = Math.abs(pasha.bal - ai.bal);

  const Side = ({ name, agg, cls }) => (
    <div className={'b-side ' + cls}>
      <div className="b-name">{name}</div>
      <div className={'b-bal ' + (agg.bal > 0 ? 'pos' : agg.bal < 0 ? 'neg' : '')}>{money(agg.bal)}</div>
      <div className="b-sub">
        банк <span className="num">{rubFmt(agg.bank)}</span>
      </div>
      <div className="b-sub2">
        ROI <span className="num">{pct(agg.roi)}</span> · <span className="num">{agg.wins}/{agg.settled}</span>
        {agg.pending > 0 && <> · в игре <span className="num">{agg.pending}</span></>}
      </div>
    </div>
  );

  return (
    <section aria-label="Батл Паша против AI">
      <div className="battle">
        <Side name="Паша" agg={pasha} cls="pasha" />
        <div className="b-vs">vs</div>
        <Side name="AI" agg={ai} cls="ai" />
      </div>
      <div className="b-lead">
        {leader ? (
          <><span className="crown" aria-hidden="true">👑</span><strong>{leader}</strong> впереди на <strong>{money(gap)}</strong></>
        ) : (
          <>Счёт равный — всё решат ближайшие матчи</>
        )}
        <span className="b-bank0"> · старт у каждого 100 000 ₽</span>
      </div>
    </section>
  );
}
