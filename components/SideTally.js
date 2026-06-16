'use client';
import { money, rubFmt } from '@/lib/calc';
import { sideLabel } from '@/lib/i18n';
import { useLang, useT } from '@/app/providers';

// t = { n, pl, pendingN, atStake, anySettled }
export default function SideTally({ side, t }) {
  const lang = useLang();
  const T = useT();
  if (!t || t.n === 0) return null;
  const cls = side === 'Паша' ? 'pasha' : 'ai';
  let right;
  if (t.pendingN > 0 && t.anySettled) {
    right = (
      <>
        <span className={t.pl > 0 ? 'pos' : t.pl < 0 ? 'neg' : ''}>{money(t.pl, lang)}</span>
        <span className="tally-stake"> · {rubFmt(t.atStake, lang)} {T('common.inPlay')}</span>
      </>
    );
  } else if (t.pendingN > 0) {
    right = <span className="tally-stake">{rubFmt(t.atStake, lang)} {T('common.inPlay')}</span>;
  } else {
    right = <span className={t.pl > 0 ? 'pos' : t.pl < 0 ? 'neg' : ''}>{money(t.pl, lang)}</span>;
  }
  return (
    <span className={'tally ' + cls}>
      <span className="tally-name">{sideLabel(side, lang)}</span>
      <span className="tally-n">{t.n} {T('common.stakeShort')}</span>
      <span className="tally-pl num">{right}</span>
    </span>
  );
}
