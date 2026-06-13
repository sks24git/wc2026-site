import { matches } from '@/lib/content';
import { fmtOdds, money, formatDay } from '@/lib/calc';
import { STATUS_LABEL } from '@/lib/cards';
import TierIcon from '@/components/TierIcon';
import Result from '@/components/Result';

const matchMeta = (id) => matches.find((m) => m.id === id) || null;

export default function DayCard({ card }) {
  const cls = card.side === 'AI' ? 'ai' : 'pasha';
  const byMatch = {};
  for (const b of card.list) (byMatch[b.matchId || ('_' + b.match)] = byMatch[b.matchId || ('_' + b.match)] || []).push(b);
  const keys = Object.keys(byMatch);
  const plClass = card.settled === 0 ? '' : card.pl > 0 ? 'pos' : card.pl < 0 ? 'neg' : '';

  return (
    <article className={'daycard ' + cls + ' st-' + card.status}>
      <header className="dc-head">
        <span className={'dc-av ' + cls} aria-hidden="true">{card.side === 'AI' ? 'AI' : 'П'}</span>
        <div className="dc-hl">
          <div className="dc-who">{card.side} <span className={'dc-chip ' + card.status}>{STATUS_LABEL[card.status]}</span></div>
          <div className="dc-date">{formatDay(card.date)}</div>
        </div>
        <div className="dc-total">
          <div className="dc-total-lbl">{card.status === 'soon' ? 'на кону' : card.status === 'live' ? 'пока' : 'итог дня'}</div>
          <div className={'dc-total-v num ' + plClass}>{card.status === 'soon' ? card.pending + ' ст.' : money(card.pl)}</div>
        </div>
      </header>

      <div className="dc-body">
        {keys.map((k) => {
          const m = k.startsWith('_') ? null : matchMeta(k);
          const title = m ? m.title : byMatch[k][0].match;
          return (
            <div key={k} className="dc-match">
              <div className="dc-match-head">
                <span className="dc-match-title">{title}</span>
                {m && m.result && <span className="dc-match-score num">{m.result}</span>}
              </div>
              {byMatch[k].map((b) => (
                <div key={b.id} className={'dc-bet ' + b.status}>
                  <TierIcon tier={b.tier} size={15} />
                  <span className="dc-bet-name">{b.bet}</span>
                  <span className="dc-bet-odds num">{fmtOdds(b.odds)}</span>
                  <Result bet={b} />
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <footer className="dc-foot">
        <span className="dc-brand">ЧМ·26 · Паша vs AI</span>
        <span className="dc-meta">{card.settled ? `зашло ${card.wins}/${card.settled}` : `${card.pending} в игре`}</span>
      </footer>
    </article>
  );
}
