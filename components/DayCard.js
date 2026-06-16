'use client';
import { matches } from '@/lib/content';
import { fmtOdds, money, formatDay } from '@/lib/calc';
import { cardStatusLabel } from '@/lib/cards';
import { L, sideLabel } from '@/lib/i18n';
import { useLang, useT } from '@/app/providers';
import TierIcon from '@/components/TierIcon';
import Result from '@/components/Result';

const matchMeta = (id) => matches.find((m) => m.id === id) || null;
const avatarText = (side, lang) => (side === 'AI' ? 'AI' : lang === 'en' ? 'P' : 'П');

export default function DayCard({ card }) {
  const lang = useLang();
  const T = useT();
  const cls = card.side === 'AI' ? 'ai' : 'pasha';
  const byMatch = {};
  for (const b of card.list) {
    const key = b.matchId || ('_' + L(b.match, 'ru')); // ключ языко-нейтрален
    (byMatch[key] = byMatch[key] || []).push(b);
  }
  const keys = Object.keys(byMatch);
  const plClass = card.settled === 0 ? '' : card.pl > 0 ? 'pos' : card.pl < 0 ? 'neg' : '';

  return (
    <article className={'daycard ' + cls + ' st-' + card.status}>
      <header className="dc-head">
        <span className={'dc-av ' + cls} aria-hidden="true">{avatarText(card.side, lang)}</span>
        <div className="dc-hl">
          <div className="dc-who">{sideLabel(card.side, lang)} <span className={'dc-chip ' + card.status}>{cardStatusLabel(card.status, lang)}</span></div>
          <div className="dc-date">{formatDay(card.date, lang)}</div>
        </div>
        <div className="dc-total">
          <div className="dc-total-lbl">{card.status === 'soon' ? T('daycard.atStake') : card.status === 'live' ? T('daycard.soFar') : T('daycard.dayTotal')}</div>
          <div className={'dc-total-v num ' + plClass}>{card.status === 'soon' ? `${card.pending} ${T('common.stakeShort')}` : money(card.pl, lang)}</div>
        </div>
      </header>

      <div className="dc-body">
        {keys.map((k) => {
          const m = k.startsWith('_') ? null : matchMeta(k);
          const title = m ? L(m.title, lang) : L(byMatch[k][0].match, lang);
          return (
            <div key={k} className="dc-match">
              <div className="dc-match-head">
                <span className="dc-match-title">{title}</span>
                {m && m.result && <span className="dc-match-score num">{m.result}</span>}
              </div>
              {byMatch[k].map((b) => (
                <div key={b.id} className={'dc-bet ' + b.status}>
                  <TierIcon tier={b.tier} size={15} lang={lang} />
                  <span className="dc-bet-name">{L(b.bet, lang)}</span>
                  <span className="dc-bet-odds num">{fmtOdds(b.odds)}</span>
                  <Result bet={b} />
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <footer className="dc-foot">
        <span className="dc-brand">{T('brand.day')}</span>
        <span className="dc-meta">{card.settled ? T('daycard.hit', { w: card.wins, n: card.settled }) : T('daycard.inPlayN', { n: card.pending })}</span>
      </footer>
    </article>
  );
}

export function EmptyDayCard({ side, past }) {
  const lang = useLang();
  const T = useT();
  const cls = side === 'AI' ? 'ai' : 'pasha';
  return (
    <article className={'daycard ' + cls + ' st-empty'}>
      <header className="dc-head">
        <span className={'dc-av ' + cls} aria-hidden="true">{avatarText(side, lang)}</span>
        <div className="dc-hl">
          <div className="dc-who">{sideLabel(side, lang)}</div>
          <div className="dc-date">{past ? T('daycard.notPlayed') : T('daycard.noBetsYet')}</div>
        </div>
      </header>
      <div className="dc-empty">
        <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 22h14M5 2h14M6 2v5a6 6 0 0 0 12 0V2M6 22v-5a6 6 0 0 1 12 0v5" />
        </svg>
        <span>{past ? T('bets.noPick') : T('bets.waiting')}</span>
      </div>
    </article>
  );
}
