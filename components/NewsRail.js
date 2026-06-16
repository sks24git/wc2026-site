'use client';
import { news } from '@/lib/content';
import { L } from '@/lib/i18n';
import { useLang, useT } from '@/app/providers';

const NEWS_TAG_CLS = { lineup: 'lineup', insight: 'insight', pasha: 'pasha', result: 'result' };

// Сортировка по времени (новые сверху) из строки вида "13.06 · 06:25"
function timeKey(t) {
  const m = String(t).match(/(\d{2})\.(\d{2}).*?(\d{2}):(\d{2})/);
  if (!m) return 0;
  const [, dd, mm, hh, mi] = m;
  return +mm * 1e6 + +dd * 1e4 + +hh * 100 + +mi;
}

function Avatar({ pasha, lang }) {
  if (pasha) return <span className="news-av pasha" aria-hidden="true">{lang === 'en' ? 'P' : 'П'}</span>;
  return (
    <span className="news-av staff" aria-hidden="true">
      <svg viewBox="0 0 100 100" width="15" height="15">
        <polygon points="50,24 67.1,36.44 60.58,56.56 39.42,56.56 32.9,36.44" fill="#fff" stroke="#fff" strokeWidth="8" strokeLinejoin="round" />
        <path d="M 34 66 Q 50 80 66 66" fill="none" stroke="#fff" strokeWidth="7.5" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export default function NewsRail() {
  const lang = useLang();
  const T = useT();
  const sorted = [...news].sort((a, b) => timeKey(b.time) - timeKey(a.time));
  return (
    <aside className="news" aria-label={T('a11y.newsFeed')}>
      <div className="news-head">
        <span className="news-live" aria-hidden="true" />
        <span className="sect-label" style={{ color: 'var(--ink)' }}>{T('news.feed')}</span>
      </div>
      <ol className="news-list">
        {sorted.map((n, i) => {
          const cls = NEWS_TAG_CLS[n.tag] || 'insight';
          const isPasha = n.tag === 'pasha';
          return (
            <li key={i} className="news-item">
              <Avatar pasha={isPasha} lang={lang} />
              <div className="news-main">
                <div className="news-meta">
                  <span className="news-author">{isPasha ? T('news.tag.pasha') : T('news.author.staff')}</span>
                  <span className={'news-tag ' + cls}>{T('news.tag.' + n.tag)}</span>
                  <time className="news-time num">{n.time}</time>
                </div>
                <p className="news-text">{L(n.text, lang)}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
