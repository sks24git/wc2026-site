'use client';
import { useState } from 'react';
import { useLang } from '@/app/providers';

/* Сетка плей-офф ЧМ-2026 с прогнозом AI матч за матчем (две полусетки слева-направо).
   В каждом боксе подсвечен предсказанный победитель + метка AI; рядом место под метки
   П (Паша) и ✓ (факт) — добавляются позже через поля pasha/fact в PRED.
   Контент двуязычный через локальный tr(ru,en). PRED/META/сами боксы — на уровне модуля
   (не пересоздаются на каждый рендер PlayoffsView), чтобы useState во флип-карточках
   не терял состояние при смене языка/навигации. */

const trL = (lang, ru, en) => (lang === 'en' ? en : ru);
const norm = (s) => (s || '').replace(/\s+/g, ' ').trim();

function Flag({ cc }) {
  if (!cc) return <span className="po-flag po-flag-tbd" aria-hidden="true" />;
  return (
    <img className="po-flag" src={`https://flagcdn.com/w40/${cc}.png`}
      srcSet={`https://flagcdn.com/w80/${cc}.png 2x`} width={22} height={22} alt="" loading="lazy" />
  );
}

/* Штриховые мини-иконки (эмодзи в хроме запрещены дизайн-системой).
   VenueIcon: roof (крыша/кондиц) · alt (высота) · sun/cloud/rain (открытый + погода). */
const VENUE_PATHS = {
  roof: <path d="M3.5 10.5 12 4.5l8.5 6M5.5 10.5V19h13v-8.5" />,
  alt: <path d="M3 18.5 9.5 8l4 6.2 2-3L21 18.5z" />,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 3.5V6M12 18v2.5M3.5 12H6M18 12h2.5M6 6l1.7 1.7M16.3 16.3 18 18M18 6l-1.7 1.7M7.7 16.3 6 18" /></>,
  cloud: <path d="M6.5 18a4 4 0 0 1-.4-8 5.4 5.4 0 0 1 10.6-.6A4.3 4.3 0 0 1 17.2 18z" />,
  rain: <><path d="M6.5 14.5a4 4 0 0 1-.4-8 5.4 5.4 0 0 1 10.6-.6 4.3 4.3 0 0 1 .5 8.4" /><path d="M8.5 17.5l-1 2.6M12.5 17.5l-1 2.6M16.5 17.5l-1 2.6" /></>,
};
function VenueIcon({ k, size = 12 }) {
  if (!VENUE_PATHS[k]) return null;
  return (
    <svg className="po-vic" viewBox="0 0 24 24" width={size} height={size} fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {VENUE_PATHS[k]}
    </svg>
  );
}
function TrophyIcon({ size = 32 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor"
      strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 3.5h10V9a5 5 0 0 1-10 0z" />
      <path d="M7 5H3.5a3.5 3.5 0 0 0 3.6 3.5M17 5h3.5A3.5 3.5 0 0 1 16.9 8.5" />
      <path d="M12 14v3.5M8.5 20.5h7M10 17.5h4" />
    </svg>
  );
}
/* Светофор рисков (вместо 🔴/🟡): штриховой кружок цветом тира */
function RiskDot({ lvl }) {
  return (
    <svg className={'po-risk ' + lvl} viewBox="0 0 12 12" width="11" height="11" fill="none"
      stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="6" cy="6" r="4.4" />
    </svg>
  );
}

// счёт: пер-перевод хвостов для EN
function scoreText(s, lang) {
  if (!s || lang !== 'en') return s;
  return s.replace('пен', 'pen').replace('доп. время', 'a.e.t.');
}

// команда: {ru,en,cc} → подпись на текущем языке
const teamLabel = (team, lang) => (team ? trL(lang, team.ru, team.en) : '—');

