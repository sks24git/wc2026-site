import { bets } from '@/lib/content';
import { money, rubFmt, groupBy, pl, stakeOf, TIERS, TIER_ORDER } from '@/lib/calc';
import { GROUP_HINTS, hintFor, marketGroup } from '@/lib/glossary';
import BattleBoard from '@/components/BattleBoard';
import Tip from '@/components/Tip';
import TierIcon from '@/components/TierIcon';

export const metadata = { title: 'Статистика · ЧМ-26' };

const TIER_COLORS = { green: '#22a559', yellow: '#eab308', red: '#e0473a' };
const PASHA = bets.filter((b) => b.side === 'Паша');
const AI = bets.filter((b) => b.side === 'AI');
const plCls = (v) => (v > 0 ? 'pos' : v < 0 ? 'neg' : '');

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

/* ── Две колонки: Паша | AI ── */
function Duo({ render }) {
  return (
    <div className="duo">
      <div className="duo-col pasha">
        <div className="duo-hd"><span className="mc-av pasha" aria-hidden="true">П</span>Паша</div>
        {render(PASHA)}
      </div>
      <div className="duo-col ai">
        <div className="duo-hd"><span className="mc-av ai" aria-hidden="true">AI</span>AI</div>
        {render(AI)}
      </div>
    </div>
  );
}

/* ── Светофор одной стороны: компактные строки ── */
function TiersFor({ list }) {
  const g = groupBy(list, (b) => b.tier);
  return (
    <div className="tier-rows">
      {TIER_ORDER.map((k) => {
        const v = g[k] || { n: 0, w: 0, pl: 0 };
        const wr = v.n ? Math.round((v.w / v.n) * 100) : 0;
        return (
          <div key={k} className="tr-wrap">
            <div className="tr">
              <TierIcon tier={k} size={15} />
              <Tip className="tr-nm" hint={'Светофор · кф ' + TIERS[k].odds + ' · ' + TIERS[k].note}>{TIERS[k].label}</Tip>
              <span className={'tr-pl num ' + plCls(v.pl)}>{v.n ? money(v.pl) : '—'}</span>
              <span className="tr-wr num">{v.n ? v.w + '/' + v.n : '—'}</span>
            </div>
            <div className="bar"><span className="bar-fill" style={{ width: wr + '%', background: TIER_COLORS[k] }} /></div>
          </div>
        );
      })}
    </div>
  );
}

/* ── По рынкам одной стороны ── */
function MarketsFor({ list }) {
  const g = groupBy(list, (b) => marketGroup(b));
  const rows = Object.entries(g).sort((a, b) => b[1].pl - a[1].pl);
  if (rows.length === 0) return <p className="empty sm">нет рассчитанных</p>;
  return (
    <div className="market">
      {rows.map(([k, v]) => {
        const wr = Math.round((v.w / v.n) * 100);
        return (
          <div key={k} className="market-row">
            <div className="market-name"><Tip hint={GROUP_HINTS[k]}>{k}</Tip> <small>· {v.n}</small></div>
            <div className="market-bar"><i style={{ left: 0, width: Math.max(wr, 3) + '%', background: wr >= 50 ? '#22a559' : '#e0473a' }} /></div>
            <div className={'market-pl num ' + plCls(v.pl)}>{money(v.pl)}</div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Рекорды одной стороны: лучшая / худшая ── */
function RecordsFor({ list }) {
  const settled = list.filter((b) => b.status === 'win' || b.status === 'lose');
  if (settled.length === 0) return <p className="empty sm">нет рассчитанных</p>;
  const best = settled.reduce((m, b) => (pl(b) > pl(m) ? b : m), settled[0]);
  const worst = settled.reduce((m, b) => (pl(b) < pl(m) ? b : m), settled[0]);
  const Cell = ({ lbl, b }) => (
    <div className="rec">
      <div className="rec-lbl">{lbl}</div>
      <div className={'rec-v num ' + plCls(pl(b))}>{money(pl(b))}</div>
      <div className="rec-d"><Tip hint={hintFor(b)}>{b.bet}</Tip> — {b.match}</div>
      <div className="rec-sub">кф {b.odds} · {rubFmt(stakeOf(b))}</div>
    </div>
  );
  return (
    <div className="records duo-rec">
      <Cell lbl="Лучшая" b={best} />
      <Cell lbl="Худшая" b={worst} />
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
      <section className="block"><Duo render={(list) => <TiersFor list={list} />} /></section>

      <div className="sect"><span className="sect-label">По рынкам</span></div>
      <section className="block"><Duo render={(list) => <MarketsFor list={list} />} /></section>

      <div className="sect"><span className="sect-label">Рекорды</span></div>
      <section className="block"><Duo render={(list) => <RecordsFor list={list} />} /></section>

      <p className="foot-note">Всего ставок: {bets.length} · рассчитано: {settled} · в игре: {pending}</p>
    </div>
  );
}
