'use client';
import { Fragment, useState } from 'react';
import Link from 'next/link';
import { bets, matches } from '@/lib/content';
import { pl, money, formatDay, sideTally } from '@/lib/calc';
import { marketGroup, groupLabel, groupHint } from '@/lib/glossary';
import { L, sideLabel } from '@/lib/i18n';
import { kickoffInstant } from '@/lib/datetime';
import { useLang, useT, useTimeFmt } from '@/app/providers';
import VsTicket from '@/components/VsTicket';
import Ticket from '@/components/Ticket';
import Legend from '@/components/Legend';
import Flags from '@/components/Flags';
import Tip from '@/components/Tip';

const GROUPS = [
  { key: 'match', tkey: 'bets.group.match' },
  { key: 'day', tkey: 'bets.group.day' },
  { key: 'type', tkey: 'bets.group.type' },
];
const SIDES = ['all', 'Паша', 'AI'];

const matchMeta = (id) => matches.find((m) => m.id === id) || null;

function plClass(v) { return v > 0 ? 'pos' : v < 0 ? 'neg' : ''; }

// итог стороны коротким значением
function sideValue(t, lang, inPlayTxt) {
  if (!t || t.n === 0) return null;
  if (t.pendingN && !t.anySettled) return { txt: inPlayTxt, cls: 'idle' };
  return { txt: money(t.pl, lang), cls: plClass(t.pl) };
}

/* ── Колонка одной стороны ── */
function Column({ side, list, past, full }) {
  const lang = useLang();
  const T = useT();
  const t = sideTally(list);
  const v = sideValue(t, lang, T('common.inPlay'));
  return (
    <div className={'vs-col ' + (side === 'Паша' ? 'pasha' : 'ai')}>
      <div className="vs-col-head">
        <span className="vs-col-who">{sideLabel(side, lang)}</span>
        {v && <span className={'vs-col-pl num ' + v.cls}>{v.txt}</span>}
      </div>
      {list.length === 0
        ? (
          <div className="vs-col-empty">
            <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 22h14M5 2h14M6 2v5a6 6 0 0 0 12 0V2M6 22v-5a6 6 0 0 1 12 0v5" />
            </svg>
            <span>{past ? T('bets.noPick') : T('bets.waiting')}</span>
          </div>
        )
        : list.map((b) => (full ? <Ticket key={b.id} bet={b} /> : <VsTicket key={b.id} bet={b} />))}
    </div>
  );
}

/* ── Карточка группы с двумя колонками (Паша | AI) ── */
function VsCard({ head, list, past, full }) {
  const pasha = list.filter((b) => b.side === 'Паша');
  const ai = list.filter((b) => b.side === 'AI');
  return (
    <section className="vs-card">
      {head}
      <div className="vs-cols">
        <Column side="Паша" list={pasha} past={past} full={full} />
        <Column side="AI" list={ai} past={past} full={full} />
      </div>
    </section>
  );
}

export default function BetsList() {
  const T = useT();
  const lang = useLang();
  const [group, setGroup] = useState('match');
  const [side, setSide] = useState('all');

  const view = side === 'all' ? bets : bets.filter((b) => b.side === side);
  const single = side !== 'all';

  const sideBtnLabel = (k) => (k === 'all' ? T('bets.side.all') : sideLabel(k, lang));

  return (
    <div>
      <Legend />

      <div className="controls">
        <div className="seg" role="group" aria-label={T('a11y.grouping')}>
          {GROUPS.map((g) => (
            <button key={g.key} className={'seg-btn' + (group === g.key ? ' on' : '')} aria-pressed={group === g.key} onClick={() => setGroup(g.key)}>
              {T(g.tkey)}
            </button>
          ))}
        </div>
        <div className="seg sides" role="group" aria-label={T('a11y.side')}>
          {SIDES.map((k) => (
            <button key={k} className={'seg-btn' + (side === k ? ' on' : '') + (k === 'Паша' ? ' t-pasha' : k === 'AI' ? ' t-ai' : '')} aria-pressed={side === k} onClick={() => setSide(k)}>
              {sideBtnLabel(k)}
            </button>
          ))}
        </div>
      </div>

      {view.length === 0 ? <p className="empty">{T('bets.none')}</p> :
        group === 'match' ? <ByMatch list={view} single={single} /> :
        group === 'day' ? <ByDay list={view} single={single} /> :
        <ByType list={view} single={single} />}

      <p className="foot-note">{T('bets.footNote')}</p>
    </div>
  );
}

/* список одной стороны (когда выбран фильтр Паша/AI) */
function SingleList({ list }) {
  return <>{list.map((b) => <Ticket key={b.id} bet={b} />)}</>;
}

/* ── По матчам ── */
const isSystem = (b) => b.type === 'Система' || b.type === 'Экспресс';
const normName = (s) => s.replace(/\s*\((?:Паша|AI)\)\s*$/i, '').trim();

