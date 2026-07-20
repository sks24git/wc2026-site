'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { bets } from '@/lib/content';
import { money, pl, stakeOf, groupBy, TIERS, TIER_ORDER, tierLabel } from '@/lib/calc';
import { marketGroup, groupLabel } from '@/lib/glossary';
import { sideLabel } from '@/lib/i18n';
import { useLang } from '@/app/providers';
import TierIcon from '@/components/TierIcon';

/* ══════════════ данные ══════════════ */

function useWarData() {
  return useMemo(() => {
    const settled = bets.filter((b) => b.status === 'win' || b.status === 'lose');
    // серия банка по дням
    const byDay = {};
    for (const b of settled) {
      byDay[b.date] = byDay[b.date] || { P: 0, A: 0 };
      byDay[b.date][b.side === 'Паша' ? 'P' : 'A'] += pl(b);
    }
    const days = Object.keys(byDay).sort();
    let p = 0, a = 0;
    const series = days.map((d) => {
      p += byDay[d].P; a += byDay[d].A;
      return { d, P: p, A: a };
    });
    // рынки: топ-групп по |P&L| суммарно
    const mkt = {};
    for (const b of settled) {
      const g = marketGroup(b);
      mkt[g] = mkt[g] || { P: { n: 0, w: 0, pl: 0 }, A: { n: 0, w: 0, pl: 0 } };
      const side = b.side === 'Паша' ? 'P' : 'A';
      mkt[g][side].n++; if (b.status === 'win') mkt[g][side].w++;
      mkt[g][side].pl += pl(b);
    }
    const markets = Object.entries(mkt)
      .sort((x, y) => (Math.abs(y[1].P.pl) + Math.abs(y[1].A.pl)) - (Math.abs(x[1].P.pl) + Math.abs(x[1].A.pl)))
      .slice(0, 8);
    // тиры
    const tiers = {};
    for (const side of ['Паша', 'AI']) {
      tiers[side] = groupBy(settled.filter((b) => b.side === side), (b) => b.tier);
    }
    // итоги
    const tot = {};
    for (const side of ['Паша', 'AI']) {
      const l = settled.filter((b) => b.side === side);
      const w = l.filter((b) => b.status === 'win').length;
      tot[side] = { n: l.length, w, l: l.length - w, pl: Math.round(l.reduce((s, b) => s + pl(b), 0)) };
    }
    // лучшие ставки
    const best = {};
    for (const side of ['Паша', 'AI']) {
      const l = settled.filter((b) => b.side === side);
      best[side] = l.reduce((m, b) => (pl(b) > pl(m) ? b : m), l[0]);
    }
    return { series, markets, tiers, tot, best, nBets: bets.length };
  }, []);
}

/* ══════════════ график войны ══════════════ */

const MARKS = [
  { d: '2026-06-11', side: 'P', ru: 'Волевая Кореи @17', en: 'Korea comeback @17' },
  { d: '2026-06-19', side: 'A', ru: 'Система точных счетов @21', en: 'Correct-score system @21' },
  { d: '2026-06-24', side: 'A', ru: 'Дно машины −49 000', en: 'Machine bottoms out −49,000' },
  { d: '2026-06-30', side: 'A', dy: 36, anchor: 'end', ru: 'Камбэк: AI выходит в плюс', en: 'Comeback: AI in the black' },
  { d: '2026-07-07', side: 'P', dy: -24, anchor: 'end', ru: 'Паша проваливается в минус', en: 'Pasha dips below zero' },
  { d: '2026-07-11', side: 'P', ru: 'Экспресс ничьих @14', en: 'Draws double @14' },
  { d: '2026-07-18', side: 'P', ru: 'Бронза 4:6 — жанр бьёт машину', en: 'Bronze 4:6 — genre beats machine' },
];

