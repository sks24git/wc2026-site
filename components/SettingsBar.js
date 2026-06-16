'use client';
import { useEffect, useRef, useState } from 'react';
import { useLang, useSetLang, useT, useTz } from '@/app/providers';
import { CURATED_TIMEZONES, BROWSER_TIMEZONE, detectBrowserTimeZone } from '@/lib/datetime';

// Переключатель языка + таймзоны по образцу ohMyGateway (Sidebar.tsx): 🌐 язык с флагами и ✓,
// 🕐 зона со списком зон и ✓. Лёгкие CSS-дропдауны (без Radix), стили в globals.css.

const LANG_OPTIONS = [
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open]);
  return { open, setOpen, ref };
}

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20" />
  </svg>
);
const ClockIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
  </svg>
);
const CheckIcon = () => (
  <svg className="dd-check" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export default function SettingsBar() {
  const t = useT();
  const lang = useLang();
  const setLang = useSetLang();
  const { pref, setTz } = useTz();
  const langDd = useDropdown();
  const tzDd = useDropdown();
  const browserZone = detectBrowserTimeZone();

  return (
    <div className="settings-bar">
      <div className="dd" ref={langDd.ref}>
        <button type="button" className="dd-btn" aria-label={t('settings.language')} aria-haspopup="menu" aria-expanded={langDd.open} onClick={() => langDd.setOpen((v) => !v)}>
          <GlobeIcon />
        </button>
        {langDd.open && (
          <div className="dd-menu" role="menu">
            {LANG_OPTIONS.map((o) => (
              <button key={o.code} type="button" role="menuitemradio" aria-checked={lang === o.code} className={'dd-item' + (lang === o.code ? ' on' : '')} onClick={() => { setLang(o.code); langDd.setOpen(false); }}>
                <span className="dd-flag" aria-hidden="true">{o.flag}</span>
                <span className="dd-label">{o.label}</span>
                {lang === o.code && <CheckIcon />}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="dd" ref={tzDd.ref}>
        <button type="button" className="dd-btn" aria-label={t('settings.timezone')} aria-haspopup="menu" aria-expanded={tzDd.open} onClick={() => tzDd.setOpen((v) => !v)}>
          <ClockIcon />
        </button>
        {tzDd.open && (
          <div className="dd-menu dd-menu-tz" role="menu">
            <div className="dd-head">{t('settings.timezone')}</div>
            <button type="button" role="menuitemradio" aria-checked={pref === BROWSER_TIMEZONE} className={'dd-item' + (pref === BROWSER_TIMEZONE ? ' on' : '')} onClick={() => { setTz(BROWSER_TIMEZONE); tzDd.setOpen(false); }}>
              <span className="dd-label">{t('settings.browserDefault')} ({browserZone})</span>
              {pref === BROWSER_TIMEZONE && <CheckIcon />}
            </button>
            {CURATED_TIMEZONES.map((z) => (
              <button key={z.value} type="button" role="menuitemradio" aria-checked={pref === z.value} className={'dd-item' + (pref === z.value ? ' on' : '')} onClick={() => { setTz(z.value); tzDd.setOpen(false); }}>
                <span className="dd-label">{z.label}</span>
                {pref === z.value && <CheckIcon />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
