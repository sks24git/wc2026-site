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
        {bet.legs && (
          <div className="vt-legs">
            {bet.legs.map((l, i) => (
              <div key={i} className="vt-leg">
                <span className="vt-leg-m">{l.m}</span>
                <span className="vt-leg-p num">{l.p}</span>
              </div>
            ))}
          </div>
        )}
        <div className="vt-bot">
          <span className="vt-stake">{rubFmt(stakeOf(bet))}</span>
          <Result bet={bet} />
        </div>
        {bet.note && <p className="vt-note">{bet.note}</p>}
      </div>
    </article>
  );
}
