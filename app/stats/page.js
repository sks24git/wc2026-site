import { bets } from '@/data/bets';
import { money, rubFmt, groupBy, pl, stakeOf, TIERS, TIER_ORDER } from '@/lib/calc';
import { TYPE_HINTS, hintFor } from '@/lib/glossary';
import BattleBoard from '@/components/BattleBoard';
import Tip from '@/components/Tip';

export const metadata = { title: 'Статистика · ЧМ-26' };

const TIER_COLORS = { green: '#22a559', yellow: '#eab308', red: '#e0473a' };

function byDateId(a, b) {
  return a.date.localeCompare(b.date) || a.id - b.id;
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
  const W = 720, H = 210, PAD = 18;
  const all = [...P, ...A, 0];
  const min = Math.min(...all), max = Math.max(...all, 1);
  const x = (i) => PAD + ((W - 2 * PAD) * i) / (P.length - 1 || 1);
  const y = (v) => H - PAD - ((H - 2 * PAD) * (v - min)) / (max - min || 1);
  const path = (arr) => arr.map((v, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1)).join(' ');
  // редкие горизонтальные ориентиры
  const ticks = [min, (min + max) / 2, max].filter((v, i, arr) => arr.indexOf(v) === i);
  return (
    <div>
      <svg className="chart-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Банк Паши и AI по ходу турнира">
        {ticks.map((v, i) => (
          <line key={i} x1={PAD} y1={y(v)} x2={W - PAD} y2={y(v)} stroke={v === 0 ? '#c9ced4' : '#edeff1'} strokeWidth="1" strokeDasharray={v === 0 ? '0' : '2 5'} />
        ))}
        <path d={path(A)} fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        <path d={path(P)} fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={x(P.length - 1)} cy={y(p)} r="4.5" fill="#d97706" />
        <circle cx={x(A.length - 1)} cy={y(a)} r="4.5" fill="#4f46e5" />
      </svg>
      <div className="chart-legend">
        <span><i style={{ background: '#d97706' }} />Паша <b className="num">{money(p)}</b></span>
        <span><i style={{ background: '#4f46e5' }} />AI <b className="num">{money(a)}</b></span>
      </div>
    </div>
  );
}

/* ── Светофор: безрамочные колонки ── */
function Tiers() {
  const g = groupBy(bets, (b) => b.tier);
  return (
    <div className="tiers">
      {TIER_ORDER.map((k) => {
        const v = g[k] || { n: 0, w: 0, pl: 0 };
        const wr = v.n ? Math.round((v.w / v.n) * 100) : 0;
        return (
          <div key={k} className="tier-col">
            <div className="tier-top">
              <span className={'tdot tier-' + k} aria-hidden="true" />
              <Tip className="tier-nm" hint={'Светофор · кф ' + TIERS[k].odds + ' · ' + TIERS[k].note}>{TIERS[k].label}</Tip>
              <span className="tier-sum num">{rubFmt(TIERS[k].sum)}</span>
            </div>
            <div className={'tier-pl num ' + (v.pl > 0 ? 'pos' : v.pl < 0 ? 'neg' : '')}>{v.n ? money(v.pl) : '—'}</div>
            <div className="tier-meta">{v.n ? `зашло ${v.w}/${v.n} · ${wr}%` : 'нет рассчитанных'}</div>
            <div className="bar"><span className="bar-fill" style={{ width: wr + '%', background: TIER_COLORS[k] }} /></div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Рынки: диаграмма заходимости ── */
function MarketBars() {
  const g = groupBy(bets, (b) => b.type);
  const rows = Object.entries(g).sort((a, b) => b[1].pl - a[1].pl);
  if (rows.length === 0) return <p className="empty">Пока нет рассчитанных ставок</p>;
  return (
    <div className="market">
      {rows.map(([k, v]) => {
        const wr = Math.round((v.w / v.n) * 100);
        return (
          <div key={k} className="market-row">
            <div className="market-name"><Tip hint={TYPE_HINTS[k]}>{k}</Tip> <small>· {v.n}</small></div>
            <div className="market-bar"><i style={{ left: 0, width: Math.max(wr, 3) + '%', background: wr >= 50 ? '#22a559' : '#e0473a' }} /></div>
            <div className={'market-pl num ' + (v.pl > 0 ? 'pos' : v.pl < 0 ? 'neg' : '')}>{money(v.pl)}</div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Рекорды: безрамочные колонки ── */
function Records() {
  const settled = bets.filter((b) => b.status === 'win' || b.status === 'lose');
  if (settled.length === 0) return null;
  const best = settled.reduce((m, b) => (pl(b) > pl(m) ? b : m), settled[0]);
  const worst = settled.reduce((m, b) => (pl(b) < pl(m) ? b : m), settled[0]);
  const Cell = ({ lbl, b }) => (
    <div className="rec">
      <div className="rec-lbl">{lbl}</div>
      <div className={'rec-v num ' + (pl(b) > 0 ? 'pos' : 'neg')}>{money(pl(b))}</div>
      <div className="rec-d"><Tip hint={hintFor(b)}>{b.bet}</Tip> — {b.match}</div>
      <div className="rec-sub">{b.side} · кф {b.odds} · {rubFmt(stakeOf(b))}</div>
    </div>
  );
  return (
    <div className="records">
      <Cell lbl="Лучшая ставка" b={best} />
      <Cell lbl="Худшая ставка" b={worst} />
    </div>
  );
}

export default function StatsPage() {
  const settled = bets.filter((b) => b.status === 'win' || b.status === 'lose').length;
  const pending = bets.filter((b) => b.status === 'pending').length;
  return (
    <div>
      <h1>Статистика</h1>

      <BattleBoard />

      <div className="sect"><span className="sect-label">Банк по ходу турнира</span></div>
      <section className="block"><BankChart /></section>

      <div className="sect"><span className="sect-label">Светофор</span></div>
      <section className="block"><Tiers /></section>

      <div className="sect"><span className="sect-label">По рынкам</span></div>
      <section className="block"><MarketBars /></section>

      <div className="sect"><span className="sect-label">Рекорды</span></div>
      <section className="block"><Records /></section>

      <p className="foot-note">Всего ставок: {bets.length} · рассчитано: {settled} · в игре: {pending}</p>
    </div>
  );
}
