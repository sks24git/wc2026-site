// Единая точка доступа к контенту (наша «база»). Всё живёт в /content как JSON + markdown.
import matches from '@/content/matches.json';
import bets from '@/content/bets.json';
import news from '@/content/news.json';
import facts from '@/content/facts.json';

export { matches, bets, news, facts };

export function getMatch(id) {
  return matches.find((m) => m.id === id) || null;
}

export function betsForMatch(id) {
  return bets.filter((b) => b.matchId === id);
}
