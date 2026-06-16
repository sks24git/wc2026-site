import { bets } from '@/lib/content';
import { pl } from '@/lib/calc';

// Карты «1 день · 1 сторона». status: done | live | soon
export function buildCards() {
  const map = {};
  for (const b of bets) {
    const key = b.date + '|' + b.side;
    (map[key] = map[key] || { date: b.date, side: b.side, list: [] }).list.push(b);
  }
  const cards = Object.values(map).map((c) => {
    const settled = c.list.filter((b) => b.status === 'win' || b.status === 'lose');
    const pending = c.list.filter((b) => b.status === 'pending').length;
    const status = pending === 0 && settled.length > 0 ? 'done'
      : settled.length > 0 && pending > 0 ? 'live'
      : 'soon';
    return {
      key: c.date + '-' + (c.side === 'AI' ? 'ai' : 'pasha'),
      date: c.date,
      side: c.side,
      list: c.list,
      pl: c.list.reduce((s, b) => s + pl(b), 0),
      wins: settled.filter((b) => b.status === 'win').length,
      settled: settled.length,
      pending,
      status,
    };
  });
  // прошлое → будущее (слева направо); внутри дня AI левее Паши
  cards.sort((a, b) => a.date.localeCompare(b.date) || (a.side === 'AI' ? -1 : 1));
  return cards;
}

import { t } from '@/lib/i18n';

// Подпись статуса карты дня — двуязычная.
export function cardStatusLabel(status, lang = 'ru') { return t(lang, 'cardstatus.' + status); }

// индекс «текущей» карты — первая незавершённая (для центрирования листалки/ленты)
export function currentIndex(cards) {
  const i = cards.findIndex((c) => c.status !== 'done');
  return i >= 0 ? i : cards.length - 1;
}

// дни как развороты {date, ai, pasha} — для парного просмотра AI vs Паша
export function buildDays() {
  const map = {};
  for (const c of buildCards()) {
    (map[c.date] = map[c.date] || { date: c.date, ai: null, pasha: null })[c.side === 'AI' ? 'ai' : 'pasha'] = c;
  }
  return Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
}

export function currentDayIndex(days) {
  const i = days.findIndex((d) => (d.ai && d.ai.status !== 'done') || (d.pasha && d.pasha.status !== 'done'));
  return i >= 0 ? i : days.length - 1;
}
