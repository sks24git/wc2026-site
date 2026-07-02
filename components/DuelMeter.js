// Duel Meter — фирменная полоса-перетягивание «Паша vs AI».
// Делит трек по доле банка (или любых двух величин), клэмп 15–85%,
// чтобы разгром не стирал сторону. Чисто декоративный (данные — в тексте).
export default function DuelMeter({ a, b, className = '' }) {
  const total = Number(a) + Number(b);
  const share = total > 0 ? Math.min(0.85, Math.max(0.15, Number(a) / total)) : 0.5;
  return (
    <div className={'meter' + (className ? ' ' + className : '')} aria-hidden="true">
      <i className="meter-a" style={{ width: (share * 100).toFixed(2) + '%' }} />
      <i className="meter-b" />
    </div>
  );
}
