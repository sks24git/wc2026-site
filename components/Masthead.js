'use client';
import Link from 'next/link';
import { useT } from '@/app/providers';
import Nav from '@/components/Nav';
import SettingsBar from '@/components/SettingsBar';

export default function Masthead() {
  const t = useT();
  return (
    <>
      <a className="skip-link" href="#content">{t('a11y.toContent')}</a>
      <header className="masthead">
        <div className="masthead-in">
          <Link className="logo" href="/" translate="no" aria-label={t('a11y.homeLink')}>
            <span className="logo-mark" aria-hidden="true">
              <svg viewBox="0 0 100 100" width="28" height="28">
                <rect width="100" height="100" rx="24" fill="#10131A" />
                <polygon points="50,30 61.42,38.30 57.06,51.72 42.94,51.72 38.58,38.30" fill="#fff" stroke="#fff" strokeWidth="6.5" strokeLinejoin="round" />
                <path d="M 37 65 Q 50 76 63 65" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
              </svg>
            </span>
            <span className="logo-text">
              <span className="logo-num">{t('brand.logo')}</span>
              <span className="logo-sub">{t('brand.subtitle')}</span>
            </span>
          </Link>
          <div className="masthead-right">
            <Nav variant="top" />
            <SettingsBar />
          </div>
        </div>
      </header>
    </>
  );
}