// PRED[code] = { a, b, win:'a'|'b', score, by:'reg'|'aet'|'pen', conf, pasha?, fact? }
// pasha/fact — позже: 'a'/'b' (кого ведёт Паша / кто реально прошёл).
const T = (ru, en, cc) => ({ ru, en, cc });
const P = (a, b, win, score, by, conf) => ({ a, b, win, score, by, conf });
const PRED = {
  // ── 1/16 ──
  M73: { ...P(T('ЮАР', 'South Africa', 'za'), T('Канада', 'Canada', 'ca'), 'b', '0:1', 'reg', 'medium'), fact: 'b', fscore: '0:1', fby: 'reg' },
  M74: { ...P(T('Германия', 'Germany', 'de'), T('Парагвай', 'Paraguay', 'py'), 'a', '2:1', 'reg', 'medium'), fact: 'b', fscore: '1:1, пен. 3:4', fby: 'pen' },
  M75: { ...P(T('Нидерланды', 'Netherlands', 'nl'), T('Марокко', 'Morocco', 'ma'), 'a', '2:1 (доп. время)', 'aet', 'low'), fact: 'b', fscore: '1:1, пен. 2:3', fby: 'pen' },
  M77: { ...P(T('Франция', 'France', 'fr'), T('Швеция', 'Sweden', 'se'), 'a', '3:1', 'reg', 'high'), fact: 'a', fscore: '3:0', fby: 'reg' },
  M81: { ...P(T('США', 'USA', 'us'), T('Босния', 'Bosnia', 'ba'), 'a', '2:1', 'reg', 'high'), fact: 'a', fscore: '2:0', fby: 'reg' },
  M82: { ...P(T('Бельгия', 'Belgium', 'be'), T('Сенегал', 'Senegal', 'sn'), 'a', '2:1', 'reg', 'medium'), fact: 'a', fscore: '2:2, доп. время 3:2', fby: 'aet' },
  M83: { ...P(T('Португалия', 'Portugal', 'pt'), T('Хорватия', 'Croatia', 'hr'), 'a', '2:1', 'reg', 'medium'), fact: 'a', fscore: '2:1', fby: 'reg' },
  M84: { ...P(T('Испания', 'Spain', 'es'), T('Австрия', 'Austria', 'at'), 'a', '2:0', 'reg', 'high'), fact: 'a', fscore: '3:0', fby: 'reg' },
  M76: { ...P(T('Бразилия', 'Brazil', 'br'), T('Япония', 'Japan', 'jp'), 'a', '2:1', 'reg', 'medium'), fact: 'a', fscore: '2:1', fby: 'reg' },
  M78: { ...P(T('Кот-д’Ивуар', 'Côte d’Ivoire', 'ci'), T('Норвегия', 'Norway', 'no'), 'b', '1:2', 'reg', 'medium'), fact: 'b', fscore: '1:2', fby: 'reg' },
  M79: { ...P(T('Мексика', 'Mexico', 'mx'), T('Эквадор', 'Ecuador', 'ec'), 'a', '1:0', 'reg', 'medium'), fact: 'a', fscore: '2:0', fby: 'reg' },
  M80: { ...P(T('Англия', 'England', 'gb-eng'), T('ДР Конго', 'DR Congo', 'cd'), 'a', '2:0', 'reg', 'medium'), fact: 'a', fscore: '2:1', fby: 'reg' },
  M85: { ...P(T('Швейцария', 'Switzerland', 'ch'), T('Алжир', 'Algeria', 'dz'), 'a', '2:1', 'reg', 'medium'), fact: 'a', fscore: '2:0', fby: 'reg' },
  M86: { ...P(T('Аргентина', 'Argentina', 'ar'), T('Кабо-Верде', 'Cape Verde', 'cv'), 'a', '3:0', 'reg', 'high'), fact: 'a', fscore: '1:1, доп. время 3:2', fby: 'aet' },
  M87: { ...P(T('Колумбия', 'Colombia', 'co'), T('Гана', 'Ghana', 'gh'), 'a', '2:0', 'reg', 'medium'), fact: 'a', fscore: '1:0', fby: 'reg' },
  M88: { ...P(T('Австралия', 'Australia', 'au'), T('Египет', 'Egypt', 'eg'), 'b', '1:1 (2:4 пен)', 'pen', 'low'), fact: 'b', fscore: '1:1, пен. 2:4', fby: 'pen' },
  // ── 1/8 ── (пересобрано после 1/16: воркфлоу ресёрч+адверсариальная проверка, 04.07)
  M89: { ...P(T('Парагвай', 'Paraguay', 'py'), T('Франция', 'France', 'fr'), 'b', '0:2', 'reg', 'medium'), fact: 'b', fscore: '0:1', fby: 'reg' },
  M90: { ...P(T('Канада', 'Canada', 'ca'), T('Марокко', 'Morocco', 'ma'), 'b', '0:1', 'reg', 'medium'), fact: 'b', fscore: '0:3', fby: 'reg' },
  M93: { ...P(T('Португалия', 'Portugal', 'pt'), T('Испания', 'Spain', 'es'), 'b', '1:2', 'reg', 'medium'), fact: 'b', fscore: '0:1', fby: 'reg' },
  M94: { ...P(T('США', 'USA', 'us'), T('Бельгия', 'Belgium', 'be'), 'a', '1:1 (4:3 пен)', 'pen', 'tossup'), fact: 'b', fscore: '1:4', fby: 'reg' },
  M91: { ...P(T('Бразилия', 'Brazil', 'br'), T('Норвегия', 'Norway', 'no'), 'a', '2:1', 'reg', 'medium'), fact: 'b', fscore: '1:2', fby: 'reg' },
  M92: { ...P(T('Мексика', 'Mexico', 'mx'), T('Англия', 'England', 'gb-eng'), 'b', '1:1 (3:4 пен)', 'pen', 'low'), fact: 'b', fscore: '2:3', fby: 'reg' },
  M95: { ...P(T('Аргентина', 'Argentina', 'ar'), T('Египет', 'Egypt', 'eg'), 'a', '1:0', 'reg', 'medium'), fact: 'a', fscore: '3:2', fby: 'reg' },
  M96: { ...P(T('Швейцария', 'Switzerland', 'ch'), T('Колумбия', 'Colombia', 'co'), 'b', '0:1', 'reg', 'medium'), fact: 'a', fscore: '0:0, пен. 4:3', fby: 'pen' },
  // ── 1/4 ──
  M97: { ...P(T('Франция', 'France', 'fr'), T('Марокко', 'Morocco', 'ma'), 'a', '1:0', 'reg', 'medium'), fact: 'a', fscore: '2:0', fby: 'reg' },
  M98: P(T('Испания', 'Spain', 'es'), T('Бельгия', 'Belgium', 'be'), 'a', '1:0', 'reg', 'medium'),
  M99: P(T('Норвегия', 'Norway', 'no'), T('Англия', 'England', 'gb-eng'), 'b', '1:2', 'reg', 'medium'),
  M100: P(T('Аргентина', 'Argentina', 'ar'), T('Швейцария', 'Switzerland', 'ch'), 'a', '1:0', 'reg', 'medium'),
  // ── 1/2 ──
  M101: P(T('Франция', 'France', 'fr'), T('Испания', 'Spain', 'es'), 'b', '1:2', 'reg', 'low'),
  M102: P(T('Англия', 'England', 'gb-eng'), T('Аргентина', 'Argentina', 'ar'), 'b', '1:2 (доп. время)', 'aet', 'medium'),
  // ── Финал + 3-е место ──
  M104: P(T('Испания', 'Spain', 'es'), T('Аргентина', 'Argentina', 'ar'), 'b', '1:1 (3:4 пен)', 'pen', 'tossup'),
  M103: P(T('Франция', 'France', 'fr'), T('Англия', 'England', 'gb-eng'), 'a', '2:1', 'reg', 'medium'),
};

