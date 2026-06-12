export const STATUS_LABELS = {
  pending: 'В игре',
  win: 'Зашла',
  lose: 'Мимо',
  void: 'Возврат',
};

export const SIDES = ['Паша', 'AI'];
export const BANK0 = 100000; // стартовый банк каждой стороны, ₽

// Светофор: размер ставки определяется цветом
export const TIERS = {
  green: { label: 'Зелёная', sum: 3000, odds: '1.6–2.5', note: 'надёжные события · одинары и экспресс из 2 (до ×3)' },
  yellow: { label: 'Жёлтая', sum: 1500, odds: '2.5–5.5', note: 'риск повыше · повышенные коэффициенты' },
  red: { label: 'Красная', sum: 500, odds: '6+', note: 'максимальный риск · волевые, точные счета, тройники' },
};
export const TIER_ORDER = ['green', 'yellow', 'red'];

export function stakeOf(b) {
  return TIERS[b.tier]?.sum ?? 0;
}

export function pl(b) {
  const s = stakeOf(b);
  if (b.status === 'win') return s * (b.odds - 1);
  if (b.status === 'lose') return -s;
  return 0;
}

export function fmtOdds(n) {
  return Number(n).toFixed(2);
}

const rub = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 });

export function money(n) {
  const v = Math.round(Number(n));
  const sign = v > 0 ? '+' : v < 0 ? '−' : '';
  return sign + rub.format(Math.abs(v)) + ' ₽';
}

export function rubFmt(n) {
  return rub.format(Math.round(Number(n))) + ' ₽';
}

export function aggregate(bets) {
  const settled = bets.filter((b) => b.status === 'win' || b.status === 'lose');
  const bal = bets.reduce((s, b) => s + pl(b), 0);
  const staked = settled.reduce((s, b) => s + stakeOf(b), 0);
  const wins = settled.filter((b) => b.status === 'win').length;
  const atStake = bets.filter((b) => b.status === 'pending').reduce((s, b) => s + stakeOf(b), 0);
  return {
    bal,
    bank: BANK0 + bal,
    roi: staked ? (bal / staked) * 100 : null,
    hit: settled.length ? Math.round((wins / settled.length) * 100) : null,
    wins,
    settled: settled.length,
    pending: bets.filter((b) => b.status === 'pending').length,
    atStake,
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
