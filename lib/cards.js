import { bets } from '@/lib/content';
import { pl } from '@/lib/calc';

// Карты «1 день · 1 сторона» — для постеров и слайдера.
export function buildCards() {
  const map = {};
  for (const b of bets) {
    const key = b.date + '|' + b.side;
    (map[key] = map[key] || { date: b.date, side: b.side, list: [] }).list.push(b);
  }
  const cards = Object.values(map).map((c) => {
    const settled = c.list.filter((b) => b.status === 'win' || b.status === 'lose');
    return {
      key: c.date + '-' + (c.side === 'AI' ? 'ai' : 'pasha'),
      date: c.date,
      side: c.side,
      list: c.list,
      pl: c.list.reduce((s, b) => s + pl(b), 0),
      wins: settled.filter((b) => b.status === 'win').length,
      settled: settled.length,
      pending: c.list.filter((b) => b.status === 'pending').length,
    };
  });
  cards.sort((a, b) => b.date.localeCompare(a.date) || (a.side === 'AI' ? -1 : 1));
  return cards;
}
