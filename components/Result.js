'use client';
import { pl, money } from '@/lib/calc';
import { useLang, useT } from '@/app/providers';

// Выровненный блок результата: иконка ✓/✗/↩/· + сумма (учитывает возврат и «в игре»).
export default function Result({ bet }) {
  const lang = useLang();
  const t = useT();
  const st = bet.status;
  const p = pl(bet);
  const ic = st === 'win' ? '✓' : st === 'lose' ? '✗' : st === 'void' ? '↩' : '·';
  const txt = st === 'pending' ? t('common.inPlay') : st === 'void' ? t('result.refund') : money(p, lang);
  return (
    <span className="res">
      <span className={'res-ic ' + st} aria-hidden="true">{ic}</span>
      <span className={'res-sum num ' + st}>{txt}</span>
    </span>
  );
}
