import ScoreStrip from '@/components/ScoreStrip';
import BetsList from '@/components/BetsList';
import Heading from '@/components/Heading';

export const metadata = { title: 'Ставки · ЧМ-26' };

export default function BetsPage() {
  return (
    <div>
      <Heading tkey="nav.bets" className="sr-only" />
      <ScoreStrip />
      <BetsList />
    </div>
  );
}
