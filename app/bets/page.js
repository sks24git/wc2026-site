import BattleBoard from '@/components/BattleBoard';
import BetsList from '@/components/BetsList';

export const metadata = { title: 'Ставки · ЧМ-26' };

export default function BetsPage() {
  return (
    <div>
      <h1 className="sr-only">Ставки</h1>
      <BattleBoard />
      <BetsList />
    </div>
  );
}
