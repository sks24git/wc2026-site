import Link from 'next/link';
import { bets } from '@/lib/content';
import { matches } from '@/lib/content';
import { facts } from '@/lib/content';
import { fmtOdds, formatDay } from '@/lib/calc';
import { hintFor } from '@/lib/glossary';
import BattleBoard from '@/components/BattleBoard';
import NewsRail from '@/components/NewsRail';
import Flags from '@/components/Flags';
import Ticket from '@/components/Ticket';
import Tip from '@/components/Tip';
import TierIcon from '@/components/TierIcon';

export default function HomePage() {
  const upcoming = matches.filter((m) => !m.result);
  const pending = bets.filter((b) => b.status === 'pending');
  const otherPending = pending.filter((b) => !b.matchId);

  return (
    <div className="home-grid">
      <h1 className="sr-only">Сегодня</h1>

      <section className="g-battle"><BattleBoard /></section>

      <section className="g-facts" aria-label="Факты">
        <div className="sect"><span className="sect-label">Факты</span></div>
        <div className="facts">
          {facts.map((f, i) => (
            <div key={i} className="fact">
              <span className="fact-bullet" aria-hidden="true" />
              <span>{f}</span>
            </div>
          ))}
        </div>
      </section>

      <aside className="g-rail"><NewsRail /></aside>

      <section className="g-matches" aria-label="Матчи и ставки">
        <div className="sect"><span className="sect-label">Ближайшие матчи</span></div>
        {upcoming.length === 0 ? (
          <p className="empty">Карточек пока нет — скоро добавим</p>
        ) : (
          upcoming.map((m) => {
            const picks = bets.filter((b) => b.matchId === m.id && b.status === 'pending');
            return (
              <Link key={m.id} className="fixture" href={'/matches/' + m.id + '/'}>
                <div className="fixture-meta">{m.stage} · {formatDay(m.date)} · <span className="hot">{m.timeMsk}{' '}МСК</span></div>
                <div className="fixture-head">
                  <Flags cc={m.cc} />
                  <span className="fixture-title">{m.title}</span>
                </div>
                {m.lede && <p className="fixture-lede">{m.lede}</p>}
                <div className="fixture-venue">{m.venue}{m.weather ? ' · ' + m.weather : ''}</div>
                {picks.length > 0 && (
                  <div className="fixture-picks">
                    {picks.map((p) => (
                      <div key={p.id} className="pick-line">
                        <TierIcon tier={p.tier} size={15} />
                        <span className="pick-name">
                          <Tip hint={hintFor(p)} hoverOnly>{p.bet}</Tip>
                          <span className={'pick-side ' + (p.contest ? 'contest' : p.side === 'Паша' ? 'pasha' : 'ai')}>
                            {p.contest ? 'Конкурс' : p.side}
                          </span>
                        </span>
                        <span className="leader" aria-hidden="true" />
                        <span className="pick-odds num">{fmtOdds(p.odds)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Link>
            );
          })
        )}

        {otherPending.length > 0 && (
          <>
            <div className="sect"><span className="sect-label">Также в игре</span></div>
            {otherPending.map((b) => <Ticket key={b.id} bet={b} />)}
          </>
        )}
        <p className="foot-note">Полная лента и расчёт — во вкладках «Ставки» и «Матчи»</p>
      </section>
    </div>
  );
}