// META[code] = дата+время (МСК), значок арены и погода.
// icon (ключ VenueIcon): roof крыша/кондиц · alt высота · sun/cloud/rain открытый+погода. extra: высота/температура.
const V = (date, time, icon, ru, en, extra) => ({ date, time, icon, ru, en, extra });
const META = {
  M73: V('28.06', '22:00', 'roof', 'Лос-Анджелес', 'Los Angeles', ''),
  M74: V('29.06', '23:30', 'rain', 'Бостон', 'Boston', ' · 26°'),
  M75: V('30.06', '04:00', 'sun', 'Монтеррей', 'Monterrey', ' · 35°'),
  M76: V('29.06', '20:00', 'roof', 'Хьюстон', 'Houston', ''),
  M77: V('01.07', '00:00', 'cloud', 'Нью-Йорк', 'New York', ' · 30°'),
  M78: V('30.06', '20:00', 'roof', 'Даллас', 'Dallas', ''),
  M79: V('01.07', '04:00', 'alt', 'Мехико', 'Mexico City', ' · 2200м'),
  M80: V('01.07', '19:00', 'roof', 'Атланта', 'Atlanta', ''),
  M81: V('02.07', '03:00', 'sun', 'Санта-Клара', 'Santa Clara', ' · 27°'),
  M82: V('01.07', '23:00', 'cloud', 'Сиэтл', 'Seattle', ' · 24°'),
  M83: V('03.07', '02:00', 'rain', 'Торонто', 'Toronto', ' · 26°'),
  M84: V('02.07', '22:00', 'roof', 'Лос-Анджелес', 'Los Angeles', ''),
  M85: V('03.07', '06:00', 'roof', 'Ванкувер', 'Vancouver', ''),
  M86: V('04.07', '01:00', 'rain', 'Майами', 'Miami', ' · 32°'),
  M87: V('04.07', '04:30', 'rain', 'Канзас-Сити', 'Kansas City', ' · 32°'),
  M88: V('03.07', '21:00', 'roof', 'Даллас', 'Dallas', ''),
  M89: V('05.07', '00:00', 'rain', 'Филадельфия', 'Philadelphia', ' · 31°'),
  M90: V('04.07', '20:00', 'roof', 'Хьюстон', 'Houston', ''),
  M91: V('05.07', '23:00', 'cloud', 'Нью-Йорк', 'New York', ' · 30°'),
  M92: V('06.07', '03:00', 'alt', 'Мехико', 'Mexico City', ' · 2200м'),
  M93: V('06.07', '22:00', 'roof', 'Даллас', 'Dallas', ''),
  M94: V('07.07', '03:00', 'cloud', 'Сиэтл', 'Seattle', ' · 24°'),
  M95: V('07.07', '19:00', 'roof', 'Атланта', 'Atlanta', ''),
  M96: V('07.07', '23:00', 'roof', 'Ванкувер', 'Vancouver', ''),
  M97: V('09.07', '23:00', 'rain', 'Бостон', 'Boston', ' · 26°'),
  M98: V('10.07', '22:00', 'roof', 'Лос-Анджелес', 'Los Angeles', ''),
  M99: V('12.07', '00:00', 'rain', 'Майами', 'Miami', ' · 32°'),
  M100: V('12.07', '04:00', 'rain', 'Канзас-Сити', 'Kansas City', ' · 32°'),
  M101: V('14.07', '22:00', 'roof', 'Даллас', 'Dallas', ''),
  M102: V('15.07', '22:00', 'roof', 'Атланта', 'Atlanta', ''),
  M103: V('19.07', '00:00', 'rain', 'Майами', 'Miami', ' · 32°'),
  M104: V('19.07', '22:00', 'cloud', 'Нью-Йорк', 'New York', ' · 30°'),
};

// Раскладка полусеток (порядок ячеек = соседство пар для линий)
const TOP = { side: 'top', r32: ['M74', 'M77', 'M73', 'M75', 'M83', 'M84', 'M81', 'M82'], r16: ['M89', 'M90', 'M93', 'M94'], qf: ['M97', 'M98'], sf: 'M101' };
const BOTTOM = { side: 'bottom', r32: ['M76', 'M78', 'M79', 'M80', 'M86', 'M88', 'M85', 'M87'], r16: ['M91', 'M92', 'M95', 'M96'], qf: ['M99', 'M100'], sf: 'M102' };

