import Link from 'next/link';
import { bets } from '@/data/bets';
import { matches } from '@/data/matches';
import { aggregate, fmt, fmtOdds, formatDay } from '@/lib/calc';
import Ticket from '@/components/Ticket';

export default function HomePage() {
  const agg = aggregate(bets);
  const upcoming = matches.filter((m) => !m.result);
  const pending = bets.filter((b) => b.status === 'pending');
  const atStake = pending.reduce((s, b) => s + Number(b.stake), 0);
  const otherPending = pending.filter((b) => !b.matchId);

  return (
    <div>
      <h1 className="sr-only">Сегодня</h1>
      <section className="hero" aria-label="Сводка банка">
        <div className="kicker">Общий результат · ЧМ-26</div>
        <div className={'hero-balance ' + (agg.bal > 0 ? 'pos' : agg.bal < 0 ? 'neg' : '')}>
          {fmt(agg.bal)}<small>ед</small>
        </div>
        <div className="hero-row">
          <div className="hero-stat">
            <div className="lbl">ROI</div>
            <div className={'v ' + (agg.bal > 0 ? 'pos' : agg.bal < 0 ? 'neg' : '')}>{agg.roi === null ? '—' : fmt(agg.roi) + '%'}</div>
          </div>
          <div className="hero-stat">
            <div className="lbl">Заход</div>
            <div className="v">{agg.hit === null ? '—' : agg.hit + '%'}</div>
          </div>
          <div className="hero-stat">
            <div className="lbl">На кону</div>
            <div className="v gold">{atStake.toFixed(1).replace(/\.0$/, '')}{' '}ед</div>
          </div>
          <div className="hero-stat">
            <div className="lbl">В игре</div>
            <div className="v gold">{agg.pending}</div>
          </div>
        </div>
      </section>

      <section aria-label="Ближайшие матчи">
        <div className="kicker">Ближайшие матчи</div>
        {upcoming.length === 0 ? (
          <p className="empty">Карточек пока нет — скоро добавим</p>
        ) : (
          upcoming.map((m) => {
            const picks = bets.filter((b) => b.matchId === m.id && b.status === 'pending');
            return (
              <Link key={m.id} className="fixture" href={'/matches/' + m.id + '/'}>
                <div className="fixture-top">
                  <span className="fixture-stage">{m.stage}</span>
                  <span className="fixture-time num">{formatDay(m.date)} · {m.timeMsk}{' '}МСК</span>
                </div>
                <div className="fixture-title">{m.flags} {m.title}</div>
                <div className="fixture-venue">{m.venue}</div>
                {picks.length > 0 && (
                  <div className="fixture-picks">
                    {picks.map((p) => (
                      <span key={p.id} className={'pick' + (p.book === 'Конкурс ЛС' ? ' contest' : '')}>
                        {p.bet} <span className="odds">{fmtOdds(p.odds)}</span>
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            );
          })
        )}
      </section>

      {otherPending.length > 0 && (
        <section aria-label="Прочие ставки в игре" style={{ marginTop: 24 }}>
          <div className="kicker">Также в игре</div>
          {otherPending.map((b) => <Ticket key={b.id} bet={b} />)}
        </section>
      )}
      <p className="foot-note">Все ставки и история — во вкладке «Ставки»</p>
    </div>
  );
}
