import Link from 'next/link';
import { bets } from '@/data/bets';
import { matches } from '@/data/matches';
import { facts } from '@/data/facts';
import { fmtOdds, formatDay } from '@/lib/calc';
import { hintFor } from '@/lib/glossary';
import BattleBoard from '@/components/BattleBoard';
import NewsRail from '@/components/NewsRail';
import Flags from '@/components/Flags';
import Ticket from '@/components/Ticket';
import Tip from '@/components/Tip';

export default function HomePage() {
  const upcoming = matches.filter((m) => !m.result);
  const pending = bets.filter((b) => b.status === 'pending');
  const otherPending = pending.filter((b) => !b.matchId);

  return (
    <div className="home-grid">
      <div className="home-main">
        <h1 className="sr-only">Сегодня</h1>
        <BattleBoard />

        <div className="sect"><span className="sect-label">Факты</span></div>
        <section className="facts" aria-label="Факты">
          {facts.map((f, i) => (
            <div key={i} className="fact">
              <span className="fact-bullet" aria-hidden="true" />
              <span>{f.t}</span>
            </div>
          ))}
        </section>

        <div className="sect"><span className="sect-label">Ближайшие матчи</span></div>
        <section aria-label="Ближайшие матчи">
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
                          <span className={'tdot tier-' + p.tier} aria-hidden="true" />
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
          <Link className="more-link" href="/matches/">Вся афиша и результаты →</Link>
        </section>

        {otherPending.length > 0 && (
          <>
            <div className="sect"><span className="sect-label">Также в игре</span></div>
            <section aria-label="Прочие ставки в игре">
              {otherPending.map((b) => <Ticket key={b.id} bet={b} />)}
            </section>
          </>
        )}
      </div>

      <div className="home-rail">
        <NewsRail />
      </div>
    </div>
  );
}
