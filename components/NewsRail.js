'use client';
import { news } from '@/lib/content';
import { L } from '@/lib/i18n';
import { useLang, useT } from '@/app/providers';
import Emph from '@/components/Emph';

const NEWS_TAG_CLS = { lineup: 'lineup', insight: 'insight', pasha: 'pasha', result: 'result' };

// Сортировка по времени (новые сверху) из строки вида "13.06 · 06:25"
function timeKey(t) {
  const m = String(t).match(/(\d{2})\.(\d{2}).*?(\d{2}):(\d{2})/);
  if (!m) return 0;
  const [, dd, mm, hh, mi] = m;
  return +mm * 1e6 + +dd * 1e4 + +hh * 100 + +mi;
}

// Лента — «полевые заметки» на полях альбома: записи штаба = печатные
// подклеенные полоски, записи Паши = рукописные обрывки.
export default function NewsRail() {
  const lang = useLang();
  const T = useT();
  const sorted = [...news].sort((a, b) => timeKey(b.time) - timeKey(a.time));
  return (
    <aside className="news" aria-label={T('a11y.newsFeed')}>
      <div className="news-head">
        <span className="news-live" aria-hidden="true" />
        <span className="sect-label">{T('news.feed')}</span>
      </div>
      <ol className="news-list">
        {sorted.map((n, i) => {
          const cls = NEWS_TAG_CLS[n.tag] || 'insight';
          const isPasha = n.tag === 'pasha';
          return (
            <li key={i} className="news-item">
              <div className={'news-note' + (isPasha ? ' pasha' : '')}>
                <div className="news-meta">
                  <span className="news-author">{isPasha ? T('news.tag.pasha') : T('news.author.staff')}</span>
                  {!isPasha && <span className={'news-tag ' + cls}>{T('news.tag.' + n.tag)}</span>}
                  <time className="news-time num">{n.time}</time>
                </div>
                <p className="news-text"><Emph text={L(n.text, lang)} /></p>
              </div>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
