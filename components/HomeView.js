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
import Emph from '@/components/Emph';
import Flags from '@/components/Flags';
import Ticket from '@/components/Ticket';
import Tip from '@/components/Tip';
import TierIcon from '@/components/TierIcon';
import CardsStrip from '@/components/CardsStrip';

// Ключ сортировки фактов по времени поста (новые сверху) из строки вида "21.06 · 01:48".
function factTimeKey(t) {
  const m = String(t || '').match(/(\d{2})\.(\d{2}).*?(\d{2}):(\d{2})/);
  if (!m) return 0;
  const [, dd, mm, hh, mi] = m;
  return +mm * 1e6 + +dd * 1e4 + +hh * 100 + +mi;
}

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

        <Link className="home-promo" href="/playoffs/">
          <span className="scotch s1" aria-hidden="true" />
          <span className="scotch s2" aria-hidden="true" />
          <span className="hp-ic" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
            </svg>
          </span>
          <span className="hp-body">
            <span className="hp-title">{lang === 'en' ? 'AI playoff forecast is in' : 'Прогноз AI на весь плей-офф готов'}</span>
            <span className="hp-sub">
              {lang === 'en' ? (
                <>Final <b>Spain–Argentina</b>, champion <b>Argentina</b> — the full match-by-match bracket with scores, shootouts and pitfalls. <span className="hp-cta">Open the Playoffs tab →</span></>
              ) : (
                <>Финал <b>Испания–Аргентина</b>, чемпион <b>Аргентина</b> — вся сетка матч-за-матчем со счётами, сериями пенальти и «подводными камнями». <span className="hp-cta">Открыть вкладку «Плей-офф» →</span></>
              )}
            </span>
          </span>
        </Link>

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
            {[...facts].sort((a, b) => factTimeKey(b.time) - factTimeKey(a.time)).map((f, i) => (
              <div key={i} className="fact">
                <span className="fact-bullet" aria-hidden="true" />
                <div className="fact-main">
                  <span className="fact-text"><Emph text={L(f, lang)} /></span>
                  {f.time && <time className="fact-time num">{f.time}</time>}
                </div>
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