function ByMatch({ list, single }) {
  const lang = useLang();
  const T = useT();
  const tf = useTimeFmt();

  // системы/экспрессы — отдельно (во всю ширину), остальное группируем по матчу
  const matchBets = list.filter((b) => !isSystem(b));
  const sysBets = list.filter(isSystem);

  const groups = {};
  for (const b of matchBets) {
    const key = b.matchId || ('_' + L(b.match, 'ru'));
    (groups[key] = groups[key] || []).push(b);
  }

  const entries = Object.keys(groups).map((key) => {
    const g = groups[key];
    const m = key.startsWith('_') ? null : matchMeta(key);
    return {
      key, g, m,
      title: m ? L(m.title, lang) : L(g[0].match, lang),
      stage: m ? m.stage : null,
      date: m ? m.date : g[0].date,
      time: m ? m.timeMsk : null,
      start: kickoffInstant(m ? m.date : g[0].date, (m && m.timeMsk) || '12:00'),
      active: g.some((b) => b.status === 'pending'),
    };
  });
  const active = entries.filter((e) => e.active).sort((a, b) => a.start - b.start);
  const done = entries.filter((e) => !e.active).sort((a, b) => b.start - a.start);

  // системы: одинаковые по типу+дню AI и Паша идут ПОДРЯД
  const sysSort = (a, b) => {
    const ka = normName(L(a.match, 'ru')) + '|' + a.date, kb = normName(L(b.match, 'ru')) + '|' + b.date;
    if (ka !== kb) return ka < kb ? -1 : 1;
    return a.side === b.side ? 0 : a.side === 'Паша' ? -1 : 1;
  };
  const sysActive = sysBets.filter((b) => b.status === 'pending').sort(sysSort);
  const sysDone = sysBets.filter((b) => b.status !== 'pending').sort(sysSort);

  const renderCard = (e) => {
    const when = e.time ? `${tf.time(e.start)} ${tf.zoneShort(e.start)}` : null;
    const headInner = (
      <div className="mg-head">
        <div className="mg-when">{[e.stage ? L(e.stage, lang) : null, formatDay(e.date, lang), when].filter(Boolean).join(' · ')}</div>
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
      : <VsCard key={e.key} head={head} list={e.g} past={!e.active} />;
  };

  return (
    <>
      {active.length > 0 && <div className="sect live"><span className="sect-label">{T('bets.inPlayCount', { n: active.length })}</span></div>}
      {active.map(renderCard)}
      {sysActive.length > 0 && <div className="sect"><span className="sect-label">{T('bets.sysInPlay')}</span></div>}
      {sysActive.length > 0 && (single
        ? <section className="vs-card sys-list">{sysActive.map((b) => <Ticket key={b.id} bet={b} />)}</section>
        : <VsCard list={sysActive} past={false} full />)}
      {done.length > 0 && <div className="sect"><span className="sect-label">{T('bets.settledCount', { n: done.length })}</span></div>}
      {done.map(renderCard)}
      {sysDone.length > 0 && <div className="sect"><span className="sect-label">{T('bets.sysSettled')}</span></div>}
      {sysDone.length > 0 && (single
        ? <section className="vs-card sys-list">{sysDone.map((b) => <Ticket key={b.id} bet={b} />)}</section>
        : <VsCard list={sysDone} past full />)}
    </>
  );
}

/* ── По дням ── */
function ByDay({ list, single }) {
  const lang = useLang();
  const groups = {};
  for (const b of list) (groups[b.date] = groups[b.date] || []).push(b);
  const days = Object.keys(groups).sort().reverse();
  return days.map((d) => {
    const dayBets = groups[d];
    const matchB = dayBets.filter((b) => !isSystem(b));
    const sysB = dayBets.filter(isSystem);
    const head = <div className="mg-head"><span className="mg-title cap">{formatDay(d, lang)}</span></div>;
    const past = dayBets.every((b) => b.status !== 'pending');
    if (single) return <section key={d} className="vs-card">{head}<SingleList list={dayBets} /></section>;
    return (
      <Fragment key={d}>
        <VsCard head={head} list={matchB} past={past} />
        {sysB.length > 0 && <VsCard list={sysB} past={past} full />}
      </Fragment>
    );
  });
}

/* ── По рынкам (анализ заходимости — простой список) ── */
function ByType({ list }) {
  const lang = useLang();
  const T = useT();
  const groups = {};
  for (const b of list) { const k = marketGroup(b); (groups[k] = groups[k] || []).push(b); }
  const keys = Object.keys(groups).sort((a, b) => {
    const sp = (k) => groups[k].reduce((s, x) => s + pl(x), 0);
    return sp(b) - sp(a);
  });
  return keys.map((key) => {
    const g = groups[key];
    const settled = g.filter((b) => b.status === 'win' || b.status === 'lose');
    const wins = settled.filter((b) => b.status === 'win').length;
    const sum = g.reduce((s, b) => s + pl(b), 0);
    const wr = settled.length ? Math.round((wins / settled.length) * 100) : 0;
    return (
      <section key={key} className="vs-card">
        <div className="mg-head">
          <Tip className="mg-title" hint={groupHint(key, lang)}>{groupLabel(key, lang)}</Tip>
          {settled.length > 0 && <span className="mg-meta">{wins}/{settled.length} · {wr}%</span>}
          <span className={'mg-score num ' + plClass(sum)}>{settled.length ? money(sum, lang) : T('common.inPlay')}</span>
        </div>
        {g.map((b) => <Ticket key={b.id} bet={b} />)}
      </section>
    );
  });
}
