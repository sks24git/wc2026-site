'use client';
import { bets } from '@/lib/content';
import { money, rubFmt, groupBy, pl, stakeOf, TIERS, TIER_ORDER, tierLabel, tierNote } from '@/lib/calc';
import { groupLabel, groupHint, hintFor, marketGroup } from '@/lib/glossary';
import { L, sideLabel } from '@/lib/i18n';
import { useLang, useT } from '@/app/providers';
import ScoreStrip from '@/components/ScoreStrip';
import Tip from '@/components/Tip';
import TierIcon from '@/components/TierIcon';

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
  const color = !n ? 'var(--pending)' : pct >= 50 ? 'var(--win)' : pct >= 34 ? 'var(--tier-mid)' : 'var(--lose)';
  return (
    <svg className="winring" width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={n ? pct + '%' : '—'}>
      <circle cx={cx} cy={cx} r={r} fill="none" stroke="var(--hair)" strokeWidth={stroke} />
      {n > 0 && (
        <circle cx={cx} cy={cx} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="butt"
          strokeDasharray={`${((pct / 100) * c).toFixed(1)} ${c.toFixed(1)}`} transform={`rotate(-90 ${cx} ${cx})`} />
      )}
      <text x={cx} y={cx} textAnchor="middle" dominantBaseline="central" className="winring-t" fill={n ? color : 'var(--pending)'}>{n ? pct + '%' : '—'}</text>
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
  const tickFmt = (v) => Math.round(v).toLocaleString(lang === 'en' ? 'en-US' : 'ru-RU');
  return (
    <div className="chart-paste">
      <span className="scotch chart-sc1" aria-hidden="true" />
      <span className="scotch chart-sc2" aria-hidden="true" />
      <svg className="chart-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={T('a11y.bankChart')}>
        {ticks.map((v, i) => (
          <line key={i} x1={PAD} y1={y(v)} x2={W - PAD} y2={y(v)} stroke={v === 0 ? 'var(--hair-strong)' : 'var(--hair)'} strokeWidth="1" strokeDasharray={v === 0 ? '0' : '2 5'} />
        ))}
        {ticks.map((v, i) => (
          <text key={'t' + i} x={PAD + 3} y={y(v) - 4} className="chart-tick">{tickFmt(v)}</text>
        ))}
        <path d={path(A)} fill="none" stroke="var(--ai)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        <path d={path(P)} fill="none" stroke="var(--pasha)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        <rect x={x(P.length - 1) - 3.5} y={y(p) - 3.5} width="7" height="7" fill="var(--pasha)" />
        <rect x={x(A.length - 1) - 3.5} y={y(a) - 3.5} width="7" height="7" fill="var(--ai)" />
      </svg>
      <div className="chart-legend">
        <span className="cl-pasha"><i style={{ background: 'var(--pasha)' }} />{sideLabel('Паша', lang)} <b className="num">{money(p, lang)}</b></span>
        <span className="cl-ai"><i style={{ background: 'var(--ai)' }} />{sideLabel('AI', lang)} <b className="num">{money(a, lang)}</b></span>
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
        <div className="duo-hd"><span className="duo-plate pasha">{sideLabel('Паша', lang)}</span></div>
        {render(PASHA)}
      </div>
      <div className="duo-col ai">
        <div className="duo-hd"><span className="duo-plate ai">{sideLabel('AI', lang)}</span></div>
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
  const maxAbs = Math.max(...rows.map(([, v]) => Math.abs(v.pl)), 1);
  return (
    <div className="market">
      {rows.map(([k, v]) => (
        <div key={k} className="market-row">
          <div className="market-name"><Tip hint={groupHint(k, lang)}>{groupLabel(k, lang)}</Tip> <small>· {v.n}</small></div>
          <WinRing w={v.w} n={v.n} size={38} />
          <div className={'market-pl num ' + plCls(v.pl)}>{money(v.pl, lang)}</div>
          <div className="market-bar" aria-hidden="true">
            <i
              className={v.pl > 0 ? 'w' : v.pl < 0 ? 'l' : 'z'}
              style={{ width: Math.max(2, Math.round((Math.abs(v.pl) / maxAbs) * 100)) + '%' }}
            />
          </div>
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
      <div className="rec-vrow">
        <div className={'rec-v num ' + plCls(pl(b))}>{money(pl(b), lang)}</div>
        <span className={'stampword ' + (pl(b) >= 0 ? 'hit' : 'miss')}>{T(pl(b) >= 0 ? 'stamp.hit' : 'stamp.miss')}</span>
      </div>
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

      <ScoreStrip />

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
