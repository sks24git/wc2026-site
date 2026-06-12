import { bets } from '@/data/bets';
import { aggregate, fmt } from '@/lib/calc';

export default function BattleBoard() {
  const pasha = aggregate(bets.filter((b) => b.side === 'Паша'));
  const ai = aggregate(bets.filter((b) => b.side === 'AI'));
  const leader = pasha.bal === ai.bal ? null : pasha.bal > ai.bal ? 'Паша' : 'AI';
  const gap = Math.abs(pasha.bal - ai.bal);

  const Side = ({ name, agg, cls }) => (
    <div className={'b-side ' + cls}>
      <div className="b-name">{name}</div>
      <div className={'b-bal ' + (agg.bal > 0 ? 'pos' : agg.bal < 0 ? 'neg' : '')}>{fmt(agg.bal)}</div>
      <div className="b-sub">
        ROI <span className="num">{agg.roi === null ? '—' : fmt(agg.roi) + '%'}</span>
        {' · '}<span className="num">{agg.wins}/{agg.settled}</span>
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
          <><span className="crown" aria-hidden="true">👑</span><strong>{leader}</strong> впереди на <strong className="num">{gap.toFixed(2)}</strong> ед (в единицах: 1 ед = базовая ставка)</>
        ) : (
          <>Счёт равный — всё решат ближайшие матчи</>
        )}
      </div>
    </section>
  );
}
