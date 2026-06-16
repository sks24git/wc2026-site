'use client';
import { bets } from '@/lib/content';
import { aggregate, money, rubFmt } from '@/lib/calc';
import { sideLabel } from '@/lib/i18n';
import { useLang, useT } from '@/app/providers';

function pct(x) {
  return x === null ? '—' : (x > 0 ? '+' : '') + x.toFixed(0) + '%';
}

export default function BattleBoard() {
  const lang = useLang();
  const t = useT();
  const pasha = aggregate(bets.filter((b) => b.side === 'Паша'));
  const ai = aggregate(bets.filter((b) => b.side === 'AI'));
  const leaderSide = pasha.bal === ai.bal ? null : pasha.bal > ai.bal ? 'Паша' : 'AI';
  const gap = Math.abs(pasha.bal - ai.bal);

  const Side = ({ name, agg, cls }) => (
    <div className={'b-side ' + cls}>
      <div className="b-name">{name}</div>
      <div className={'b-bal ' + (agg.bal > 0 ? 'pos' : agg.bal < 0 ? 'neg' : '')}>{money(agg.bal, lang)}</div>
      <div className="b-sub">
        {t('common.bank')} <span className="num">{rubFmt(agg.bank, lang)}</span>
      </div>
      <div className="b-sub2">
        {t('common.roi')} <span className="num">{pct(agg.roi)}</span> · <span className="num">{agg.wins}/{agg.settled}</span>
        {agg.pending > 0 && <> · {t('common.inPlay')} <span className="num">{agg.pending}</span></>}
      </div>
    </div>
  );

  return (
    <section aria-label={t('a11y.battle')}>
      <div className="battle">
        <Side name={sideLabel('Паша', lang)} agg={pasha} cls="pasha" />
        <div className="b-vs">{t('common.vs')}</div>
        <Side name={sideLabel('AI', lang)} agg={ai} cls="ai" />
      </div>
      <div className="b-lead">
        {leaderSide ? (
          <><span className="crown" aria-hidden="true">👑</span><strong>{sideLabel(leaderSide, lang)}</strong> {t('battle.aheadMid')} <strong>{money(gap, lang)}</strong></>
        ) : (
          <>{t('battle.even')}</>
        )}
        <span className="b-bank0">{t('battle.start')}</span>
      </div>
    </section>
  );
}
