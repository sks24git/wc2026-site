import { pl, fmt, fmtOdds, STATUS_LABELS } from '@/lib/calc';

export default function Ticket({ bet }) {
  const settled = bet.status === 'win' || bet.status === 'lose';
  const p = pl(bet);
  return (
    <article className={'ticket ' + bet.status}>
      <span className="dot" aria-hidden="true" />
      <div style={{ minWidth: 0 }}>
        <div className="ticket-match">{bet.match}</div>
        <div className="ticket-bet">{bet.bet}</div>
        <div className="ticket-meta">
          <span className={bet.book === 'Конкурс ЛС' ? 'contest' : undefined}>{bet.book}</span>
          <span>{bet.stake}{' '}ед</span>
          <span>{STATUS_LABELS[bet.status]}</span>
        </div>
      </div>
      <div className="ticket-right">
        <div className="ticket-odds">{fmtOdds(bet.odds)}</div>
        <div className={'ticket-pl ' + (settled ? (p > 0 ? 'pos' : 'neg') : 'idle')}>
          {bet.status === 'pending' ? '—' : bet.status === 'void' ? '0.00' : fmt(p)}
        </div>
      </div>
    </article>
  );
}
