export const STATUS_LABELS = {
  pending: 'В игре',
  win: 'Зашла',
  lose: 'Мимо',
  void: 'Возврат',
};

export const SIDES = ['Паша', 'AI'];

export function pl(b) {
  if (b.status === 'win') return b.stake * (b.odds - 1);
  if (b.status === 'lose') return -b.stake;
  return 0;
}

export function fmt(n) {
  const v = Number(n);
  return (v > 0 ? '+' : '') + v.toFixed(2);
}

export function fmtOdds(n) {
  return Number(n).toFixed(2);
}

export function aggregate(bets) {
  const settled = bets.filter((b) => b.status === 'win' || b.status === 'lose');
  const bal = bets.reduce((s, b) => s + pl(b), 0);
  const staked = settled.reduce((s, b) => s + Number(b.stake), 0);
  const wins = settled.filter((b) => b.status === 'win').length;
  return {
    bal,
    roi: staked ? (bal / staked) * 100 : null,
    hit: settled.length ? Math.round((wins / settled.length) * 100) : null,
    wins,
    settled: settled.length,
    pending: bets.filter((b) => b.status === 'pending').length,
  };
}

export function groupBy(bets, keyFn) {
  const out = {};
  for (const b of bets) {
    if (b.status !== 'win' && b.status !== 'lose') continue;
    const k = keyFn(b);
    out[k] = out[k] || { n: 0, w: 0, pl: 0 };
    out[k].n++;
    if (b.status === 'win') out[k].w++;
    out[k].pl += pl(b);
  }
  return out;
}

const dayFmt = new Intl.DateTimeFormat('ru-RU', { weekday: 'short', day: 'numeric', month: 'long', timeZone: 'UTC' });

export function formatDay(dateStr) {
  return dayFmt.format(new Date(dateStr + 'T12:00:00Z'));
}
