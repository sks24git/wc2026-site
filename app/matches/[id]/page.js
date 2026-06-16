import { matches, getMatch, betsForMatch } from '@/lib/content';
import { readAnalysisBoth } from '@/lib/analysis';
import { L } from '@/lib/i18n';
import MatchView from '@/components/MatchView';

export function generateStaticParams() {
  return matches.map((m) => ({ id: m.id }));
}

export function generateMetadata({ params }) {
  const m = getMatch(params.id);
  return { title: (m ? L(m.title, 'ru') : 'Матч') + ' · ЧМ-26' };
}

export default function MatchPage({ params }) {
  const m = getMatch(params.id);
  if (!m) return null; // при static export несуществующий id отдаёт 404 от хостинга
  const linked = betsForMatch(m.id);
  const md = readAnalysisBoth(m.id);
  return <MatchView m={m} linked={linked} md={md} />;
}
