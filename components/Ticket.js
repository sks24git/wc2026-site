import { fmtOdds, stakeOf, rubFmt } from '@/lib/calc';
import { hintFor } from '@/lib/glossary';
import Tip from '@/components/Tip';
import TierIcon from '@/components/TierIcon';
import Result from '@/components/Result';

// Полный тикет (с названием матча) — для главной, карточки матча, одиночных лент.
export default function Ticket({ bet }) {
  return (
    <article className={'vt with-match ' + bet.status}>
      <TierIcon tier={bet.tier} />
      <div className="vt-body">
        <div className="vt-match">{bet.match}</div>
        <div className="vt-top">
          <Tip className="vt-bet" hint={hintFor(bet)}>{bet.bet}</Tip>
          <span className="vt-odds num">{fmtOdds(bet.odds)}</span>
        </div>
        <div className="vt-bot">
          <span className="vt-stake">
            <span className={bet.side === 'Паша' ? 'side-pasha' : 'side-ai'}>{bet.side}</span>
            {bet.contest ? ' · конкурс' : ''} · {rubFmt(stakeOf(bet))}
          </span>
          <Result bet={bet} />
        </div>
      </div>
    </article>
  );
}
