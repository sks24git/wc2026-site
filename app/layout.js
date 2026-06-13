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
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <rect width="24" height="24" rx="6" fill="#15803d" />
                  <path d="M12 6.4l3.2 2.3-1.2 3.8h-4L8.8 8.7 12 6.4z" fill="#fff" />
                  <g stroke="#fff" strokeWidth="1.25" strokeLinecap="round">
                    <path d="M12 6.4V3.3" /><path d="M15.2 8.7l2.9-.9" /><path d="M14 12.5l1.8 2.5" /><path d="M10 12.5l-1.8 2.5" /><path d="M8.8 8.7l-2.9-.9" />
                  </g>
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