// Фидер-граф: какой матч (победитель Wxx / проигравший Lxx) поставляет участника в слот [a,b].
const FEED = {
  M89: ['M74', 'M77'], M90: ['M73', 'M75'], M93: ['M83', 'M84'], M94: ['M81', 'M82'],
  M91: ['M76', 'M78'], M92: ['M79', 'M80'], M95: ['M86', 'M88'], M96: ['M85', 'M87'],
  M97: ['M89', 'M90'], M98: ['M93', 'M94'], M99: ['M91', 'M92'], M100: ['M95', 'M96'],
  M101: ['M97', 'M98'], M102: ['M99', 'M100'], M104: ['M101', 'M102'], M103: ['L101', 'L102'],
};
const feederRef = (code, side) => { const f = FEED[code]; return f ? f[side === 'a' ? 0 : 1] : null; };
// Реальный участник слота: если фидер сыгран — настоящий прошедший (рекурсивно), иначе прогноз AI (PRED[code][side]).
function slotModel(code, side) {
  const p = PRED[code]; const ref = feederRef(code, side);
  if (!ref) return { team: p[side], real: true };           // 1/16: обе команды всегда реальны
  const w = boxOutcome(ref);
  if (w.resolved) return { team: w.team, real: true };
  return { team: p[side], real: false };                    // прогноз: фидер ещё не сыгран
}
// Победитель ('Mxx') или проигравший ('Lxx') бокса, если он уже сыгран.
function boxOutcome(ref) {
  const loser = ref[0] === 'L'; const code = 'M' + ref.slice(1);
  const p = PRED[code];
  if (!p || !p.fact) return { team: null, resolved: false };
  const side = loser ? (p.fact === 'a' ? 'b' : 'a') : p.fact;
  return { team: slotModel(code, side).team, resolved: true };
}

function TeamRow({ code, side, p, lang }) {
  const sm = slotModel(code, side);
  const team = sm.team || { ru: '—', en: '—', cc: null };
  const played = !!p.fact;
  const isWin = played && p.fact === side;
  const isLose = played && p.fact !== side;
  const aiPick = p.win === side;
  // расхождение: реальный участник заменил спрогнозированную AI команду в этом слоте
  const diverged = sm.real && !played && p[side] && team.cc && p[side].cc !== team.cc;
  const cls = 'po-team' + (isWin ? ' win' : isLose ? ' out' : sm.real ? ' real' : ' proj');
  let chip = null;
  if (played) {
    if (isWin) chip = aiPick ? <i className="po-chip aiwin" title={trL(lang, 'AI угадал проход', 'AI called it')}>AI ✓</i> : <i className="po-chip fact" title={trL(lang, 'прошёл', 'advanced')}>✓</i>;
    else if (aiPick) chip = <i className="po-chip aimiss" title={trL(lang, 'AI ошибся', 'AI missed')}>AI ✗</i>;
  } else if (aiPick) {
    chip = diverged
      ? <i className="po-chip aibust" title={trL(lang, 'пик AI не прошёл в этот раунд', 'AI pick did not reach this round')}>AI</i>
      : <i className="po-chip ai ghost" title={trL(lang, 'прогноз AI на победителя', 'AI pick to win')}>AI</i>;
  }
  return (
    <div className={cls}>
      <Flag cc={team.cc} />
      <span className="po-tn">{teamLabel(team, lang)}</span>
      <span className="po-chips">
        {p.pasha === side && <i className="po-chip pa" title={trL(lang, 'Прогноз Паши', 'Pasha pick')}>П</i>}
        {chip}
      </span>
    </div>
  );
}

// Обратная сторона сыгранного бокса — исходный прогноз AI до матча (счёт, кого вёл AI).
// Счёт всегда в ОДНОМ и том же месте карточки (верх, справа) — и на факте, и на прогнозе,
// чтобы при флипе глаз не искал его по-новому (фидбэк Влада).
function FlipBack({ code, p, lang }) {
  return (
    <>
      <div className="po-br-tag">
        <span>{code}</span>
        <span className="po-fb-badge">{trL(lang, 'прогноз', 'pre-match')}</span>
        <span className="po-mb-score">{scoreText(p.score, lang)}</span>
      </div>
      <div className="po-team real">
        <Flag cc={p.a.cc} />
        <span className="po-tn">{teamLabel(p.a, lang)}</span>
        {p.win === 'a' && <span className="po-chips"><i className="po-chip ai ghost">AI</i></span>}
      </div>
      <div className="po-team real">
        <Flag cc={p.b.cc} />
        <span className="po-tn">{teamLabel(p.b, lang)}</span>
        {p.win === 'b' && <span className="po-chips"><i className="po-chip ai ghost">AI</i></span>}
      </div>
      {(p.conf === 'tossup' || p.conf === 'low') && (
        <div className="po-mb-meta">
          <span className={'po-conf ' + p.conf}>{p.conf === 'tossup' ? '50/50' : trL(lang, 'слабо', 'soft')}</span>
        </div>
      )}
      <span className="po-flip-hint">↺ {trL(lang, 'назад к результату', 'back to the result')}</span>
    </>
  );
}

