import BetsList from '@/components/BetsList';

export const metadata = { title: 'Ставки · ЧМ-26' };

export default function BetsPage() {
  return (
    <div>
      <h1>Ставки</h1>
      <BetsList />
      <p className="foot-note">
        Новые ставки добавляются через чат с Владом — сайт обновляется в течение пары минут
      </p>
    </div>
  );
}
