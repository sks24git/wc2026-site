'use client';
import { bets } from '@/lib/content';
import { money, rubFmt, groupBy, pl, stakeOf, TIERS, TIER_ORDER, tierLabel, tierNote } from '@/lib/calc';
import { groupLabel, groupHint, hintFor, marketGroup } from '@/lib/glossary';
import { L, sideLabel } from '@/lib/i18n';
import { useLang, useT } from '@/app/providers';
import BattleBoard from '@/components/BattleBoard';
import Tip from '@/components/Tip';
import TierIcon from '@/components/TierIcon';

const TIER_COLORS = { green: '#22a559', yellow: '#eab308', red: '#e0473a' };
const PASHA = bets.filter((b) => b.side === 'Паша');
const AI = bets.filter((b) => b.side === 'AI');
const plCls = (v) => (v > 0 ? 'pos' : v < 0 ? 'neg' : '');

/* ── Кольцо заходимости (donut) с процентом в центре ── */
function WinRing({ w, n, size = 42 }) {
  const stroke = Math.max(4, Math.round(size / 9));
  const pct = n ? Math.round((w / n) * 100) : 0;
  const cx = size / 2;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const color = !n ? '#c9ced4' : pct >= 50 ? '#22a559' : pct >= 34 ? '#eab308' : '#e0473a';
  return (
    <svg className="winring" width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={n ? pct + '%' : '—'}>
      <circle cx={cx} cy={cx} r={r} fill="none" stroke="var(--hair)" strokeWidth={stroke} />
      {n > 0 && (
        <circle cx={cx} cy={cx} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={`${((pct / 100) * c).toFixed(1)} ${c.toFixed(1)}`} transform={`rotate(-90 ${cx} ${cx})`} />
      )}
      <text x={cx} y={cx} textAnchor="middle" dominantBaseline="central" className="winring-t" fill={n ? color : '#c9ced4'}>{n ? pct + '%' : '—'}</text>
    </svg>
  );
}

function byDateId(a, b) {
  return a.date.localeCompare(b.date) || a.id - b.id;
}

/* ── Двойной график банка ── */
function BankChart() {
  const lang = useLang();
  const T = useT();
  const settled = bets.filter((b) => b.status === 'win' || b.status === 'lose').sort(byDateId);
  if (settled.length === 0) return <p className="empty">{T('stats.noSettled')}</p>;
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
      <svg className="chart-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={T('a11y.bankChart')}>
        {ticks.map((v, i) => (
          <line key={i} x1={PAD} y1={y(v)} x2={W - PAD} y2={y(v)} stroke={v === 0 ? '#c9ced4' : '#edeff1'} strokeWidth="1" strokeDasharray={v === 0 ? '0' : '2 5'} />
        ))}
        <path d={path(A)} fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        <path d={path(P)} fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={x(P.length - 1)} cy={y(p)} r="4.5" fill="#d97706" />
        <circle cx={x(A.length - 1)} cy={y(a)} r="4.5" fill="#4f46e5" />
      </svg>
      <div className="chart-legend">
        <span><i style={{ background: '#d97706' }} />{sideLabel('Паша', lang)} <b className="num">{money(p, lang)}</b></span>
        <span><i style={{ background: '#4f46e5' }} />{sideLabel('AI', lang)} <b className="num">{money(a, lang)}</b></span>
      </div>
    </div>
  );
}

/* ── Две колонки: Паша | AI ── */
function Duo({ render }) {
  const lang = useLang();
  return (
    <div className="duo">
      <div className="duo-col pasha">
        <div className="duo-hd"><span className="mc-av pasha" aria-hidden="true">{lang === 'en' ? 'P' : 'П'}</span>{sideLabel('Паша', lang)}</div>
        {render(PASHA)}
      </div>
      <div className="duo-col ai">
        <div className="duo-hd"><span className="mc-av ai" aria-hidden="true">AI</span>{sideLabel('AI', lang)}</div>
        {render(AI)}
      </div>
    </div>
  );
}

