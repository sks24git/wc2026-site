'use client';
import { fmtOdds, stakeOf, rubFmt } from '@/lib/calc';
import { hintFor } from '@/lib/glossary';
import { L } from '@/lib/i18n';
import { useLang } from '@/app/providers';
import Tip from '@/components/Tip';
import TierIcon from '@/components/TierIcon';
import Result from '@/components/Result';

// Компактный тикет для vs-колонки: без названия матча (оно в заголовке группы)
export default function VsTicket({ bet }) {
  const lang = useLang();
  return (
    <article className={'vt ' + bet.status}>
      <TierIcon tier={bet.tier} lang={lang} />
      <div className="vt-body">
        <div className="vt-top">
          <Tip className="vt-bet" hint={hintFor(bet, lang)}>{L(bet.bet, lang)}</Tip>
          <span className="vt-odds num">{fmtOdds(bet.odds)}</span>
        </div>
        {bet.legs && (
          <div className="vt-legs">
            {bet.legs.map((l, i) => (
              <div key={i} className="vt-leg">
                <span className="vt-leg-m">{L(l.m, lang)}</span>
                <span className="vt-leg-p num">{L(l.p, lang)}</span>
              </div>
            ))}
          </div>
        )}
        <div className="vt-bot">
          <span className="vt-stake">{rubFmt(stakeOf(bet), lang)}</span>
          <Result bet={bet} />
        </div>
        {bet.note && <p className="vt-note">{L(bet.note, lang)}</p>}
      </div>
    </article>
  );
}
