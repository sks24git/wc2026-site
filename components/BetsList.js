'use client';
import { useState } from 'react';
import Link from 'next/link';
import { bets, matches } from '@/lib/content';
import { pl, money, formatDay, sideTally } from '@/lib/calc';
import { TYPE_HINTS } from '@/lib/glossary';
import VsTicket from '@/components/VsTicket';
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
  { key: 'all', label: 'Батл' },
  { key: 'Паша', label: 'Паша' },
  { key: 'AI', label: 'AI' },
];

const matchMeta = (id) => matches.find((m) => m.id === id) || null;

function startMs(m, fallbackDate) {
  const date = m ? m.date : fallbackDate;
  const time = m && m.timeMsk ? m.timeMsk : '12:00';
  const [Y, M, D] = date.split('-').map(Number);
  const [h, mn] = time.split(':').map(Number);
  return Date.UTC(Y, M - 1, D, h - 3, mn); // МСК → UTC
}

function plClass(v) { return v > 0 ? 'pos' : v < 0 ? 'neg' : ''; }

// итог стороны коротким значением
function sideValue(t) {
  if (!t || t.n === 0) return null;
  if (t.pendingN && !t.anySettled) return { txt: 'в игре', cls: 'idle' };
  return { txt: money(t.pl), cls: plClass(t.pl) };
}

/* ── Колонка одной стороны ── */
function Column({ side, list }) {
  const t = sideTally(list);
  const v = sideValue(t);
  return (
    <div className={'vs-col ' + (side === 'Паша' ? 'pasha' : 'ai')}>
      <div className="vs-col-head">
        <span className="vs-col-who">{side}</span>
        {v && <span className={'vs-col-pl num ' + v.cls}>{v.txt}</span>}
      </div>
      {list.length === 0
        ? (
          <div className="vs-col-empty">
            <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 22h14M5 2h14M6 2v5a6 6 0 0 0 12 0V2M6 22v-5a6 6 0 0 1 12 0v5" />
            </svg>
            <span>ждём ставку</span>
          </div>
        )
        : list.map((b) => <VsTicket key={b.id} bet={b} />)}
    </div>
  );
}

/* ── Карточка группы с двумя колонками (Паша | AI) ── */
function VsCard({ head, list }) {
  const pasha = list.filter((b) => b.side === 'Паша');
  const ai = list.filter((b) => b.side === 'AI');
  return (
    <section className="vs-card">
      {head}
      <div className="vs-cols">
        <Column side="Паша" list={pasha} />
        <Column side="AI" list={ai} />
      </div>
    </section>
  );
}

export default function BetsList() {
  const [group, setGroup] = useState('match');
  const [side, setSide] = useState('all');

  const view = side === 'all' ? bets : bets.filter((b) => b.side === side);
  const single = side !== 'all';

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
        group === 'match' ? <ByMatch list={view} single={single} /> :
        group === 'day' ? <ByDay list={view} single={single} /> :
        <ByType list={view} single={single} />}

      <p className="foot-note">Ставки обновляются по ходу турнира — сайт пересобирается за пару минут</p>
    </div>
  );
}

/* список одной стороны (когда выбран фильтр Паша/AI) */
function SingleList({ list }) {
  return <>{list.map((b) => <Ticket key={b.id} bet={b} />)}</>;
}

/* ── По матчам ── */
function ByMatch({ list, single }) {
  const groups = {};
  for (const b of list) (groups[b.matchId || ('_' + b.match)] = groups[b.matchId || ('_' + b.match)] || []).push(b);

  const entries = Object.keys(groups).map((key) => {
    const g = groups[key];
    const m = key.startsWith('_') ? null : matchMeta(key);
    return {
      key, g, m,
      title: m ? m.title : g[0].match,
      date: m ? m.date : g[0].date,
      time: m ? m.timeMsk : null,
      stage: m ? m.stage : null,
      start: startMs(m, g[0].date),
      active: g.some((b) => b.status === 'pending'),
    };
  });
  const active = entries.filter((e) => e.active).sort((a, b) => a.start - b.start); // скоро → позже
  const done = entries.filter((e) => !e.active).sort((a, b) => b.start - a.start);   // свежие → старые

  const renderCard = (e) => {
    const headInner = (
      <div className="mg-head">
        <div className="mg-when">{[e.stage, formatDay(e.date), e.time ? e.time + ' МСК' : null].filter(Boolean).join(' · ')}</div>
        <div className="mg-headline">
          {e.m && <Flags cc={e.m.cc} />}
          <span className="mg-title">{e.title}</span>
          {e.m && e.m.result && <span className="mg-score num">{e.m.result}</span>}
        </div>
      </div>
    );
    const head = e.m ? <Link className="mg-head-link" href={'/matches/' + e.m.id + '/'}>{headInner}</Link> : headInner;
    return single
      ? <section key={e.key} className="vs-card">{head}<SingleList list={e.g} /></section>
      : <VsCard key={e.key} head={head} list={e.g} />;
  };

  return (
    <>
      {active.length > 0 && <div className="sect live"><span className="sect-label">В игре · {active.length}</span></div>}
      {active.map(renderCard)}
      {done.length > 0 && <div className="sect"><span className="sect-label">Сыграно · {done.length}</span></div>}
      {done.map(renderCard)}
    </>
  );
}

/* ── По дням ── */
function ByDay({ list, single }) {
  const groups = {};
  for (const b of list) (groups[b.date] = groups[b.date] || []).push(b);
  const days = Object.keys(groups).sort().reverse();
  return days.map((d) => {
    const head = <div className="mg-head"><span className="mg-title cap">{formatDay(d)}</span></div>;
    return single
      ? <section key={d} className="vs-card">{head}<SingleList list={groups[d]} /></section>
      : <VsCard key={d} head={head} list={groups[d]} />;
  });
}

/* ── По рынкам (анализ заходимости — простой список) ── */
function ByType({ list }) {
  const groups = {};
  for (const b of list) (groups[b.type] = groups[b.type] || []).push(b);
  const keys = Object.keys(groups).sort((a, b) => {
    const sp = (k) => groups[k].reduce((s, x) => s + pl(x), 0);
    return sp(b) - sp(a);
  });
  return keys.map((t) => {
    const g = groups[t];
    const settled = g.filter((b) => b.status === 'win' || b.status === 'lose');
    const wins = settled.filter((b) => b.status === 'win').length;
    const sum = g.reduce((s, b) => s + pl(b), 0);
    const wr = settled.length ? Math.round((wins / settled.length) * 100) : 0;
    return (
      <section key={t} className="vs-card">
        <div className="mg-head">
          <Tip className="mg-title" hint={TYPE_HINTS[t]}>{t}</Tip>
          {settled.length > 0 && <span className="mg-meta">{wins}/{settled.length} · {wr}%</span>}
          <span className={'mg-score num ' + plClass(sum)}>{settled.length ? money(sum) : 'в игре'}</span>
        </div>
        {g.map((b) => <Ticket key={b.id} bet={b} />)}
      </section>
    );
  });
}
