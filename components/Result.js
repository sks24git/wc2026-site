import { pl, money } from '@/lib/calc';

// Выровненный блок результата: иконка ✓/✗/↩/· + сумма (учитывает возврат и «в игре»).
export default function Result({ bet }) {
  const st = bet.status;
  const p = pl(bet);
  const ic = st === 'win' ? '✓' : st === 'lose' ? '✗' : st === 'void' ? '↩' : '·';
  const txt = st === 'pending' ? 'в игре' : st === 'void' ? 'возврат' : money(p);
  return (
    <span className="res">
      <span className={'res-ic ' + st} aria-hidden="true">{ic}</span>
      <span className={'res-sum num ' + st}>{txt}</span>
    </span>
  );
}
