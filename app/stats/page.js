import { bets } from '@/data/bets';
import { aggregate, money, rubFmt, groupBy, pl, stakeOf, TIERS, TIER_ORDER } from '@/lib/calc';

export const metadata = { title: 'Статистика · ЧМ-26' };

const TIER_COLORS = { green: '#22a559', yellow: '#eab308', red: '#e0473a' };

function byDateId(a, b) {
  return a.date.localeCompare(b.date) || a.id - b.id;
}

/* ── Карточки счёта Паша / AI ── */
function ScoreCards() {
  const pasha = aggregate(bets.filter((b) => b.side === 'Паша'));
  const ai = aggregate(bets.filter((b) => b.side === 'AI'));
  const Card = ({ name, agg, cls }) => (
    <div className={'stat-card ' + cls}>
      <div className="who">{name}</div>
      <div className={'big ' + (agg.bal > 0 ? 'pos' : agg.bal < 0 ? 'neg' : '')}>{money(agg.bal)}</div>
      <div className="row"><span>Банк</span><span className="num">{rubFmt(agg.bank)}</span></div>
      <div className="row"><span>ROI</span><span className="num">{agg.roi === null ? '—' : (agg.roi > 0 ? '+' : '') + agg.roi.toFixed(0) + '%'}</span></div>
      <div className="row"><span>Зашло</span><span className="num">{agg.wins}/{agg.settled}{agg.pending ? ' · ' + agg.pending + ' в игре' : ''}</span></div>
    </div>
  );
  return (
    <div className="stat-cards">
      <Card name="Паша" agg={pasha} cls="pasha" />
      <Card name="AI" agg={ai} cls="ai" />
    </div>
  );
}

/* ── Двойной график банка ── */
function BankChart() {
  const settled = bets.filter((b) => b.status === 'win' || b.status === 'lose').sort(byDateId);
  if (settled.length === 0) return <p className="empty">Пока нет рассчитанных ставок</p>;
  let p = 0, a = 0;
  const P = [0], A = [0];
  for (const b of settled) {
    if (b.side === 'Паша') p += pl(b); else a += pl(b);
    P.push(p); A.push(a);
  }
  const W = 720, H = 200, PAD = 18;
  const all = [...P, ...A, 0];
  const min = Math.min(...all), max = Math.max(...all, 1);
  const x = (i) => PAD + ((W - 2 * PAD) * i) / (P.length - 1 || 1);
  const y = (v) => H - PAD - ((H - 2 * PAD) * (v - min)) / (max - min || 1);
  const path = (arr) => arr.map((v, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1)).join(' ');
  return (
    <div>
      <svg className="chart-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Банк Паши и AI по ходу турнира">
        <line x1={PAD} y1={y(0)} x2={W - PAD} y2={y(0)} stroke="#d6dade" strokeWidth="1" strokeDasharray="2 4" />
        <path d={path(A)} fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinejoin="round" />
        <path d={path(P)} fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx={x(P.length - 1)} cy={y(p)} r="4" fill="#d97706" />
        <circle cx={x(A.length - 1)} cy={y(a)} r="4" fill="#4f46e5" />
      </svg>
      <div className="chart-legend">
        <span><i style={{ background: '#d97706' }} />Паша <b className="num">{money(p)}</b></span>
        <span><i style={{ background: '#4f46e5' }} />AI <b className="num">{money(a)}</b></span>
      </div>
    </div>
  );
}

/* ── Светофор: карточки с win-rate баром ── */
function TierCards() {
  const g = groupBy(bets, (b) => b.tier);
  return (
    <div className="tiers">
      {TIER_ORDER.map((k) => {
        const v = g[k] || { n: 0, w: 0, pl: 0 };
        const wr = v.n ? Math.round((v.w / v.n) * 100) : 0;
        return (
          <div key={k} className="tiercard">
            <div className="tiercard-head">
              <span className={'tdot tier-' + k} aria-hidden="true" />
              <span className="tiercard-name">{TIERS[k].label}</span>
              <span className="tiercard-sum num">{rubFmt(TIERS[k].sum)}</span>
            </div>
            <div className={'tiercard-pl num ' + (v.pl > 0 ? 'pos' : v.pl < 0 ? 'neg' : '')}>{v.n ? money(v.pl) : '—'}</div>
            <div className="tiercard-meta">{v.n ? `зашло ${v.w}/${v.n} · ${wr}%` : 'нет рассчитанных'}</div>
            <div className="bar"><span className="bar-fill" style={{ width: wr + '%', background: TIER_COLORS[k] }} /></div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Рынки: диаграмма win-rate ── */
function MarketBars() {
  const g = groupBy(bets, (b) => b.type);
  const rows = Object.entries(g).sort((a, b) => b[1].n - a[1].n);
  if (rows.length === 0) return <p className="empty">Пока нет рассчитанных ставок</p>;
  return (
    <div className="market">
      {rows.map(([k, v]) => {
        const wr = Math.round((v.w / v.n) * 100);
        return (
          <div key={k} className="market-row">
            <div className="market-name">{k} <small>· {v.n}</small></div>
            <div className="market-bar"><i style={{ left: 0, width: wr + '%', background: wr >= 50 ? '#22a559' : '#e0473a' }} /></div>
            <div className={'market-pl num ' + (v.pl > 0 ? 'pos' : v.pl < 0 ? 'neg' : '')}>{money(v.pl)}</div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Хайлайты ── */
function Highlights() {
  const settled = bets.filter((b) => b.status === 'win' || b.status === 'lose');
  if (settled.length === 0) return null;
  const best = settled.reduce((m, b) => (pl(b) > pl(m) ? b : m), settled[0]);
  const worst = settled.reduce((m, b) => (pl(b) < pl(m) ? b : m), settled[0]);
  const Cell = ({ lbl, b }) => (
    <div className="hl">
      <div className="lbl">{lbl}</div>
      <div className={'v ' + (pl(b) > 0 ? 'pos' : 'neg')}>{money(pl(b))}</div>
      <div className="d">{b.bet} — {b.match}</div>
      <div className="d" style={{ color: 'var(--faint)' }}>{b.side} · кф {b.odds} · {rubFmt(stakeOf(b))}</div>
    </div>
  );
  return (
    <div className="highlights">
      <Cell lbl="Лучшая ставка" b={best} />
      <Cell lbl="Худшая ставка" b={worst} />
    </div>
  );
}

export default function StatsPage() {
  const agg = aggregate(bets);
  return (
    <div>
      <h1>Статистика</h1>

      <ScoreCards />

      <div className="sect"><span className="sect-label">Банк по ходу турнира</span></div>
      <section className="block"><BankChart /></section>

      <div className="sect"><span className="sect-label">Светофор</span></div>
      <section className="block"><TierCards /></section>

      <div className="sect"><span className="sect-label">По рынкам</span></div>
      <section className="block"><MarketBars /></section>

      <div className="sect"><span className="sect-label">Рекорды</span></div>
      <section className="block"><Highlights /></section>

      <p className="foot-note">Всего ставок: {bets.length} · рассчитано: {agg.settled} · в игре: {agg.pending}</p>
    </div>
  );
}
