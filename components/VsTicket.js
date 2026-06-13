import { pl, money, fmtOdds, stakeOf, rubFmt, STATUS_LABELS, TIERS } from '@/lib/calc';
import { hintFor } from '@/lib/glossary';
import Tip from '@/components/Tip';

// Компактный тикет для vs-колонки: без названия матча (оно в заголовке группы)
export default function VsTicket({ bet }) {
  const settled = bet.status === 'win' || bet.status === 'lose';
  const p = pl(bet);
  const t = TIERS[bet.tier];
  return (
    <article className={'vt ' + bet.status}>
      <span className={'tdot tier-' + bet.tier} aria-hidden="true" title={t ? t.label + ' · ' + rubFmt(t.sum) : ''} />
      <div className="vt-body">
        <div className="vt-top">
          <Tip className="vt-bet" hint={hintFor(bet)}>{bet.bet}</Tip>
          <span className="vt-odds num">{fmtOdds(bet.odds)}</span>
        </div>
        <div className="vt-bot">
          <span className="vt-stake">{rubFmt(stakeOf(bet))}{bet.contest ? ' · конкурс' : ''} · {STATUS_LABELS[bet.status]}</span>
          <span className={'vt-pl num ' + (settled ? (p > 0 ? 'pos' : 'neg') : 'idle')}>
            {bet.status === 'pending' ? 'в игре' : bet.status === 'void' ? '0 ₽' : money(p)}
          </span>
        </div>
      </div>
    </article>
  );
}
