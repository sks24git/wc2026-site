'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_LANG, LANGS, t as translate } from '@/lib/i18n';
import {
  BROWSER_TIMEZONE, resolveTimeZone, isValidTimeZone,
  fmtTime, zoneShort, dayLabel as fmtDayLabel,
} from '@/lib/datetime';

const LANG_KEY = 'wc2026_lang';
const TZ_KEY = 'wc2026_tz';

const LangCtx = createContext({ lang: DEFAULT_LANG, setLang: () => {} });
const TzCtx = createContext({ pref: BROWSER_TIMEZONE, setTz: () => {} });

function readQuery(name) {
  if (typeof window === 'undefined') return null;
  try {
    return new URLSearchParams(window.location.search).get(name);
  } catch {
    return null;
  }
}

function sanitizeTz(pref) {
  if (!pref || pref === BROWSER_TIMEZONE) return BROWSER_TIMEZONE;
  return isValidTimeZone(pref) ? pref : BROWSER_TIMEZONE;
}

export function Providers({ children }) {
  // Начальные значения = то, что в пререндер-HTML (ru / browser) → нет hydration-mismatch.
  const [lang, setLangState] = useState(DEFAULT_LANG);
  const [pref, setPrefState] = useState(BROWSER_TIMEZONE);

  // После маунта применяем ?lang / localStorage (один свап, без предупреждений гидрации).
  useEffect(() => {
    const q = readQuery('lang');
    const stored = (() => { try { return localStorage.getItem(LANG_KEY); } catch { return null; } })();
    const next = [q, stored].find((v) => LANGS.includes(v));
    if (next && next !== lang) setLangState(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const q = readQuery('tz');
    const stored = (() => { try { return localStorage.getItem(TZ_KEY); } catch { return null; } })();
    const candidate = q || stored;
    if (candidate) {
      const safe = sanitizeTz(candidate);
      if (safe !== pref) setPrefState(safe);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Держим <html lang> в актуальном состоянии.
  useEffect(() => {
    if (typeof document !== 'undefined') document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next) => {
    if (!LANGS.includes(next)) return;
    setLangState(next);
    try { localStorage.setItem(LANG_KEY, next); } catch {}
  }, []);

  const setTz = useCallback((next) => {
    const safe = sanitizeTz(next);
    setPrefState(safe);
    try { localStorage.setItem(TZ_KEY, safe); } catch {}
  }, []);

  const langValue = useMemo(() => ({ lang, setLang }), [lang, setLang]);
  const tzValue = useMemo(() => ({ pref, setTz }), [pref, setTz]);

  return (
    <LangCtx.Provider value={langValue}>
      <TzCtx.Provider value={tzValue}>{children}</TzCtx.Provider>
    </LangCtx.Provider>
  );
}

// ── Хуки ──
export function useLang() {
  return useContext(LangCtx).lang;
}
export function useSetLang() {
  return useContext(LangCtx).setLang;
}
export function useT() {
  const lang = useLang();
  return useCallback((key, vars) => translate(lang, key, vars), [lang]);
}
export function useTz() {
  return useContext(TzCtx);
}

// Реактивный форматтер времени, привязанный к языку и выбранной зоне.
export function useTimeFmt() {
  const lang = useLang();
  const { pref } = useTz();
  return useMemo(() => {
    const tz = resolveTimeZone(pref);
    return {
      lang,
      pref,
      tz,
      time: (instant) => fmtTime(instant, tz, lang),
      zoneShort: (instant) => zoneShort(instant, tz, lang),
      dayLabel: (dateStr) => fmtDayLabel(dateStr, lang),
    };
  }, [pref, lang]);
}
