import { bets } from '@/data/bets';
import { aggregate, money, rubFmt, groupBy, pl, TIERS } from '@/lib/calc';

export const metadata = { title: 'Статистика · ЧМ-26' };

function Breakdown({ title, data, labelMap }) {
  const entries = Object.entries(data).sort((a, b) => b[1].n - a[1].n);
  return (
    <>
      <div className="sect"><span className="sect-label">{title}</span></div>
      <section className="block" aria-label={title}>
        {entries.length === 0 ? <p className="empty">Пока нет рассчитанных ставок</p> : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Категория</th><th className="num">Ставок</th><th className="num">Зашло</th><th className="num">%</th><th className="num">P/L</th></tr>
              </thead>
              <tbody>
                {entries.map(([k, v]) => (
                  <tr key={k}>
                    <td>{labelMap ? labelMap(k) : k}</td>
                    <td className="num">{v.n}</td>
                    <td className="num">{v.w}</td>
                    <td className="num">{Math.round((v.w / v.n) * 100)}%</td>
                    <td className={'num ' + (v.pl > 0 ? 'pos' : v.pl < 0 ? 'neg' : '')}>{money(v.pl)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

function BalanceChart({ list }) {
  const settled = list
    .filter((b) => b.status !== 'pending')
    .sort((a, b) => a.date.localeCompare(b.date) || a.id - b.id);
  if (settled.length === 0) return <p className="empty">Пока нет рассчитанных ставок</p>;

  let cum = 0;
  const pts = [0, ...settled.map((b) => (cum += pl(b)))];
  const W = 720, H = 180, P = 16;
  const min = Math.min(...pts, 0);
  const max = Math.max(...pts, 0.01);
  const x = (i) => P + ((W - 2 * P) * i) / (pts.length - 1 || 1);
  const y = (v) => H - P - ((H - 2 * P) * (v - min)) / (max - min || 1);
  const line = pts.map((v, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1)).join(' ');
  const area = line + ` L ${x(pts.length - 1).toFixed(1)} ${y(0).toFixed(1)} L ${x(0).toFixed(1)} ${y(0).toFixed(1)} Z`;

  return (
    <svg className="chart-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={'График баланса, текущее значение ' + money(cum)}>
      <defs>
        <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#15803d" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#15803d" stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1={P} y1={y(0)} x2={W - P} y2={y(0)} stroke="#d6dade" strokeWidth="1" strokeDasharray="2 4" />
      <path d={area} fill="url(#fill)" />
      <path d={line} fill="none" stroke={cum >= 0 ? '#15803d' : '#d2402c'} strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx={x(pts.length - 1)} cy={y(cum)} r="4" fill={cum >= 0 ? '#15803d' : '#d2402c'} />
      <text x={Math.min(x(pts.length - 1) + 8, W - 96)} y={y(cum) - 10} fill="#15181c" fontSize="13" fontFamily="monospace">{money(cum)}</text>
    </svg>
  );
}

export default function StatsPage() {
  const agg = aggregate(bets);
  return (
    <div>
      <h1>Статистика</h1>
      <section className="hero" style={{ paddingTop: 4 }} aria-label="Сводка">
        <div className="hero-row" style={{ marginTop: 6 }}>
          <div className="hero-stat"><div className="lbl">Итог</div><div className={'v ' + (agg.bal > 0 ? 'pos' : agg.bal < 0 ? 'neg' : '')}>{money(agg.bal)}</div></div>
          <div className="hero-stat"><div className="lbl">Оборот</div><div className="v">{rubFmt(agg.atStake)}{' '}в игре</div></div>
          <div className="hero-stat"><div className="lbl">ROI</div><div className={'v ' + (agg.bal > 0 ? 'pos' : agg.bal < 0 ? 'neg' : '')}>{agg.roi === null ? '—' : (agg.roi > 0 ? '+' : '') + agg.roi.toFixed(0) + '%'}</div></div>
          <div className="hero-stat"><div className="lbl">Заход</div><div className="v">{agg.hit === null ? '—' : agg.hit + '% (' + agg.wins + '/' + agg.settled + ')'}</div></div>
        </div>
      </section>

      <div className="sect"><span className="sect-label">Динамика банка</span></div>
      <section className="block" aria-label="Динамика банка">
        <BalanceChart list={bets} />
      </section>

      <Breakdown title="Паша vs AI" data={groupBy(bets, (b) => b.side)} />
      <Breakdown title="Светофор" data={groupBy(bets, (b) => b.tier)} labelMap={(k) => (TIERS[k] ? TIERS[k].label : k)} />
      <Breakdown title="По типам рынков" data={groupBy(bets, (b) => b.type)} />
    </div>
  );
}
