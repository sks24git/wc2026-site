import Link from 'next/link';
import { buildCards } from '@/lib/cards';
import { money, formatDay } from '@/lib/calc';

// Горизонтальная лента мини-карт на главной — клик ведёт в листалку на эту карту.
export default function CardsStrip() {
  const cards = buildCards();
  return (
    <div className="strip">
      {cards.map((c) => {
        const cls = c.side === 'AI' ? 'ai' : 'pasha';
        const plClass = c.settled === 0 ? '' : c.pl > 0 ? 'pos' : c.pl < 0 ? 'neg' : '';
        return (
          <Link key={c.key} className={'minicard ' + cls} href={'/cards/#' + c.key}>
            <div className="mc-top">
              <span className={'mc-av ' + cls} aria-hidden="true">{c.side === 'AI' ? 'AI' : 'П'}</span>
              <span className="mc-date">{formatDay(c.date)}</span>
            </div>
            <div className={'mc-pl num ' + plClass}>{c.settled === 0 ? 'в игре' : money(c.pl)}</div>
            <div className="mc-meta">{c.settled ? `зашло ${c.wins}/${c.settled}` : `${c.pending} ст.`}</div>
          </Link>
        );
      })}
      <Link className="minicard more" href="/cards/">
        <span className="mc-more">Все карты →</span>
      </Link>
    </div>
  );
}