function MatchBox({ code, kind, lang }) {
  const p = PRED[code];
  const [flipped, setFlipped] = useState(false);
  if (!p) return null;
  const m = META[code];
  const played = !!p.fact;
  const shownScore = played ? p.fscore : p.score;
  const shownBy = played ? p.fby : p.by;
  // сравниваем не строки (форматы прогноза и факта различаются), а цифры счёта + способ развязки
  const scoreKey = (s, by) => (by || 'reg') + '|' + (((s || '').match(/\d+/g)) || []).join(':');
  const hit = played && p.fscore && p.score && scoreKey(p.score, p.by) === scoreKey(p.fscore, p.fby);

  const front = (
    <>
      <div className="po-br-tag">
        <span>{code}</span>
        {played && <span className="po-ft">FT</span>}
        {!played && (p.conf === 'tossup' || p.conf === 'low') && (
          <span className={'po-conf ' + p.conf}>{p.conf === 'tossup' ? '50/50' : trL(lang, 'слабо', 'soft')}</span>
        )}
        {shownScore && (
          <span className={'po-mb-score' + (hit ? ' hit' : played ? ' miss' : '')}>
            {played ? (hit ? '✓ ' : '✗ ') : trL(lang, 'прогноз ', 'proj. ')}{scoreText(shownScore, lang)}
          </span>
        )}
      </div>
      {m && (
        <div className="po-mb-meta">
          <span className="po-mb-dt">{m.date} · {m.time}</span>
          <span className="po-mb-venue"><VenueIcon k={m.icon} size={11} /> {trL(lang, m.ru, m.en)}{m.extra}</span>
        </div>
      )}
      <TeamRow code={code} side="a" p={p} lang={lang} />
      <TeamRow code={code} side="b" p={p} lang={lang} />
      {played && <span className="po-flip-hint">↺ {trL(lang, 'нажми — прогноз до матча', 'tap for the pre-match pick')}</span>}
    </>
  );

  const boxCls = 'po-br-box mb ' + kind + (played ? ' played' : '') + (shownBy === 'pen' && !hit ? ' pen' : '');

  if (!played) return <div className={boxCls}>{front}</div>;

  return (
    <div
      className={boxCls + ' flip-card'}
      onClick={() => setFlipped((f) => !f)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFlipped((f) => !f); } }}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      title={flipped
        ? trL(lang, 'нажми — вернуться к результату', 'click to go back to the result')
        : trL(lang, 'нажми — прогноз AI до матча', "click for AI's pre-match pick")}
    >
      <div className={'po-flip-inner' + (flipped ? ' flipped' : '')}>
        <div className="po-flip-face po-flip-front">{front}</div>
        <div className="po-flip-face po-flip-back"><FlipBack code={code} p={p} lang={lang} /></div>
      </div>
    </div>
  );
}

function Half({ cfg, lang }) {
  const cell = (code, kind) => <div className="po-br-cell" key={code}><MatchBox code={code} kind={kind} lang={lang} /></div>;
  return (
    <div className="po-bracket">
      <div className={'po-br-half ' + cfg.side}>
        <div className="po-br-round r-32">{cfg.r32.map((c) => cell(c, 'r32'))}</div>
        <div className="po-br-round">{cfg.r16.map((c) => cell(c, 'r16'))}</div>
        <div className="po-br-round">{cfg.qf.map((c) => cell(c, 'qf'))}</div>
        <div className="po-br-round is-last">{cell(cfg.sf, 'sf')}</div>
      </div>
    </div>
  );
}