/* ── Светофор одной стороны ── */
function TiersFor({ list }) {
  const lang = useLang();
  const T = useT();
  const g = groupBy(list, (b) => b.tier);
  return (
    <div className="tier-rows">
      {TIER_ORDER.map((k) => {
        const v = g[k] || { n: 0, w: 0, pl: 0 };
        return (
          <div key={k} className="tr">
            <WinRing w={v.w} n={v.n} size={44} />
            <TierIcon tier={k} size={14} lang={lang} />
            <Tip className="tr-nm" hint={`${T('stats.trafficLight')} · ${T('legend.odds')} ${TIERS[k].odds} · ${tierNote(k, lang)}`}>{tierLabel(k, lang)}</Tip>
            <span className="tr-wr num">{v.n ? v.w + '/' + v.n : '—'}</span>
            <span className={'tr-pl num ' + plCls(v.pl)}>{v.n ? money(v.pl, lang) : '—'}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ── По рынкам одной стороны ── */
function MarketsFor({ list }) {
  const lang = useLang();
  const T = useT();
  const g = groupBy(list, (b) => marketGroup(b));
  const rows = Object.entries(g).sort((a, b) => b[1].pl - a[1].pl);
  if (rows.length === 0) return <p className="empty sm">{T('stats.noSettledShort')}</p>;
  return (
    <div className="market">
      {rows.map(([k, v]) => (
        <div key={k} className="market-row">
          <div className="market-name"><Tip hint={groupHint(k, lang)}>{groupLabel(k, lang)}</Tip> <small>· {v.n}</small></div>
          <WinRing w={v.w} n={v.n} size={38} />
          <div className={'market-pl num ' + plCls(v.pl)}>{money(v.pl, lang)}</div>
        </div>
      ))}
    </div>
  );
}

/* ── Рекорды одной стороны ── */
function RecordsFor({ list }) {
  const lang = useLang();
  const T = useT();
  const settled = list.filter((b) => b.status === 'win' || b.status === 'lose');
  if (settled.length === 0) return <p className="empty sm">{T('stats.noSettledShort')}</p>;
  const best = settled.reduce((m, b) => (pl(b) > pl(m) ? b : m), settled[0]);
  const worst = settled.reduce((m, b) => (pl(b) < pl(m) ? b : m), settled[0]);
  const Cell = ({ lbl, b }) => (
    <div className="rec">
      <div className="rec-lbl">{lbl}</div>
      <div className={'rec-v num ' + plCls(pl(b))}>{money(pl(b), lang)}</div>
      <div className="rec-d"><Tip hint={hintFor(b, lang)}>{L(b.bet, lang)}</Tip> — {L(b.match, lang)}</div>
      {b.legs && (
        <div className="rec-legs">
          {b.legs.map((l, i) => (
            <div key={i} className="rec-leg">
              <span className="rec-leg-m">{L(l.m, lang)}</span>
              <span className="rec-leg-p num">{L(l.p, lang)}</span>
            </div>
          ))}
        </div>
      )}
      <div className="rec-sub">{T('legend.odds')} {b.odds} · {rubFmt(stakeOf(b), lang)}</div>
    </div>
  );
  return (
    <div className="records duo-rec">
      <Cell lbl={T('stats.best')} b={best} />
      <Cell lbl={T('stats.worst')} b={worst} />
    </div>
  );
}

export default function StatsView() {
  const T = useT();
  const settled = bets.filter((b) => b.status === 'win' || b.status === 'lose').length;
  const pending = bets.filter((b) => b.status === 'pending').length;
  return (
    <div>
      <h1>{T('stats.title')}</h1>

      <BattleBoard />

      <div className="sect"><span className="sect-label">{T('stats.bankOverTime')}</span></div>
      <section className="block"><BankChart /></section>

      <div className="sect"><span className="sect-label">{T('stats.trafficLight')}</span></div>
      <section className="block"><Duo render={(list) => <TiersFor list={list} />} /></section>

      <div className="sect"><span className="sect-label">{T('stats.byMarket')}</span></div>
      <section className="block"><Duo render={(list) => <MarketsFor list={list} />} /></section>

      <div className="sect"><span className="sect-label">{T('stats.records')}</span></div>
      <section className="block"><Duo render={(list) => <RecordsFor list={list} />} /></section>

      <p className="foot-note">{T('stats.total', { total: bets.length, settled, pending })}</p>
    </div>
  );
}
