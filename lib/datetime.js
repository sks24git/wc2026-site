// Время и таймзоны — чистые функции (по образцу ohMyGateway/date-formatting.ts).
// Хранение времени матча: `date` (YYYY-MM-DD) + `timeMsk` (ЧЧ:ММ по Москве, фикс. UTC+3, без DST).
// Из них строим абсолютный инстант, а отображаем уже в выбранной зоне. Реактивный
// хук useTimeFmt() — в app/providers.js (берёт язык и зону из контекста).

export const BROWSER_TIMEZONE = 'browser';

// Короткий курируемый список зон (как в образце) — не весь IANA-набор.
export const CURATED_TIMEZONES = [
  { value: 'UTC', label: 'UTC' },
  { value: 'Europe/London', label: 'London' },
  { value: 'Europe/Berlin', label: 'Berlin' },
  { value: 'Europe/Moscow', label: 'Moscow' },
  { value: 'Asia/Dubai', label: 'Dubai' },
  { value: 'Asia/Almaty', label: 'Almaty' },
  { value: 'Asia/Shanghai', label: 'Shanghai' },
  { value: 'Asia/Tokyo', label: 'Tokyo' },
  { value: 'America/New_York', label: 'New York' },
  { value: 'America/Los_Angeles', label: 'Los Angeles' },
];

export function localeOf(lang) {
  return lang === 'en' ? 'en-GB' : 'ru-RU';
}

// Абсолютный инстант старта матча (epoch ms). Москва = UTC+3 круглый год.
// `date` — ДОМЕННЫЙ ДЕНЬ по Тихоокеанскому времени США (лето = PDT = UTC-7), чтобы
// ночной слейт целиком попадал в один день. Полночь PT = 10:00 МСК, поэтому матч с
// московским временем < 10:00 приходится на СЛЕДУЮЩИЙ календарный день по Москве.
export function kickoffInstant(dateStr, timeMsk) {
  const [Y, M, D] = String(dateStr).split('-').map(Number);
  const [h, mn] = String(timeMsk || '12:00').split(':').map(Number);
  const moscowDayShift = h < 10 ? 1 : 0;
  return Date.UTC(Y, M - 1, D + moscowDayShift, h - 3, mn);
}

// Intl принимает зону?
export function isValidTimeZone(tz) {
  if (!tz) return false;
  try {
    new Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

// Собственная зона браузера, напр. 'Europe/Moscow'. Фолбэк 'UTC'.
export function detectBrowserTimeZone() {
  try {
    return new Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

// Префы → значение для Intl (undefined = зона браузера). Невалидное → undefined.
export function resolveTimeZone(pref) {
  if (!pref || pref === BROWSER_TIMEZONE) return undefined;
  return isValidTimeZone(pref) ? pref : undefined;
}

// Время старта в выбранной зоне, 24ч. tz === undefined → зона браузера.
export function fmtTime(instant, tz, lang = 'ru') {
  return new Intl.DateTimeFormat(localeOf(lang), {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(instant);
}

// Короткая метка зоны для подписи после времени (напр. 'GMT+3', 'EDT'). Автоучёт DST.
export function zoneShort(instant, tz, lang = 'ru') {
  const parts = new Intl.DateTimeFormat(localeOf(lang), {
    timeZone: tz,
    hour: '2-digit',
    timeZoneName: 'short',
  }).formatToParts(instant);
  return parts.find((p) => p.type === 'timeZoneName')?.value || '';
}

// Метка дня (доменный день по Тихоокеанскому времени США — не сдвигается зоной просмотра, локализуется только язык).
const DAY_OPTS = { weekday: 'short', day: 'numeric', month: 'long', timeZone: 'UTC' };
export function dayLabel(dateStr, lang = 'ru') {
  return new Intl.DateTimeFormat(localeOf(lang), DAY_OPTS).format(new Date(dateStr + 'T12:00:00Z'));
}
