'use client';
import { bets } from '@/lib/content';
import { aggregate, money, rubFmt } from '@/lib/calc';
import { buildDays, currentDayIndex } from '@/lib/cards';
import { sideLabel } from '@/lib/i18n';
import { useLang, useT } from '@/app/providers';

function pct(x) {
  return x === null ? '—' : (x > 0 ? '+' : '') + x.toFixed(0) + '%';
}

// «ДУЭЛЬ СЕЗОНА» — герой-разворот альбома: бумажная наклейка Паши против
// голографической chrome-карты AI, между ними чернильный штамп VS,
// под ними — рукописная строка лидера.
export default function BattleBoard() {
  const lang = useLang();
  const t = useT();
  const pasha = aggregate(bets.filter((b) => b.side === 'Паша'));
  const ai = aggregate(bets.filter((b) => b.side === 'AI'));
  const leaderSide = pasha.bal === ai.bal ? null : pasha.bal > ai.bal ? 'Паша' : 'AI';
  const gap = Math.abs(pasha.bal - ai.bal);
  const days = buildDays();
  const md = currentDayIndex(days) + 1;

  const Stats = ({ agg, dark }) => (
    <dl className="card-stats">
      <div><dt>{t('common.bank')}</dt><dd>{rubFmt(agg.bank, lang)}</dd></div>
      <div><dt>{t('common.roi')}</dt><dd className={agg.roi > 0 ? (dark ? 'plus' : 'pos') : agg.roi < 0 ? 'neg' : ''}>{pct(agg.roi)}</dd></div>
      <div><dt>{t('card.hits')}</dt><dd>{agg.wins}/{agg.settled}</dd></div>
      <div><dt>{t('common.inPlay')}</dt><dd>{agg.pending}</dd></div>
    </dl>
  );

  return (
    <>
      <section className="duel" aria-label={t('a11y.battle')}>
        <article className="sticker-card card-pasha duel-side pasha">
          <div className="card-inner">
            <div className="card-plate">{t('card.plate.pasha')}</div>
            <div className="card-tag">{t('card.tag.pasha')}</div>
            <div className="portrait">
              <span className="mono-p" aria-hidden="true">{lang === 'en' ? 'P' : 'П'}</span>
              <span className="card-ribbon">{t('card.ribbon.pasha')}</span>
            </div>
            <div className="card-balance">
              <span className="cb-label">{t('card.balance')}</span>
              <span className={'cb-val ' + (pasha.bal > 0 ? 'pos' : pasha.bal < 0 ? 'neg' : '')}>{money(pasha.bal, lang)}</span>
            </div>
            <Stats agg={pasha} />
            <div className="card-foot">
              <span>{t('card.no.pasha')}</span>
              <span className="series">{t('card.series')}</span>
            </div>
          </div>
        </article>

        <div className="vs-wrap">
          <div className="vs" aria-hidden="true">VS<small>{t('vs.md')}{md}</small></div>
        </div>

        <article className="sticker-card card-ai duel-side ai">
          <div className="metal">
            <div className="card-inner">
              <span className="shine" aria-hidden="true" />
              <div className="card-plate">{t('card.plate.ai')}</div>
              <div className="card-tag">{t('card.tag.ai')}</div>
              <div className="portrait">
                <span className="ai-mono" aria-hidden="true">AI</span>
                <span className="card-ribbon">{t('card.ribbon.ai')}</span>
              </div>
              <div className="card-balance">
                <span className="cb-label">{t('card.balance')}</span>
                <span className={'cb-val ' + (ai.bal > 0 ? 'plus' : ai.bal < 0 ? 'neg' : '')}>{money(ai.bal, lang)}</span>
              </div>
              <Stats agg={ai} dark />
              <div className="card-foot">
                <span>{t('card.no.ai')} · <span className="rare">{t('card.rare')}</span></span>
                <span className="series">{t('card.series')}</span>
              </div>
            </div>
          </div>
        </article>
      </section>

      <p className="hand-note">
        {leaderSide ? (
          <>
            <span className="hn-u">{sideLabel(leaderSide, lang)} {t('battle.aheadMid')} {rubFmt(gap, lang)}</span>
            {t('hand.start')}
          </>
        ) : (
          <>{t('battle.even')}{t('hand.start')}</>
        )}
      </p>
    </>
  );
}
