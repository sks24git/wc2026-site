import './globals.css';
import { Manrope, JetBrains_Mono } from 'next/font/google';
import { Providers } from '@/app/providers';
import Masthead from '@/components/Masthead';
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

// Пред-гидрационно ставим <html lang> из сохранённого выбора (только атрибут, без подмены текста).
const langScript =
  "(function(){try{var l=localStorage.getItem('wc2026_lang');if(l==='ru'||l==='en')document.documentElement.lang=l;}catch(e){}})();";

export default function RootLayout({ children }) {
  return (
    <html lang="ru" suppressHydrationWarning className={`${manrope.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: langScript }} />
      </head>
      <body>
        <Providers>
          <Masthead />
          <main id="content">{children}</main>
          <Nav variant="bottom" />
        </Providers>
      </body>
    </html>
  );
}
