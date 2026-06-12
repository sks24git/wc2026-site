import './globals.css';
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
  title: 'ЧМ-26 · Паша × Влад',
  description: 'Прогнозы, ставки и статистика чемпионата мира 2026',
};

export const viewport = {
  themeColor: '#0a0e0b',
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
            <span className="logo" translate="no">
              <span className="logo-num">ЧМ·26</span>
              <span className="logo-sub">Паша × Влад</span>
            </span>
            <Nav variant="top" />
          </div>
        </header>
        <main id="content">{children}</main>
        <Nav variant="bottom" />
      </body>
    </html>
  );
}
