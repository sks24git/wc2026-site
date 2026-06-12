import { news, NEWS_TAGS } from '@/data/news';

export default function NewsRail() {
  return (
    <aside className="news" aria-label="Лента инсайдов">
      <div className="news-head">
        <span className="news-live" aria-hidden="true" />
        <span className="sect-label" style={{ color: 'var(--ink)' }}>Лента</span>
      </div>
      <ol className="news-list">
        {news.map((n, i) => {
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
