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
      <svg viewBox="0 0 24 24" width="14" height="14">
        <path d="M12 6.4l3.2 2.3-1.2 3.8h-4L8.8 8.7 12 6.4z" fill="#fff" />
        <g stroke="#fff" strokeWidth="1.2" strokeLinecap="round">
          <path d="M12 6.4V3.6" /><path d="M15.2 8.7l2.6-.8" /><path d="M14 12.5l1.6 2.2" /><path d="M10 12.5l-1.6 2.2" /><path d="M8.8 8.7l-2.6-.8" />
        </g>
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
