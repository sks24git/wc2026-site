import { fmtOdds, stakeOf, rubFmt } from '@/lib/calc';
import { hintFor } from '@/lib/glossary';
import Tip from '@/components/Tip';
import TierIcon from '@/components/TierIcon';
import Result from '@/components/Result';

// Компактный тикет для vs-колонки: без названия матча (оно в заголовке группы)
export default function VsTicket({ bet }) {
  return (
    <article className={'vt ' + bet.status}>
      <TierIcon tier={bet.tier} />
      <div className="vt-body">
        <div className="vt-top">
          <Tip className="vt-bet" hint={hintFor(bet)}>{bet.bet}</Tip>
          <span className="vt-odds num">{fmtOdds(bet.odds)}</span>
        </div>
        <div className="vt-bot">
          <span className="vt-stake">{rubFmt(stakeOf(bet))}{bet.contest ? ' · конкурс' : ''}</span>
          <Result bet={bet} />
        </div>
      </div>
    </article>
  );
}
