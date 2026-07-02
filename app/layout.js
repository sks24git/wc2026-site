import './globals.css';
import { Providers } from '@/app/providers';
import Masthead from '@/components/Masthead';
import Nav from '@/components/Nav';

// Дизайн-система «АЛЬБОМ»: сайт = разворот коллекционного альбома дуэли.
// Шрифты (Google Fonts, кириллица): Golos Text — текст; Oswald — капсы и
// плашки наклеек; JetBrains Mono — «машинное»; Caveat — рукописные пометки.
const FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Golos+Text:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&family=Oswald:wght@500;600;700&display=swap';

export const metadata = {
  title: { default: 'ЧМ-26 · Паша vs AI', template: '%s' },
  description: 'Прогнозы, ставки и статистика чемпионата мира 2026 — батл Паша vs AI',
};

export const viewport = {
  themeColor: '#463c2f',
  width: 'device-width',
  initialScale: 1,
};

// Пред-гидрационно ставим <html lang> из сохранённого выбора (только атрибут, без подмены текста).
const langScript =
  "(function(){try{var l=localStorage.getItem('wc2026_lang');if(l==='ru'||l==='en')document.documentElement.lang=l;}catch(e){}})();";

export default function RootLayout({ children }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={FONTS_URL} />
        <script dangerouslySetInnerHTML={{ __html: langScript }} />
      </head>
      <body>
        <Providers>
          <div className="desk">
            <div className="spread">
              <span className="gutter" aria-hidden="true" />
              <Masthead />
              <main id="content">{children}</main>
            </div>
          </div>
          <Nav variant="bottom" />
        </Providers>
      </body>
    </html>
  );
}
