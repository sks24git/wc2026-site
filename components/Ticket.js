import { pl, money, fmtOdds, stakeOf, rubFmt, STATUS_LABELS, TIERS } from '@/lib/calc';
import { hintFor } from '@/lib/glossary';

export default function Ticket({ bet }) {
  const settled = bet.status === 'win' || bet.status === 'lose';
  const p = pl(bet);
  const tier = TIERS[bet.tier];
  return (
    <article className={'ticket ' + bet.status}>
      <span className={'tdot tier-' + bet.tier} aria-hidden="true" title={tier ? tier.label + ' · ' + rubFmt(tier.sum) : ''} />
      <div style={{ minWidth: 0 }}>
        <div className="ticket-match">{bet.match}</div>
        <div className="ticket-bet" title={hintFor(bet)}>{bet.bet}</div>
        <div className="ticket-meta">
          <span className={bet.side === 'Паша' ? 'pasha' : 'ai'}>{bet.side}</span>
          {bet.contest && <span className="contest">Конкурс</span>}
          <span className="num">{rubFmt(stakeOf(bet))}</span>
          <span>{STATUS_LABELS[bet.status]}</span>
        </div>
      </div>
      <div className="ticket-right">
        <div className="ticket-odds num">{fmtOdds(bet.odds)}</div>
        <div className={'ticket-pl num ' + (settled ? (p > 0 ? 'pos' : 'neg') : 'idle')}>
          {bet.status === 'pending' ? '—' : bet.status === 'void' ? '0 ₽' : money(p)}
        </div>
      </div>
    </article>
  );
}
