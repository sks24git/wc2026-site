import { news } from '@/lib/content';

const NEWS_TAGS = {
  lineup: { label: 'Состав', cls: 'lineup' },
  insight: { label: 'Инсайд', cls: 'insight' },
  pasha: { label: 'Паша', cls: 'pasha' },
  result: { label: 'Итог', cls: 'result' },
};

// Сортировка по времени (новые сверху) из строки вида "13.06 · 06:25"
function timeKey(t) {
  const m = String(t).match(/(\d{2})\.(\d{2}).*?(\d{2}):(\d{2})/);
  if (!m) return 0;
  const [, dd, mm, hh, mi] = m;
  return +mm * 1e6 + +dd * 1e4 + +hh * 100 + +mi;
}

function Avatar({ pasha }) {
  if (pasha) return <span className="news-av pasha" aria-hidden="true">П</span>;
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
  const sorted = [...news].sort((a, b) => timeKey(b.time) - timeKey(a.time));
  return (
    <aside className="news" aria-label="Лента инсайдов">
      <div className="news-head">
        <span className="news-live" aria-hidden="true" />
        <span className="sect-label" style={{ color: 'var(--ink)' }}>Лента</span>
      </div>
      <ol className="news-list">
        {sorted.map((n, i) => {
          const tag = NEWS_TAGS[n.tag] || { label: n.tag, cls: 'insight' };
          const isPasha = n.tag === 'pasha';
          return (
            <li key={i} className="news-item">
              <Avatar pasha={isPasha} />
              <div className="news-main">
                <div className="news-meta">
                  <span className="news-author">{isPasha ? 'Паша' : 'Штаб'}</span>
                  <span className={'news-tag ' + tag.cls}>{tag.label}</span>
                  <time className="news-time num">{n.time}</time>
                </div>
                <p className="news-text">{n.text}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
