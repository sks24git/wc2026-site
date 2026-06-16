import { t } from '@/lib/i18n';
import { localeOf, dayLabel } from '@/lib/datetime';

// Стороны — это КЛЮЧИ данных ("Паша"/"AI"); отображение имени — через sideLabel() из i18n.
export const SIDES = ['Паша', 'AI'];
export const BANK0 = 100000; // стартовый банк каждой стороны, ₽

// Светофор: размер ставки определяется цветом. Подписи/заметки — двуязычные (i18n).
export const TIERS = {
  green: { sum: 3000, odds: '1.6–2.5' },
  yellow: { sum: 1500, odds: '2.5–5.5' },
  red: { sum: 500, odds: '6+' },
};
export const TIER_ORDER = ['green', 'yellow', 'red'];

export function tierLabel(tier, lang = 'ru') { return t(lang, 'tier.' + tier); }
export function tierNote(tier, lang = 'ru') { return t(lang, 'tier.' + tier + '.note'); }
export function statusLabel(status, lang = 'ru') { return t(lang, 'status.' + status); }

export function stakeOf(b) {
  // явная сумма (напр. конкурсные ставки Паши) важнее размера по тиру
  if (b.stake != null) return b.stake;
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

export function money(n, lang = 'ru') {
  const nf = new Intl.NumberFormat(localeOf(lang), { maximumFractionDigits: 0 });
  const v = Math.round(Number(n));
  const sign = v > 0 ? '+' : v < 0 ? '−' : '';
  return sign + nf.format(Math.abs(v)) + ' ₽';
}

export function rubFmt(n, lang = 'ru') {
  const nf = new Intl.NumberFormat(localeOf(lang), { maximumFractionDigits: 0 });
  return nf.format(Math.round(Number(n))) + ' ₽';
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

// Сводка по стороне для конкретного матча
export function sideTally(list) {
  const settled = list.filter((b) => b.status === 'win' || b.status === 'lose');
  const pending = list.filter((b) => b.status === 'pending');
  return {
    n: list.length,
    pl: list.reduce((s, b) => s + pl(b), 0),
    pendingN: pending.length,
    atStake: pending.reduce((s, b) => s + stakeOf(b), 0),
    anySettled: settled.length > 0,
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

// День матча (доменный, по МСК) с локализацией языка. tz-просмотр на день НЕ влияет.
export function formatDay(dateStr, lang = 'ru') {
  return dayLabel(dateStr, lang);
}
