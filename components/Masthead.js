'use client';
import Link from 'next/link';
import { useT } from '@/app/providers';
import Nav from '@/components/Nav';
import SettingsBar from '@/components/SettingsBar';

// Шапка-колонтитул альбома: двойные линейки, вордмарк по центру,
// настройки рядом, под ними — закладки-навигация.
export default function Masthead() {
  const t = useT();
  return (
    <>
      <a className="skip-link" href="#content">{t('a11y.toContent')}</a>
      <header className="masthead">
        <div className="runhead">
          <Link className="logo" href="/" translate="no" aria-label={t('a11y.homeLink')}>
            <span className="logo-num">{t('album.runhead')}</span>
          </Link>
          <SettingsBar />
        </div>
        <Nav variant="top" />
      </header>
    </>
  );
}