export default function PlayoffsView() {
  const lang = useLang();
  const tr = (ru, en) => trL(lang, ru, en);

  // Третьи места — ОКОНЧАТЕЛЬНО: 8 лучших третьих посеяны.
  const THOUGHTS = [
    [tr('Прогноз AI: чемпион — Аргентина', 'AI forecast: champion — Argentina'),
     tr('Сетка дошла до 1/4, и чемпион устоял: машина ведёт Аргентину мимо Египта (уже пройден — камбэк 3:2), Швейцарии и Англии — к финалу с Испанией, где всё решают серия пенальти и Дибу Мартинес. По Elo Аргентина — №1 (выше Франции и Испании), у Opta её шансы на титул выросли сильнее всех после группы.',
        'The bracket has reached the quarters and the champion held: the model takes Argentina past Egypt (already done — a 3:2 comeback), Switzerland and England, to a final against Spain settled by a shootout and Dibu Martínez. Elo ranks Argentina #1 (above France and Spain), and Opta’s title chances for them grew more than anyone’s after the groups.')],
    [tr('Пенальти и доп. время — по статистике', 'Penalties and extra time — calibrated'),
     tr('Плей-офф уже дал серию сенсаций через пенальти — в 1/16 (Марокко и Парагвай прошли с точки) и в 1/8 (Швейцария выбила Колумбию 4:3 после сухого 0:0). Впереди лотерея снова маячит в Аргентина–Швейцария и в финале — это историческая норма: 38% нокаутов не укладываются в 90 минут. Серия — почти монетка: решают вратарь и нервы, поэтому все наши «пенальтийные» узлы помечены низкой уверенностью.',
        'The knockouts have already produced a run of shootout upsets — in the round of 32 (Morocco and Paraguay went through from the spot) and the round of 16 (Switzerland knocked Colombia out 4:3 after a dry 0:0). The lottery looms again in Argentina–Switzerland and the final — the historical norm: 38% of knockout games outlive the 90 minutes. A shootout is near a coin-flip — keeper and nerve decide, so all our shootout nodes carry low confidence.')],
    [tr('Сенсации по версии AI', 'Upsets per the model'),
     tr('Сетку изрядно перетряхнуло: Португалия, Бразилия, США, Колумбия — все уже дома. Дальше машина ждёт осторожно: Швейцария (лучший автобус стадии) способна дотащить Аргентину до пенальти, как в 2014-м; Марокко с Буну — реальная угроза Франции в серии; а Норвегия Холанда, уже снявшая Бразилию, — самый живой андердог против латаной Англии.',
        'The bracket has been shaken up hard: Portugal, Brazil, the USA and Colombia are all home. From here the model treads carefully: Switzerland (the best bus of the round) can drag Argentina to penalties as in 2014; Morocco with Bounou are a real shootout threat to France; and Haaland’s Norway, already conquerors of Brazil, are the liveliest underdog against a patched England.')],
    [tr('Две половины — два мира', 'Two halves, two worlds'),
     tr('Верхняя половина мягче: Франция, Марокко, Испания, Бельгия. Нижняя жёстче: Норвегия Холанда, Англия, Аргентина, Швейцария. Поэтому наш финал — победитель верхней (Испания, через полуфинал-реванш Евро-2024 с Францией) против выжившего из нижней (Аргентина).',
        'The top half is kinder: France, Morocco, Spain, Belgium. The bottom half is tougher: Haaland’s Norway, England, Argentina, Switzerland. Hence our final — the top-half winner (Spain, via a Euro 2024 rematch semi with France) against the bottom-half survivor (Argentina).')],
    [tr('Рынок перегрел Францию', 'The market has overheated France'),
     tr('Рынок держит Францию главным фаворитом на титул — а модели (Opta, Elo) видят вдвое скромнее и выше ставят Испанию. Наш полуфинал Франция–Испания идёт против рыночного фаворита: Испания свежее, глубже и не пропустила ни разу за турнир. Аргентина по Elo — №1, но у рынка лишь вторая-третья.',
        'The market keeps France the clear title favourite — while the models (Opta, Elo) see half that and rate Spain higher. Our France–Spain semi goes against the market favourite: Spain are fresher, deeper and haven’t conceded once all tournament. Argentina are Elo #1 but only second or third with the market.')],
  ];

  // Подводные камни — по урокам апсетов 3 последних ЧМ (research/upsets).
  // Первый элемент — уровень светофора ('red'/'mid'), рисуется штриховым кружком RiskDot (эмодзи в хроме запрещены).
  const RISKS = [
    ['red', tr('Испания в финале — самый хрупкий «уверенный» узел', 'Spain in the final — the most fragile «confident» node'),
     tr('Профиль стерильного владения без вертикали — ровно тот, что вылетел в 2018 (Россия) и 2022 (Марокко) от плотного блока и пенальти. Мы ведём Испанию в финал — исторически это красная зона.',
        'A sterile-possession profile with no vertical thrust — exactly what went out in 2018 (Russia) and 2022 (Morocco) to a deep block and penalties. We have Spain reaching the final — historically a red zone.')],
    ['mid', tr('Чемпион-Аргентина — против рынка', 'Champion Argentina — against the market'),
     tr('Наш чемпион совпал с Elo (там Аргентина №1) и с трендом Opta (самый большой рост шансов после группы), но рынок фаворитом держит Францию с большим отрывом, Аргентина — вторая (~18%). Титул Аргентины — ставка на Elo-семью и фактор Дибу, а не на рыночный консенсус.',
        'Our champion matches Elo (Argentina #1 there) and Opta’s trend (the biggest post-group jump in title chances), but the market keeps France a clear favourite with Argentina second (~18%). An Argentina title backs the Elo family and the Dibu factor, not the market consensus.')],
    ['mid', tr('Серии пенальти — это монетки', 'Shootouts are coin-flips'),
     tr('Серии сыпались весь плей-офф, и почти все сенсации родом оттуда (последняя — Швейцария 4:3 Колумбия). Впереди лотерея снова живая — в 1/4 и в финале. Даже если частоту угадали, монетки могут лечь иначе и сдвинуть полуфиналистов или чемпиона. «Класс в серии» не гарантирует ничего — Дибу, Ливакович, Буну решали вопреки классу.',
        'Shootouts have punctuated the whole knockout run, and almost every upset came from one (the latest: Switzerland 4:3 Colombia). The lottery is live again — in the quarters and the final. Even with the frequency called right, the coins can land differently and shift the semifinalists or the champion. «Class in a shootout» guarantees nothing — Dibu, Livaković, Bono won against the odds.')],
    ['mid', tr('Норвегия Холанда — против латаной Англии', 'Haaland’s Norway — against a patched England'),
     tr('Наш пик — проход Англии, но она без дисквалифицированного Куансы и с латаной правой бровкой ловит вертикаль Холанда в пекле Майами. Норвегия только что сняла Бразилию — апсет-магия реальна; серия упирается в Пикфорда, но 90 минут открыты.',
        'Our pick is England to advance, but without the suspended Quansah and with a patched right flank they must contain Haaland’s vertical game in the Miami heat. Norway have just knocked out Brazil — the upset magic is real; a shootout runs into Pickford, but the 90 minutes are open.')],
    ['mid', tr('Аргентина и низкие блоки — хроническая мука', 'Argentina against deep blocks — a chronic struggle'),
     tr('Кабо-Верде и Египет уже показали рецепт против Аргентины: автобус плюс вратарь — и она горит, а потом вытягивает на классе (0:2 → 3:2 с Египтом). Теперь Швейцария Кобеля — лучший блок из всех: сухой 0:0 с Колумбией и проход по пенальти. Мы ведём Аргентину дальше минимальным счётом, но это живой кандидат дотащить её до лотереи.',
        'Cape Verde and Egypt already showed the recipe against Argentina: a bus plus a keeper, and they wobble before rescuing it on class (0:2 → 3:2 vs Egypt). Now Kobel’s Switzerland are the best block yet: a dry 0:0 with Colombia and a shootout win. We take Argentina through by the narrowest margin, but it’s a live candidate to drag them into the lottery.')],
  ];

  // Как считали + что заметили (кухня прогноза).
  const METHOD = [
    [tr('Движок матч-за-матчем', 'A match-by-match engine'),
     tr('Каждый из 32 матчей плей-офф считал отдельный аналитик-агент — по нашим накопленным досье команд, постмортемам, разборам групп и урокам турнира, плюс свежие травмы, погода и стадион. Победитель обязателен: при ничьей решается серия пенальти.',
        'Each of the 32 knockout ties was worked by a separate analyst agent — using our accumulated team dossiers, postmortems, group reviews and tournament lessons, plus fresh injuries, weather and venue. A winner is mandatory: level games are settled on penalties.')],
    [tr('Калибровка по реальности', 'Calibrated against reality'),
     tr('Сверили сетку с голевой статистикой плей-офф трёх последних ЧМ и с макро-линиями букмекеров (овертаймы, пенальти) — и подрезали перекос: было 9 серий пенальти, стало 6 (как ждёт рынок), а число голов вышло на историческую норму ~2.5 за матч.',
        'We checked the bracket against the goal stats of the last three World Cup knockouts and the bookmaker macro lines (extra time, shootouts) — and trimmed the skew: 9 shootouts became 6 (as the market expects), and the goal count settled on the historical norm of ~2.5 per match.')],
    [tr('Сверка с компьютерными моделями', 'Cross-checked with computer models'),
     tr('После 1/16 прогнали сверку заново: Opta, Elo, Squawka, биржи и аутрайты буков. Elo подтверждает чемпиона (Аргентина №1), Opta фиксирует её самый большой рост после группы, а расхождение рынка с моделями по Франции (рынок даёт вдвое больше моделей) удержало нас от смены полуфинального пика: Испания остаётся.',
        'After the round of 32 we re-ran the cross-check: Opta, Elo, Squawka, the exchanges and bookmaker outrights. Elo confirms the champion (Argentina #1), Opta logs their biggest post-group jump, and the market-vs-models gap on France (the market prices them at double the models) kept us from flipping the semifinal pick: Spain stays.')],
    [tr('Что заметили интересного', 'What we found interesting'),
     tr('Плей-офф — низовой: четвертьфиналы самые сухие (~2 гола за матч), финалы и полуфиналы тоже. Камбэков «в победу» за 90 минут почти не бывает — отстающий лишь дотягивает матч до серии. А матч за 3-е место наоборот: открытый и почти никогда не доходит до пенальти.',
        'The knockouts are low-scoring: quarter-finals are the driest (~2 goals a game), finals and semis too. Comebacks rarely turn into wins inside 90 minutes — the trailing side mostly just drags the tie to a shootout. The third-place game is the opposite: open, and almost never goes to penalties.')],
  ];

  return (
    <div>
      <h1>{tr('Плей-офф · прогноз AI', 'Playoffs · AI forecast')}</h1>
      <p className="po-intro">
        {tr('Полный прогноз AI по всей сетке — матч за матчем. Сыгранные боксы заливаются и помечаются FT: прошедшая команда — жирная с зелёной ✓, счёт зеленеет, если точный счёт AI зашёл. Кликни по сыгранному боксу — карточка перевернётся и покажет исходный прогноз AI до матча (кого вёл, какой счёт называл). Дальше по сетке сплошная тёмная команда — та, что реально прошла сюда, а бледный курсив — ещё не сыгранный прогноз (он сам подменяется фактом, как только нужный матч завершён).',
            'The full AI forecast across the whole bracket — match by match. Played ties are filled and tagged FT: the team that advanced is bold with a green ✓, and the score turns green if AI nailed the exact scoreline. Tap a played box — the card flips to show AI’s original pre-match pick (who it backed, what score it called). Deeper in the bracket a solid dark team is one that has really arrived, while faint italic is a not-yet-played forecast (it swaps itself for the real result as soon as the feeding tie finishes).')}
      </p>

      {/* Финальная наклейка чемпиона: белая, офсетная тень, лёгкий наклон, штриховой кубок слева */}
      <div className="po-champ">
        <i className="scotch" aria-hidden="true" style={{ top: '-10px', left: '50%', transform: 'translateX(-50%) rotate(-2deg)' }} />
        <span className="po-champ-ic"><TrophyIcon size={34} /></span>
        <div className="po-champ-body">
          <span className="po-champ-cap">{tr('Прогноз AI · итог сетки', 'AI forecast · bracket call')}</span>
          <span className="po-champ-row"><b>{tr('Чемпион', 'Champion')}</b> <Flag cc="ar" /> {tr('Аргентина', 'Argentina')}</span>
          <span className="po-champ-row sub"><b>{tr('Финал', 'Final')}</b> {tr('Испания', 'Spain')} <span className="num">1:1</span> {tr('Аргентина', 'Argentina')} · {tr('пен', 'pens')} <span className="num">3:4</span></span>
          <span className="po-champ-row sub"><b>{tr('3-е место', 'Third')}</b> <Flag cc="fr" /> {tr('Франция', 'France')}</span>
        </div>
      </div>

      {/* Легенда альбома: условные обозначения одной моно-плашкой, элементы через точечные отбивки */}
      <div className="po-key">
        <span className="po-key-cap">{tr('Условные обозначения', 'Key')}</span>
        <div className="po-key-row">
          <span className="po-lg"><i className="po-chip ai ghost">AI</i>{tr('прогноз AI на победителя', 'AI pick to win')}</span>
          <span className="po-lg"><i className="po-chip aiwin">AI ✓</i>{tr('угадал проход', 'called the winner')}</span>
          <span className="po-lg"><i className="po-chip aimiss">AI ✗</i>{tr('мимо с победителем', 'missed the winner')}</span>
          <span className="po-lg"><i className="po-chip fact">✓</i>{tr('прошёл', 'advanced')}</span>
          <span className="po-lg"><i className="po-ft">FT</i>{tr('матч сыгран', 'tie played')}</span>
        </div>
        <div className="po-key-row">
          <span className="po-lg"><b className="po-lg-solid">{tr('тёмный', 'solid')}</b>{tr('реально дошёл сюда', 'really advanced here')}</span>
          <span className="po-lg"><i className="po-lg-proj">{tr('бледный курсив', 'faint italic')}</i>{tr('прогноз, матч впереди', 'forecast, tie not played')}</span>
          <span className="po-lg"><span className="po-mb-score hit">✓ 2:0</span>{tr('точный счёт AI зашёл', 'AI nailed the score')}</span>
          <span className="po-lg"><span className="po-mb-score miss">✗ 2:0</span>{tr('счёт мимо — нажми карточку, там прогноз', 'score missed — tap the card for the pick')}</span>
        </div>
        <div className="po-key-row">
          <span className="po-lg"><VenueIcon k="roof" />{tr('крыша / кондиц.', 'roof / AC')}</span>
          <span className="po-lg"><VenueIcon k="alt" />{tr('высота', 'altitude')}</span>
          <span className="po-lg"><VenueIcon k="sun" /><VenueIcon k="cloud" /><VenueIcon k="rain" />{tr('погода — открытый стадион', 'weather — open-air')}</span>
          <span className="po-lg">{tr('время МСК', 'times MSK')}</span>
          <span className="po-lg"><i className="po-conf tossup">50/50</i>{tr('серия пенальти / равный матч', 'shootout / even tie')}</span>
          <span className="po-lg"><i className="po-conf low">{tr('слабо', 'soft')}</i>{tr('шаткий прогноз', 'shaky pick')}</span>
          <span className="po-lg">{tr('без метки — уверенный прогноз', 'no tag — confident pick')}</span>
        </div>
      </div>

      <div className="sect"><span className="sect-label">{tr('Верхняя половина', 'Top half')}</span></div>
      <Half cfg={TOP} lang={lang} />

      <div className="sect"><span className="sect-label">{tr('Нижняя половина · жёстче', 'Bottom half · tougher')}</span></div>
      <Half cfg={BOTTOM} lang={lang} />

      <div className="sect"><span className="sect-label">{tr('Финал · MetLife · 19 июля', 'Final · MetLife · Jul 19')}</span></div>
      <section className="block po-br-final-wrap">
        <div className="po-fin-box"><MatchBox code="M104" kind="fin" lang={lang} /></div>
        <p className="po-intro" style={{ textAlign: 'center', margin: '4px 0' }}>
          {tr('Матч за 3-е место (M103):', 'Third-place play-off (M103):')}
        </p>
        <div className="po-fin-box third"><MatchBox code="M103" kind="fin" lang={lang} /></div>
      </section>

      <div className="sect"><span className="sect-label">{tr('Подводные камни · уроки прошлых ЧМ', 'Pitfalls · lessons from past World Cups')}</span></div>
      <section className="block po-thoughts">
        <p className="po-intro" style={{ marginTop: 0 }}>
          {tr('Прогноз честно «по фаворитам»: где можем — ведём сильнейшего, а монетки оставляем модально (метки «50/50»/«слабо»), число серий пенальти откалибровано под статистику. Вот где сетка всё ещё тоньше всего.',
              'The forecast is honestly «chalk»: where we can we back the stronger side, the coin-flips stay modal (tagged «50/50»/«soft»), and the number of shootouts is calibrated to the stats. Here is where the bracket is still thinnest.')}
        </p>
        {RISKS.map(([lvl, h, b], i) => (
          <div key={i} className="po-thought">
            <div className="po-thought-h"><RiskDot lvl={lvl} />{h}</div>
            <div className="po-thought-b">{b}</div>
          </div>
        ))}
      </section>

      <div className="sect"><span className="sect-label">{tr('Расклады и мысли', 'Reads & thoughts')}</span></div>
      <section className="block po-thoughts">
        {THOUGHTS.map(([h, b], i) => (
          <div key={i} className="po-thought">
            <div className="po-thought-h">{h}</div>
            <div className="po-thought-b">{b}</div>
          </div>
        ))}
      </section>

      <div className="sect"><span className="sect-label">{tr('Как мы это считали · что заметили', 'How we built this · what we noticed')}</span></div>
      <section className="block po-thoughts">
        {METHOD.map(([h, b], i) => (
          <div key={i} className="po-thought">
            <div className="po-thought-h">{h}</div>
            <div className="po-thought-b">{b}</div>
          </div>
        ))}
      </section>

      <p className="foot-note">
        {tr('Прогноз построен нашим движком по 32 матчам (форма, стиль, стадионы, пенальти) и сохранён по каждому матчу отдельно. По ходу плей-офф метки П (Паша) и ✓ (факт) встанут рядом с прогнозом AI — будет видно, кто угадал.',
            'The forecast was built by our engine across 32 matches (form, style, stadiums, shootouts) and saved per match. As the knockouts unfold, the П (Pasha) and ✓ (result) chips will sit next to the AI pick — so you can see who got it right.')}
      </p>
    </div>
  );
}
