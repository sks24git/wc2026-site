'use client';
import { useState } from 'react';
import Link from 'next/link';
import { bets, matches } from '@/lib/content';
import { pl, money, formatDay, sideTally } from '@/lib/calc';
import { TYPE_HINTS } from '@/lib/glossary';
import Ticket from '@/components/Ticket';
import Legend from '@/components/Legend';
import Flags from '@/components/Flags';
import Tip from '@/components/Tip';

const GROUPS = [
  { key: 'match', label: 'По матчам' },
  { key: 'day', label: 'По дням' },
  { key: 'type', label: 'По рынкам' },
];
const SIDES = [
  { key: 'all', label: 'Все' },
  { key: 'Паша', label: 'Паша' },
  { key: 'AI', label: 'AI' },
];

function matchMeta(id) {
  return matches.find((m) => m.id === id) || null;
}

// строка «Паша +X · AI −Y» по списку ставок
function VsLine({ list }) {
  const p = sideTally(list.filter((b) => b.side === 'Паша'));
  const a = sideTally(list.filter((b) => b.side === 'AI'));
  const Part = ({ side, t }) => {
    if (!t || t.n === 0) return null;
    const settled = !t.pendingN || t.anySettled;
    return (
      <span className={'vs-part ' + (side === 'Паша' ? 'pasha' : 'ai')}>
        <span className="vs-who">{side}</span>
        <span className={'vs-val num ' + (settled ? (t.pl > 0 ? 'pos' : t.pl < 0 ? 'neg' : '') : 'idle')}>
          {t.pendingN && !t.anySettled ? 'в игре' : money(t.pl)}
        </span>
      </span>
    );
  };
  return (
    <span className="vs-line">
      <Part side="Паша" t={p} />
      {p.n > 0 && a.n > 0 && <span className="vs-x">vs</span>}
      <Part side="AI" t={a} />
    </span>
  );
}

export default function BetsList() {
  const [group, setGroup] = useState('match');
  const [side, setSide] = useState('all');

  const view = side === 'all' ? bets : bets.filter((b) => b.side === side);

  return (
    <div>
      <Legend />

      <div className="controls">
        <div className="seg" role="group" aria-label="Группировка">
          {GROUPS.map((g) => (
            <button key={g.key} className={'seg-btn' + (group === g.key ? ' on' : '')} aria-pressed={group === g.key} onClick={() => setGroup(g.key)}>
              {g.label}
            </button>
          ))}
        </div>
        <div className="seg sides" role="group" aria-label="Сторона">
          {SIDES.map((s) => (
            <button key={s.key} className={'seg-btn' + (side === s.key ? ' on' : '') + (s.key === 'Паша' ? ' t-pasha' : s.key === 'AI' ? ' t-ai' : '')} aria-pressed={side === s.key} onClick={() => setSide(s.key)}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {view.length === 0 ? <p className="empty">По этому фильтру ставок нет</p> :
        group === 'match' ? <ByMatch list={view} /> :
        group === 'day' ? <ByDay list={view} /> :
        <ByType list={view} />}

      <p className="foot-note">Ставки обновляются Владом по ходу турнира — сайт пересобирается за пару минут</p>
    </div>
  );
}

/* ── По матчам ── */
function ByMatch({ list }) {
  const groups = {};
  for (const b of list) {
    const key = b.matchId || ('_' + b.match);
    (groups[key] = groups[key] || []).push(b);
  }
  // сортировка по дате (свежие сверху)
  const keys = Object.keys(groups).sort((a, b) => {
    const da = groups[a][0].date, db = groups[b][0].date;
    return db.localeCompare(da);
  });
  return (
    <>
      {keys.map((key) => {
        const g = groups[key];
        const m = key.startsWith('_') ? null : matchMeta(key);
        const title = m ? m.title : g[0].match;
        const inner = (
          <div className="mg-head">
            {m && <Flags cc={m.cc} />}
            <span className="mg-title">{title}</span>
            {m && m.result && <span className="mg-score num">{m.result}</span>}
            <span className="mg-vs"><VsLine list={g} /></span>
          </div>
        );
        return (
          <section key={key} className="mg" aria-label={title}>
            {m ? <Link className="mg-head-link" href={'/matches/' + m.id + '/'}>{inner}</Link> : inner}
            {g.map((b) => <Ticket key={b.id} bet={b} />)}
          </section>
        );
      })}
    </>
  );
}

/* ── По дням ── */
function ByDay({ list }) {
  const groups = {};
  for (const b of list) (groups[b.date] = groups[b.date] || []).push(b);
  const days = Object.keys(groups).sort().reverse();
  return (
    <>
      {days.map((d) => (
        <section key={d} className="mg" aria-label={formatDay(d)}>
          <div className="mg-head">
            <span className="mg-title cap">{formatDay(d)}</span>
            <span className="mg-vs"><VsLine list={groups[d]} /></span>
          </div>
          {groups[d].map((b) => <Ticket key={b.id} bet={b} />)}
        </section>
      ))}
    </>
  );
}

/* ── По рынкам ── */
function ByType({ list }) {
  const groups = {};
  for (const b of list) (groups[b.type] = groups[b.type] || []).push(b);
  const keys = Object.keys(groups).sort((a, b) => {
    const sp = (k) => groups[k].reduce((s, x) => s + pl(x), 0);
    return sp(b) - sp(a);
  });
  return (
    <>
      {keys.map((t) => {
        const g = groups[t];
        const settled = g.filter((b) => b.status === 'win' || b.status === 'lose');
        const wins = settled.filter((b) => b.status === 'win').length;
        const sum = g.reduce((s, b) => s + pl(b), 0);
        return (
          <section key={t} className="mg" aria-label={t}>
            <div className="mg-head">
              <Tip className="mg-title" hint={TYPE_HINTS[t]}>{t}</Tip>
              <span className="mg-meta">{settled.length ? `${wins}/${settled.length}` : 'в игре'}</span>
              <span className={'mg-score num ' + (sum > 0 ? 'pos' : sum < 0 ? 'neg' : '')}>{settled.length ? money(sum) : ''}</span>
            </div>
            {g.map((b) => <Ticket key={b.id} bet={b} />)}
          </section>
        );
      })}
    </>
  );
}
