import { money, rubFmt } from '@/lib/calc';

// t = { n, pl, pendingN, atStake, anySettled }
export default function SideTally({ side, t }) {
  if (!t || t.n === 0) return null;
  const cls = side === 'Паша' ? 'pasha' : 'ai';
  let right;
  if (t.pendingN > 0 && t.anySettled) {
    right = (
      <>
        <span className={t.pl > 0 ? 'pos' : t.pl < 0 ? 'neg' : ''}>{money(t.pl)}</span>
        <span className="tally-stake"> · {rubFmt(t.atStake)} в игре</span>
      </>
    );
  } else if (t.pendingN > 0) {
    right = <span className="tally-stake">{rubFmt(t.atStake)} в игре</span>;
  } else {
    right = <span className={t.pl > 0 ? 'pos' : t.pl < 0 ? 'neg' : ''}>{money(t.pl)}</span>;
  }
  return (
    <span className={'tally ' + cls}>
      <span className="tally-name">{side}</span>
      <span className="tally-n">{t.n} ст.</span>
      <span className="tally-pl num">{right}</span>
    </span>
  );
}
