'use client';
import Link from 'next/link';
import { bets, matches, facts } from '@/lib/content';
import { fmtOdds, formatDay } from '@/lib/calc';
import { hintFor } from '@/lib/glossary';
import { L, sideLabel } from '@/lib/i18n';
import { kickoffInstant } from '@/lib/datetime';
import { useLang, useT, useTimeFmt } from '@/app/providers';
import BattleBoard from '@/components/BattleBoard';
import NewsRail from '@/components/NewsRail';
import Flags from '@/components/Flags';
import Ticket from '@/components/Ticket';
import Tip from '@/components/Tip';
import TierIcon from '@/components/TierIcon';
import CardsStrip from '@/components/CardsStrip';

export default function HomeView() {
  const lang = useLang();
  const T = useT();
  const tf = useTimeFmt();

  const upcoming = matches.filter((m) => !m.result);
  const pending = bets.filter((b) => b.status === 'pending');
  const otherPending = pending.filter((b) => !b.matchId);

  return (
    <div className="home-grid">
      <h1 className="sr-only">{T('home.h1')}</h1>

      <div className="g-main">
        <section className="g-battle"><BattleBoard /></section>

        <section className="g-matches" aria-label={T('a11y.matchesAndBets')}>
          <div className="sect"><span className="sect-label">{T('home.cardsOfDay')}</span></div>
          <CardsStrip />

          <div className="sect"><span className="sect-label">{T('home.upcoming')}</span></div>
          {upcoming.length === 0 ? (
            <p className="empty">{T('home.noCards')}</p>
          ) : (
            upcoming.map((m) => {
              const picks = bets.filter((b) => b.matchId === m.id && b.status === 'pending');
              const inst = kickoffInstant(m.date, m.timeMsk);
              return (
                <Link key={m.id} className="fixture" href={'/matches/' + m.id + '/'}>
                  <div className="fixture-meta">{L(m.stage, lang)} · {formatDay(m.date, lang)} · <span className="hot">{tf.time(inst)} {tf.zoneShort(inst)}</span></div>
                  <div className="fixture-head">
                    <Flags cc={m.cc} />
                    <span className="fixture-title">{L(m.title, lang)}</span>
                  </div>
                  {m.lede && <p className="fixture-lede">{L(m.lede, lang)}</p>}
                  <div className="fixture-venue">{L(m.venue, lang)}{m.weather ? ' · ' + L(m.weather, lang) : ''}</div>
                  {picks.length > 0 && (
                    <div className="fixture-picks">
                      {picks.map((p) => (
                        <div key={p.id} className="pick-line">
                          <TierIcon tier={p.tier} size={15} lang={lang} />
                          <span className="pick-name">
                            <Tip hint={hintFor(p, lang)} hoverOnly>{L(p.bet, lang)}</Tip>
                            <span className={'pick-side ' + (p.side === 'Паша' ? 'pasha' : 'ai')}>{sideLabel(p.side, lang)}</span>
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
              <div className="sect"><span className="sect-label">{T('home.alsoInPlay')}</span></div>
              {otherPending.map((b) => <Ticket key={b.id} bet={b} />)}
            </>
          )}
        </section>

        <section className="g-facts" aria-label={T('a11y.facts')}>
          <div className="sect"><span className="sect-label">{T('home.facts')}</span></div>
          <div className="facts">
            {facts.map((f, i) => (
              <div key={i} className="fact">
                <span className="fact-bullet" aria-hidden="true" />
                <span>{L(f, lang)}</span>
              </div>
            ))}
          </div>
        </section>

        <p className="foot-note">{T('home.footNote')}</p>
      </div>

      <aside className="g-rail"><NewsRail /></aside>
    </div>
  );
}
