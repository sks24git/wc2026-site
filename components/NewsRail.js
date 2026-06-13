import { news } from '@/lib/content';

const NEWS_TAGS = {
  lineup: { label: 'Состав', cls: 'lineup' },
  insight: { label: 'Инсайд', cls: 'insight' },
  pasha: { label: 'Паша', cls: 'pasha' },
  result: { label: 'Итог', cls: 'result' },
};

// Сортировка по времени (новые сверху) из строки вида "13.06 · 03:26"
function timeKey(t) {
  const m = String(t).match(/(\d{2})\.(\d{2}).*?(\d{2}):(\d{2})/);
  if (!m) return 0;
  const [, dd, mm, hh, mi] = m;
  return +mm * 1e6 + +dd * 1e4 + +hh * 100 + +mi;
}

export default function NewsRail() {
  return (
    <aside className="news" aria-label="Лента инсайдов">
      <div className="news-head">
        <span className="news-live" aria-hidden="true" />
        <span className="sect-label" style={{ color: 'var(--ink)' }}>Лента</span>
      </div>
      <ol className="news-list">
        {[...news].sort((a, b) => timeKey(b.time) - timeKey(a.time)).map((n, i) => {
          const tag = NEWS_TAGS[n.tag] || { label: n.tag, cls: 'insight' };
          return (
            <li key={i} className="news-item">
              <div className="news-meta">
                <span className={'news-tag ' + tag.cls}>{tag.label}</span>
                <time className="news-time num">{n.time}</time>
              </div>
              <p className="news-text">{n.text}</p>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
