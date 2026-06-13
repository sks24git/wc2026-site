import './globals.css';
import Link from 'next/link';
import { Manrope, JetBrains_Mono } from 'next/font/google';
import Nav from '@/components/Nav';

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-ui',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  weight: ['500', '700'],
  variable: '--font-num',
  display: 'swap',
});

export const metadata = {
  title: { default: 'ЧМ-26 · Паша vs AI', template: '%s' },
  description: 'Прогнозы, ставки и статистика чемпионата мира 2026 — батл Паша vs AI',
};

export const viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={`${manrope.variable} ${mono.variable}`}>
      <body>
        <a className="skip-link" href="#content">К содержимому</a>
        <header className="masthead">
          <div className="masthead-in">
            <Link className="logo" href="/" translate="no" aria-label="ЧМ-26 · на главную">
              <span className="logo-mark" aria-hidden="true">
                <svg viewBox="0 0 100 100" width="28" height="28">
                  <rect width="100" height="100" rx="24" fill="#10131A" />
                  <polygon points="50,30 61.42,38.30 57.06,51.72 42.94,51.72 38.58,38.30" fill="#fff" stroke="#fff" strokeWidth="6.5" strokeLinejoin="round" />
                  <path d="M 37 65 Q 50 76 63 65" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
                </svg>
              </span>
              <span className="logo-text">
                <span className="logo-num">ЧМ·26</span>
                <span className="logo-sub">Паша vs AI</span>
              </span>
            </Link>
            <Nav variant="top" />
          </div>
        </header>
        <main id="content">{children}</main>
        <Nav variant="bottom" />
      </body>
    </html>
  );
}
