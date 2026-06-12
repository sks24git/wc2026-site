import { bets } from '@/data/bets';
import { pl, fmt, formatDay } from '@/lib/calc';
import Ticket from '@/components/Ticket';

export const metadata = { title: 'Ставки · ЧМ-26' };

export default function BetsPage() {
  const byDay = {};
  for (const b of bets) {
    (byDay[b.date] = byDay[b.date] || []).push(b);
  }
  const days = Object.keys(byDay).sort().reverse();

  return (
    <div>
      <h1>Ставки</h1>
      {days.length === 0 && <p className="empty">Ставок пока нет</p>}
      {days.map((d) => {
        const list = byDay[d];
        const settled = list.filter((b) => b.status !== 'pending' && b.status !== 'void');
        const dayPl = list.reduce((s, b) => s + pl(b), 0);
        return (
          <section key={d} className="day-group" aria-label={formatDay(d)}>
            <div className="day-head">
              <span className="day-title">{formatDay(d)}</span>
              <span className={'day-pl ' + (settled.length === 0 ? '' : dayPl > 0 ? 'pos' : dayPl < 0 ? 'neg' : '')}>
                {settled.length === 0 ? 'в игре' : fmt(dayPl) + ' ед'}
              </span>
            </div>
            {list.map((b) => <Ticket key={b.id} bet={b} />)}
          </section>
        );
      })}
      <p className="foot-note">
        Новые ставки добавляются через чат с Владом — сайт обновляется в течение пары минут
      </p>
    </div>
  );
}