function WarChart({ series, cut, lang }) {
  const W = 640, H = 380, PAD = 34;
  const n = series.length;
  const upto = Math.max(1, Math.min(n, cut));
  const all = series.flatMap((s) => [s.P, s.A]).concat(0);
  const min = Math.min(...all), max = Math.max(...all);
  const x = (i) => PAD + ((W - 2 * PAD) * i) / (n - 1 || 1);
  const y = (v) => H - PAD - ((H - 2 * PAD) * (v - min)) / (max - min || 1);
  const path = (key) => series.map((s, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(s[key]).toFixed(1)).join(' ');
  const cutX = x(upto - 1);
  const last = series[upto - 1];
  const fmt = (v) => Math.round(v / 1000) + 'k';
  return (
    <svg className="rep-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="P&L">
      <line x1={PAD} y1={y(0)} x2={W - PAD} y2={y(0)} stroke="var(--hair-strong)" strokeWidth="1.2" />
      {[min, max].map((v, i) => (
        <g key={i}>
          <line x1={PAD} y1={y(v)} x2={W - PAD} y2={y(v)} stroke="var(--hair)" strokeWidth="1" strokeDasharray="2 5" />
          <text x={PAD + 2} y={y(v) + (i ? 14 : -6)} className="rep-tick">{fmt(v)}</text>
        </g>
      ))}
      <defs>
        <clipPath id="repcut"><rect x="0" y="0" width={cutX + 4} height={H} style={{ transition: 'width .8s cubic-bezier(.2,.8,.2,1)' }} /></clipPath>
      </defs>
      <g clipPath="url(#repcut)">
        <path d={path('A')} fill="none" stroke="var(--ai)" strokeWidth="3" strokeLinejoin="round" />
        <path d={path('P')} fill="none" stroke="var(--pasha)" strokeWidth="3" strokeLinejoin="round" />
      </g>
      {MARKS.map((m, i) => {
        const idx = series.findIndex((s) => s.d === m.d);
        if (idx < 0 || idx >= upto) return null;
        const v = m.side === 'P' ? series[idx].P : series[idx].A;
        const up = m.dy ?? (m.side === 'P' ? -14 : 20);
        return (
          <g key={i} className="rep-mark">
            <circle cx={x(idx)} cy={y(v)} r="5" fill={m.side === 'P' ? 'var(--pasha)' : 'var(--ai)'} stroke="var(--card)" strokeWidth="2" />
            <text x={Math.min(x(idx), W - PAD - 4)} y={y(v) + up} textAnchor={m.anchor ?? (idx > n * 0.62 ? 'end' : 'start')} className="rep-mark-t">
              {lang === 'en' ? m.en : m.ru}
            </text>
          </g>
        );
      })}
      <g style={{ transition: 'opacity .4s' }}>
        <rect x={cutX - 3.5} y={y(last.P) - 3.5} width="7" height="7" fill="var(--pasha)" />
        <rect x={cutX - 3.5} y={y(last.A) - 3.5} width="7" height="7" fill="var(--ai)" />
        <text x={Math.min(cutX + 8, W - PAD - 30)} y={y(last.P) + 4} className="rep-cur" fill="var(--pasha-deep)">{fmt(last.P)}</text>
        <text x={Math.min(cutX + 8, W - PAD - 30)} y={y(last.A) + 4} className="rep-cur" fill="var(--ai-deep)">{fmt(last.A)}</text>
      </g>
      <text x={PAD} y={16} className="rep-chart-date">{last.d.slice(8) + '.' + last.d.slice(5, 7)}</text>
    </svg>
  );
}

/* ══════════════ сцены правой панели ══════════════ */

function SceneIntro({ tot, nBets, lang }) {
  const en = lang === 'en';
  return (
    <div className="rep-scene rep-intro">
      <div className="rep-bignum">
        <span className="rep-big-p num">{money(tot['Паша'].pl, lang)}</span>
        <span className="rep-vs">vs</span>
        <span className="rep-big-a num">{money(tot['AI'].pl, lang)}</span>
      </div>
      <div className="rep-intro-facts">
        <div className="rep-fact"><b className="num">39</b><span>{en ? 'days of war' : 'дней войны'}</span></div>
        <div className="rep-fact"><b className="num">104</b><span>{en ? 'matches' : 'матча'}</span></div>
        <div className="rep-fact"><b className="num">{nBets}</b><span>{en ? 'bets settled' : 'ставок сыграно'}</span></div>
        <div className="rep-fact"><b className="num">2</b><span>{en ? 'players: a man and a machine' : 'игрока: человек и машина'}</span></div>
      </div>
    </div>
  );
}

function SceneMarkets({ markets, lang }) {
  const maxAbs = Math.max(...markets.flatMap(([, v]) => [Math.abs(v.P.pl), Math.abs(v.A.pl)]), 1);
  return (
    <div className="rep-scene">
      <div className="rep-mkt">
        <div className="rep-mkt-head">
          <span className="rep-side-tag pasha">{sideLabel('Паша', lang)}</span>
          <span />
          <span className="rep-side-tag ai">{sideLabel('AI', lang)}</span>
        </div>
        {markets.map(([g, v]) => (
          <div key={g} className="rep-mkt-row">
            <div className="rep-bar left">
              <i className={v.P.pl >= 0 ? 'w' : 'l'} style={{ width: Math.max(3, Math.round((Math.abs(v.P.pl) / maxAbs) * 100)) + '%' }} />
              <em className="num">{money(v.P.pl, lang)}</em>
            </div>
            <div className="rep-mkt-name">{groupLabel(g, lang)}</div>
            <div className="rep-bar right">
              <i className={v.A.pl >= 0 ? 'w' : 'l'} style={{ width: Math.max(3, Math.round((Math.abs(v.A.pl) / maxAbs) * 100)) + '%' }} />
              <em className="num">{money(v.A.pl, lang)}</em>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SceneTiers({ tiers, lang }) {
  return (
    <div className="rep-scene">
      <div className="rep-tiers">
        {TIER_ORDER.map((k) => {
          const P = tiers['Паша'][k] || { n: 0, w: 0, pl: 0 };
          const A = tiers['AI'][k] || { n: 0, w: 0, pl: 0 };
          return (
            <div key={k} className="rep-tier-row">
              <div className={'rep-tier-cell num ' + (P.pl >= 0 ? 'pos' : 'neg')}>{money(P.pl, lang)}<small>{P.w}/{P.n}</small></div>
              <div className="rep-tier-mid"><TierIcon tier={k} size={16} lang={lang} /><span>{tierLabel(k, lang)}</span><small className="num">{TIERS[k].odds}</small></div>
              <div className={'rep-tier-cell num ' + (A.pl >= 0 ? 'pos' : 'neg')}>{money(A.pl, lang)}<small>{A.w}/{A.n}</small></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SceneVerdict({ tot, best, lang }) {
  const en = lang === 'en';
  const diff = tot['Паша'].pl - tot['AI'].pl;
  return (
    <div className="rep-scene rep-verdict">
      <span className="stampword hit rep-stamp">{en ? 'PASHA WINS THE WAR' : 'ПАША ВЫИГРАЛ ВОЙНУ'}</span>
      <div className="rep-verdict-num num">+{diff.toLocaleString(en ? 'en-US' : 'ru-RU')} ₽</div>
      <div className="rep-verdict-grid">
        <div className="rep-v-col">
          <span className="rep-side-tag pasha">{sideLabel('Паша', lang)}</span>
          <b className="num">{(100000 + tot['Паша'].pl).toLocaleString(en ? 'en-US' : 'ru-RU')}</b>
          <small className="num">W{tot['Паша'].w} / L{tot['Паша'].l}</small>
          <p>{en ? 'Best: ' : 'Лучшая: '}<em>{best['Паша'] && (lang === 'en' ? best['Паша'].bet.en : best['Паша'].bet.ru)}</em></p>
        </div>
        <div className="rep-v-col">
          <span className="rep-side-tag ai">{sideLabel('AI', lang)}</span>
          <b className="num">{(100000 + tot['AI'].pl).toLocaleString(en ? 'en-US' : 'ru-RU')}</b>
          <small className="num">W{tot['AI'].w} / L{tot['AI'].l}</small>
          <p>{en ? 'Best: ' : 'Лучшая: '}<em>{best['AI'] && (lang === 'en' ? best['AI'].bet.en : best['AI'].bet.ru)}</em></p>
        </div>
      </div>
      <p className="rep-verdict-note pencil">{en ? 'both finished in profit — the bank was 100,000 each' : 'оба закончили в плюсе — банк был по 100 000'}</p>
    </div>
  );
}

/* ══════════════ дуэли матчей ══════════════ */

const DUELS_P = [
  {
    m: { ru: 'Канада — Босния · 1:1', en: 'Canada — Bosnia · 1:1' },
    p: { pl: 7050, ru: 'обе забьют + ничья', en: 'BTTS + draw' },
    a: { pl: -4610, ru: 'победа Канады, 1Т 0:0, точный счёт', en: 'Canada win, 1H 0:0, correct score' },
    why: { ru: 'человек прочитал боевую ничью — машина упёрлась в фаворита', en: 'the man read a fighting draw — the machine leaned on the favourite' },
  },
  {
    m: { ru: 'Испания — Бельгия · 2:1', en: 'Spain — Belgium · 2:1' },
    p: { pl: 6075, ru: '«Испания забьёт в каждом тайме», победа + обе забьют', en: '"Spain score each half", win + BTTS' },
    a: { pl: -4500, ru: 'обе не забьют + тотал меньше', en: 'BTTS-no + under' },
    why: { ru: 'Паша поверил в голы — машина в сухарь; оборона умерла на 41-й', en: 'Pasha backed goals — the machine a clean sheet; it died on 41' },
  },
  {
    m: { ru: 'Франция — Англия (бронза) · 4:6', en: 'France — England (bronze) · 4:6' },
    p: { pl: 9275, ru: 'гол головой, дубль, обе по 2+', en: 'headed goal, a brace, both 2+' },
    a: { pl: -600, ru: 'Мбаппе + победа Франции', en: 'Mbappé + France win' },
    why: { ru: 'жанр «гулянки без обороны» против матчап-логики — разгром', en: '"defence-free party" genre vs matchup logic — a rout' },
  },
];

const DUELS_A = [
  {
    m: { ru: 'Колумбия — Португалия · 0:0', en: 'Colombia — Portugal · 0:0' },
    a: { pl: 7575, ru: 'тотал меньше + ничья @3.95', en: 'under + draw @3.95' },
    p: { pl: -3000, ru: 'голы в первом тайме', en: 'first-half goals' },
    why: { ru: 'xG-профиль кричал «низ» — машина услышала, человек ждал праздника', en: 'the xG profile screamed "under" — the machine listened, the man waited for a party' },
  },
  {
    m: { ru: 'Кабо-Верде — Саудовская Аравия · 0:0', en: 'Cape Verde — Saudi Arabia · 0:0' },
    a: { pl: 5685, ru: 'тотал меньше + ничья @3.35', en: 'under + draw @3.35' },
    p: { pl: -3000, ru: 'гол в каждом тайме', en: 'a goal in each half' },
    why: { ru: 'тот же рецепт: слабые атаки + жара = ноль; ничья — золотая жила камбэка', en: 'same recipe: weak attacks + heat = nil; draws were the comeback goldmine' },
  },
  {
    m: { ru: 'Норвегия — Англия · 1:2 д.в.', en: 'Norway — England · 1:2 AET' },
    a: { pl: 540, ru: 'скромное «обе забьют»', en: 'a modest BTTS' },
    p: { pl: -8200, ru: 'шесть ставок на голы и тайм-сценарии', en: 'six bets on goals and half-scripts' },
    why: { ru: 'худший день Паши: вязкий нокаут съел все верховые сценарии разом', en: "Pasha's worst day: a sticky knockout ate every over-script at once" },
  },
];

const LESSONS = [
  {
    ru: { t: 'Ничья — недооценённый рынок', e: 'кэфы 3.3–4.0 на равные пары кормили весь камбэк', ok: true },
    en: { t: 'The draw is underpriced', e: 'odds 3.3–4.0 on even pairs fed the whole comeback', ok: true },
  },
  {
    ru: { t: 'Система точных счетов 2/4 — постоянка', e: '+9980 одним вечером; дисциплина вместо вдохновения', ok: true },
    en: { t: 'Correct-score system 2/4 — a staple', e: '+9,980 in one evening; discipline over inspiration', ok: true },
  },
  {
    ru: { t: 'Точный счёт на кэфе ~5+ — только красным', e: 'дисперсию режем размером: дважды спасло по 1000', ok: true },
    en: { t: 'Correct score at ~5+ odds — reds only', e: 'variance cut by stake: saved 1,000 twice', ok: true },
  },
  {
    ru: { t: 'Не фейдить «незаряженного» фаворита', e: 'класс пробивает мотивацию — Мексика и Бразилия наказали', ok: false },
    en: { t: "Don't fade an 'unmotivated' favourite", e: 'class beats motivation — Mexico and Brazil punished it', ok: false },
  },
  {
    ru: { t: 'Жанр матча сильнее матчапа', e: 'куплен кровью бронзы 4:6 — резервы тоже умеют в перестрелку', ok: false },
    en: { t: 'Match genre beats the matchup', e: 'bought with the 4:6 bronze — reserves can shoot out too', ok: false },
  },
  {
    ru: { t: 'Вторая жёлтая не считается в тотале', e: 'финал: 5 карточек по протоколу, 3 по расчёту', ok: false },
    en: { t: "A second yellow doesn't count in totals", e: 'the final: 5 cards on paper, 3 at settlement', ok: false },
  },
];

function SceneDuels({ list, topSide, lang }) {
  const en = lang === 'en';
  return (
    <div className="rep-scene">
      <div className="rep-duels">
        {list.map((d, i) => (
          <div key={i} className="rep-duel">
            <div className="rep-duel-m">{en ? d.m.en : d.m.ru}</div>
            <div className="rep-duel-rows">
              <div className={'rep-duel-row ' + (topSide === 'P' ? 'lead' : '')}>
                <span className="rep-side-tag pasha">{sideLabel('Паша', lang)}</span>
                <span className="rep-duel-bet">{en ? d.p.en : d.p.ru}</span>
                <b className={'num ' + (d.p.pl >= 0 ? 'pos' : 'neg')}>{money(d.p.pl, lang)}</b>
              </div>
              <div className={'rep-duel-row ' + (topSide === 'A' ? 'lead' : '')}>
                <span className="rep-side-tag ai">{sideLabel('AI', lang)}</span>
                <span className="rep-duel-bet">{en ? d.a.en : d.a.ru}</span>
                <b className={'num ' + (d.a.pl >= 0 ? 'pos' : 'neg')}>{money(d.a.pl, lang)}</b>
              </div>
            </div>
            <div className="rep-duel-why pencil">{en ? d.why.en : d.why.ru}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SceneLessons({ lang }) {
  const en = lang === 'en';
  return (
    <div className="rep-scene">
      <div className="rep-lessons">
        <div className="rep-lessons-hd">{en ? "THE MACHINE'S NOTEBOOK" : 'ТЕТРАДЬ МАШИНЫ'}</div>
        {LESSONS.map((l, i) => {
          const L2 = en ? l.en : l.ru;
          return (
            <div key={i} className="rep-lesson">
              <span className={'stampword ' + (L2.ok ? 'hit' : 'miss')}>{L2.ok ? (en ? 'PAID' : 'ОКУПИЛСЯ') : (en ? 'COST US' : 'КРОВЬЮ')}</span>
              <div>
                <b>{L2.t}</b>
                <small>{L2.e}</small>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════ главы ══════════════ */

const CHAPTERS = [
  {
    id: 'intro', scene: { type: 'intro' },
    ru: {
      k: 'Пролог', h: 'Человек против машины',
      t: 'Тридцать девять дней, сто четыре матча, четыреста пятьдесят ставок. **Паша** ставил чутьём, жанром и «по приколу красной». **Машина** — профилями, моделями и дисциплиной. У каждого — виртуальный банк 100 000 и весь чемпионат мира впереди.',
    },
    en: {
      k: 'Prologue', h: 'Man versus machine',
      t: 'Thirty-nine days, 104 matches, 450 bets. **Pasha** bet on gut, genre and "a red for fun." **The machine** — on profiles, models and discipline. Each started with a virtual bank of 100,000 and the whole World Cup ahead.',
    },
  },
  {
    id: 'early', scene: { type: 'chart', until: '2026-06-16' },
    ru: {
      k: 'Глава 1 · группы', h: 'Штурм Паши',
      t: 'Человек ворвался в турнир, как **Корея** в матч с Чехией — его волевая ставка с коэффициентом 17 залетела в первый же вечер. Пока машина строила модели, Паша читал жанры: обе забьют, камбэки, перестрелки. К шестому дню он вёл **+30 000 против −24 000**.',
    },
    en: {
      k: 'Ch. 1 · groups', h: "Pasha's blitz",
      t: 'The man stormed the tournament like **Korea** stormed Czechia — his comeback bet at 17.0 landed on the very first night. While the machine built models, Pasha read genres: BTTS, comebacks, shoot-outs. By day six he led **+30,000 to −24,000**.',
    },
  },
  {
    id: 'pit', scene: { type: 'chart', until: '2026-06-24' },
    ru: {
      k: 'Глава 2', h: 'Яма машины',
      t: 'Середина группового этапа — худшие дни AI: фавориты буксовали, тоталы рвались, минус дорос до **−49 000**. Разрыв — почти восемьдесят тысяч. Любой человек бросил бы. Машина пересчитала уроки и продолжила по стратегии.',
    },
    en: {
      k: 'Ch. 2', h: "The machine's pit",
      t: "Mid-group stage — the AI's darkest days: favourites stalled, totals burst, the hole grew to **−49,000**. The gap: nearly eighty thousand. Any human would have quit. The machine recomputed its lessons and stayed on strategy.",
    },
  },
  {
    id: 'comeback', scene: { type: 'chart', until: '2026-07-07' },
    ru: {
      k: 'Глава 3', h: 'Великий камбэк',
      t: 'И дисциплина заплатила. Система точных счетов дала **+9980 одним вечером**, ничьи и «обе забьют» заходили сериями, серия пенальти Марокко — по расчёту. За двенадцать дней машина отыграла яму целиком и вышла вперёд — а **Паша впервые провалился в минус**.',
    },
    en: {
      k: 'Ch. 3', h: 'The great comeback',
      t: 'And discipline paid. The correct-score system returned **+9,980 in one evening**, draws and BTTS landed in streaks, the Morocco shootout — right on the model. In twelve days the machine cleared the entire pit and moved ahead — while **Pasha dipped below zero** for the first time.',
    },
  },
  {
    id: 'duels-a', scene: { type: 'duels', side: 'A' },
    ru: {
      k: 'Дуэли · машина', h: 'Коронки машины',
      t: 'Её почерк вблизи. Рецепт один: слабые атаки плюс полуденная жара — и **Колумбия** с Португалией, а следом **Кабо-Верде** с саудовцами дают по нулям. «Тотал меньше» и ничья платят дважды, пока человек в тех же матчах ждёт праздника. А вязкая **Норвегия — Англия** стала худшим матчем Паши за всю войну: шесть голевых сценариев сгорели за один вечер.',
    },
    en: {
      k: 'Duels · machine', h: "The machine's signature wins",
      t: "Its handwriting up close. One recipe: weak attacks plus midday heat — **Colombia** vs Portugal, then **Cape Verde** vs the Saudis, both finish goalless. Under-plus-draw pays twice while the man waits for a party in the same games. And the sticky **Norway — England** became Pasha's worst match of the whole war: six goal scripts burned in a single evening.",
    },
  },
  {
    id: 'week', scene: { type: 'chart', until: '2026-07-18' },
    ru: {
      k: 'Глава 4 · плей-офф', h: 'Неделя человека',
      t: 'Плей-офф качнул качели обратно. **Экспресс ничьих @14** — джекпот; волевая **Аргентины** против Англии — снова его жанр; а бронзовый матч, где резервы устроили перестрелку 4:6, Паша прочитал целиком: гол головой, дубль, голы в обе стороны. Машина в это время упиралась в матчапы — и горела.',
    },
    en: {
      k: 'Ch. 4 · playoffs', h: "The human's week",
      t: "The playoffs swung it back. The **draws double @14** — a jackpot; **Argentina's** comeback against England — his genre again; and the bronze match, a 4:6 shoot-out of reserves, Pasha read cover to cover: headed goal, a brace, goals both ways. The machine kept leaning on matchups — and kept burning.",
    },
  },
  {
    id: 'duels-p', scene: { type: 'duels', side: 'P' },
    ru: {
      k: 'Дуэли · человек', h: 'Где Паша бил на голову',
      t: 'Три разгрома вблизи. **Канада — Босния**: Паша прочитал боевую ничью — машина упёрлась в фаворита и сгорела по всем пунктам. **Испания — Бельгия**: он верил в голы, она — в сухарь; оборона умерла ещё до перерыва. И бронза **Франция — Англия** 4:6 — его шедевр: гол головой, дубль, перестрелка с двух сторон — всё зашло, пока машина пересчитывала матчапы.',
    },
    en: {
      k: 'Duels · human', h: 'Where Pasha won by a mile',
      t: "Three routs up close. **Canada — Bosnia**: Pasha read a fighting draw — the machine leaned on the favourite and burned on every line. **Spain — Belgium**: he backed goals, it backed a clean sheet; the defence died before the break. And the **France — England** bronze, 4:6 — his masterpiece: headed goal, a brace, a shoot-out both ways — everything landed while the machine was still crunching matchups.",
    },
  },
  {
    id: 'final', scene: { type: 'chart', until: '2026-07-19' },
    ru: {
      k: 'Глава 5 · финал', h: 'Финал профилей',
      t: 'В финале профиль машины наконец сработал: вязкие 0:0 к 90-й и сухой первый тайм — ровно как читалось. Но карточный тотал срезала техника расчёта, а трофей **Аргентины** так и не случился — **Испания** дожала в овертайме голом джокера. Финал почти в ноль. Войну он уже не решал.',
    },
    en: {
      k: 'Ch. 5 · the final', h: 'The profile final',
      t: "In the final the machine's profile finally clicked: a sticky 0:0 at 90 and a dry first half — exactly as read. But settlement mechanics cut the card total, and **Argentina's** trophy never came — **Spain** ground it out in extra time with a super-sub goal. The final ended near even. The war was already decided.",
    },
  },
  {
    id: 'markets', scene: { type: 'markets' },
    ru: {
      k: 'Разбор', h: 'Кто на чём зарабатывал',
      t: 'Почерк виден в цифрах. **Паша** кормился таймами, спецрынками и волевыми — жанровым чтением матчей. **Машина** — тоталами, исходами и системами точных счетов. Самые дорогие провалы у обоих — экспрессы и комбо: жадность не окупилась ни у человека, ни у алгоритма.',
    },
    en: {
      k: 'Breakdown', h: 'Who earned on what',
      t: "The signatures show in the numbers. **Pasha** fed on halves, specials and comebacks — genre-reading matches. **The machine** — on totals, outcomes and correct-score systems. The costliest failures on both sides were accumulators and combos: greed paid neither man nor algorithm.",
    },
  },
  {
    id: 'tiers', scene: { type: 'tiers' },
    ru: {
      k: 'Разбор', h: 'Светофор ставок',
      t: 'Зелёные — рабочая лошадь обоих. Жёлтые — где машина держала дисциплину, а человек рисковал. А **красные — территория Паши**: волевые по 17.0 и экспрессы ничьих делали ему дни, тогда как красные машины чаще горели лотереями точных счетов.',
    },
    en: {
      k: 'Breakdown', h: 'The traffic light',
      t: "Greens — the workhorse for both. Yellows — where the machine kept discipline and the man took risks. And **reds were Pasha's turf**: 17.0 comebacks and draw doubles made his days, while the machine's reds mostly burned on correct-score lotteries.",
    },
  },
  {
    id: 'lessons', scene: { type: 'lessons' },
    ru: {
      k: 'Тетрадь', h: 'Чему научилась машина',
      t: 'Половина тетради окупилась ещё по ходу войны: недооценённые **ничьи** кормили камбэк, система точных счетов стала постоянкой, а урезанный размер на лотерейных кэфах дважды сберёг деньги. Вторая половина куплена кровью: класс фаворита пробивает «нет мотивации», жанр матча сильнее матчапа, а вторая жёлтая, как выяснилось в финале, вообще не считается.',
    },
    en: {
      k: 'The notebook', h: 'What the machine learned',
      t: "Half the notebook paid for itself mid-war: underpriced **draws** fed the comeback, the correct-score system became a staple, and cutting stakes on lottery odds saved money twice. The other half was bought in blood: a favourite's class beats 'no motivation', match genre beats the matchup, and a second yellow — as the final revealed — doesn't count at all.",
    },
  },
  {
    id: 'verdict', scene: { type: 'verdict' },
    ru: {
      k: 'Эпилог', h: 'Вердикт',
      t: 'Человек выиграл войну — чутьё на жанр оказалось дороже дисциплины на дистанции в один турнир. Но оба закончили в плюсе, а машина увезла главное: **тетрадь уроков** — про жанры утешительных финалов, цену концентрации и то, что вторая жёлтая не считается. Реванш — на Евро-2028.',
    },
    en: {
      k: 'Epilogue', h: 'The verdict',
      t: "The man won the war — genre instinct beat discipline over a single tournament. But both finished in profit, and the machine took home what matters: **a notebook of lessons** — on consolation-final genres, the price of concentration, and the fact that a second yellow doesn't count. The rematch: Euro 2028.",
    },
  },
];

/* мини-парсер **bold** (как Emph) */
function B({ s }) {
  const parts = s.split(/\*\*(.+?)\*\*/g);
  return parts.map((p, i) => (i % 2 ? <strong key={i}>{p}</strong> : p));
}

/* ══════════════ страница ══════════════ */

export default function ReportView() {
  const lang = useLang();
  const data = useWarData();
  const [active, setActive] = useState(0);
  const refs = useRef([]);

  useEffect(() => {
    let raf = 0;
    const pick = () => {
      raf = 0;
      const anchor = window.innerHeight * 0.45;
      let bestI = 0, bestD = Infinity;
      refs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const c = r.top + r.height / 2;
        const d = Math.abs(c - anchor);
        if (d < bestD) { bestD = d; bestI = i; }
      });
      setActive(bestI);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(pick); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    pick();
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  const ch = CHAPTERS[active] || CHAPTERS[0];
  const scene = ch.scene;
  const cutIdx = scene.type === 'chart'
    ? data.series.findIndex((s) => s.d > scene.until) === -1 ? data.series.length : data.series.findIndex((s) => s.d > scene.until)
    : data.series.length;

  return (
    <div className="report">
      <h1>{lang === 'en' ? 'The War Report · WC-26' : 'Отчёт о войне · ЧМ-26'}</h1>
      <p className="rep-sub pencil">{lang === 'en' ? 'scroll — the picture follows the story' : 'листай — картинка едет за историей'}</p>

      <div className="rep-grid">
        <div className="rep-story">
          {CHAPTERS.map((c, i) => {
            const L2 = lang === 'en' ? c.en : c.ru;
            return (
              <section
                key={c.id}
                data-idx={i}
                ref={(el) => (refs.current[i] = el)}
                className={'rep-step' + (i === active ? ' on' : '')}
              >
                <span className="rep-kicker">{L2.k}</span>
                <h2>{L2.h}</h2>
                <p><B s={L2.t} /></p>
              </section>
            );
          })}
        </div>

        <div className="rep-panel-wrap">
          <div className="rep-panel">
            <span className="scotch rep-sc1" aria-hidden="true" />
            <span className="scotch rep-sc2" aria-hidden="true" />
            {scene.type === 'intro' && <SceneIntro tot={data.tot} nBets={data.nBets} lang={lang} />}
            {scene.type === 'chart' && <WarChart series={data.series} cut={cutIdx} lang={lang} />}
            {scene.type === 'duels' && <SceneDuels list={scene.side === 'P' ? DUELS_P : DUELS_A} topSide={scene.side} lang={lang} />}
            {scene.type === 'lessons' && <SceneLessons lang={lang} />}
            {scene.type === 'markets' && <SceneMarkets markets={data.markets} lang={lang} />}
            {scene.type === 'tiers' && <SceneTiers tiers={data.tiers} lang={lang} />}
            {scene.type === 'verdict' && <SceneVerdict tot={data.tot} best={data.best} lang={lang} />}
            <div className="rep-panel-legend">
              <span><i style={{ background: 'var(--pasha)' }} />{sideLabel('Паша', lang)}</span>
              <span><i style={{ background: 'var(--ai)' }} />{sideLabel('AI', lang)}</span>
            </div>
          </div>
        </div>
      </div>

      <p className="rep-fin pencil">
        {lang === 'en' ? 'the album is glued shut — rematch at Euro 2028' : 'альбом доклеен — реванш на Евро-2028'}
      </p>
    </div>
  );
}
