'use client';
import { useLang } from '@/app/providers';

/* Сетка плей-офф ЧМ-2026 с прогнозом AI матч за матчем (две полусетки слева-направо).
   В каждом боксе подсвечен предсказанный победитель + метка AI; рядом место под метки
   П (Паша) и ✓ (факт) — добавляются позже через поля pasha/fact в PRED.
   Контент двуязычный через локальный tr(ru,en). */

function Flag({ cc }) {
  if (!cc) return <span className="po-flag po-flag-tbd" aria-hidden="true" />;
  return (
    <img className="po-flag" src={`https://flagcdn.com/w40/${cc}.png`}
      srcSet={`https://flagcdn.com/w80/${cc}.png 2x`} width={22} height={22} alt="" loading="lazy" />
  );
}

// счёт: пер-перевод хвостов для EN
function scoreText(s, lang) {
  if (!s || lang !== 'en') return s;
  return s.replace('пен', 'pen').replace('доп. время', 'a.e.t.');
}

export default function PlayoffsView() {
  const lang = useLang();
  const tr = (ru, en) => (lang === 'en' ? en : ru);
  const T = (ru, en, cc) => ({ t: tr(ru, en), cc });

  // PRED[code] = { a, b, win:'a'|'b', score, by:'reg'|'aet'|'pen', conf, pasha?, fact? }
  // pasha/fact — позже: 'a'/'b' (кого ведёт Паша / кто реально прошёл).
  const P = (a, b, win, score, by, conf) => ({ a, b, win, score, by, conf });
  const PRED = {
    // ── 1/16 ──
    M73: P(T('ЮАР', 'South Africa', 'za'), T('Канада', 'Canada', 'ca'), 'b', '0:1', 'reg', 'medium'),
    M74: P(T('Германия', 'Germany', 'de'), T('Парагвай', 'Paraguay', 'py'), 'a', '2:1', 'reg', 'medium'),
    M75: P(T('Нидерланды', 'Netherlands', 'nl'), T('Марокко', 'Morocco', 'ma'), 'a', '2:1 (доп. время)', 'aet', 'low'),
    M77: P(T('Франция', 'France', 'fr'), T('Швеция', 'Sweden', 'se'), 'a', '3:1', 'reg', 'high'),
    M81: P(T('США', 'USA', 'us'), T('Босния', 'Bosnia', 'ba'), 'a', '2:1', 'reg', 'high'),
    M82: P(T('Бельгия', 'Belgium', 'be'), T('Сенегал', 'Senegal', 'sn'), 'a', '2:1', 'reg', 'medium'),
    M83: P(T('Португалия', 'Portugal', 'pt'), T('Хорватия', 'Croatia', 'hr'), 'a', '2:1', 'reg', 'medium'),
    M84: P(T('Испания', 'Spain', 'es'), T('Австрия', 'Austria', 'at'), 'a', '2:0', 'reg', 'high'),
    M76: P(T('Бразилия', 'Brazil', 'br'), T('Япония', 'Japan', 'jp'), 'a', '2:0', 'reg', 'medium'),
    M78: P(T('Кот-д’Ивуар', 'Côte d’Ivoire', 'ci'), T('Норвегия', 'Norway', 'no'), 'b', '1:2', 'reg', 'medium'),
    M79: P(T('Мексика', 'Mexico', 'mx'), T('Эквадор', 'Ecuador', 'ec'), 'a', '1:0', 'reg', 'medium'),
    M80: P(T('Англия', 'England', 'gb-eng'), T('ДР Конго', 'DR Congo', 'cd'), 'a', '2:0', 'reg', 'medium'),
    M85: P(T('Швейцария', 'Switzerland', 'ch'), T('Алжир', 'Algeria', 'dz'), 'a', '2:1', 'reg', 'medium'),
    M86: P(T('Аргентина', 'Argentina', 'ar'), T('Кабо-Верде', 'Cape Verde', 'cv'), 'a', '3:0', 'reg', 'high'),
    M87: P(T('Колумбия', 'Colombia', 'co'), T('Гана', 'Ghana', 'gh'), 'a', '2:0', 'reg', 'medium'),
    M88: P(T('Австралия', 'Australia', 'au'), T('Египет', 'Egypt', 'eg'), 'b', '1:1 (2:4 пен)', 'pen', 'low'),
    // ── 1/8 ──
    M89: P(T('Германия', 'Germany', 'de'), T('Франция', 'France', 'fr'), 'b', '1:2', 'reg', 'medium'),
    M90: P(T('Канада', 'Canada', 'ca'), T('Нидерланды', 'Netherlands', 'nl'), 'b', '1:2', 'reg', 'medium'),
    M93: P(T('Португалия', 'Portugal', 'pt'), T('Испания', 'Spain', 'es'), 'b', '1:2', 'reg', 'medium'),
    M94: P(T('США', 'USA', 'us'), T('Бельгия', 'Belgium', 'be'), 'b', '1:1 (2:4 пен)', 'pen', 'tossup'),
    M91: P(T('Бразилия', 'Brazil', 'br'), T('Норвегия', 'Norway', 'no'), 'a', '2:1', 'reg', 'medium'),
    M92: P(T('Мексика', 'Mexico', 'mx'), T('Англия', 'England', 'gb-eng'), 'b', '1:1 (2:4 пен)', 'pen', 'tossup'),
    M95: P(T('Аргентина', 'Argentina', 'ar'), T('Египет', 'Egypt', 'eg'), 'a', '2:0', 'reg', 'high'),
    M96: P(T('Швейцария', 'Switzerland', 'ch'), T('Колумбия', 'Colombia', 'co'), 'b', '1:1 (3:4 пен)', 'pen', 'tossup'),
    // ── 1/4 ──
    M97: P(T('Франция', 'France', 'fr'), T('Нидерланды', 'Netherlands', 'nl'), 'a', '2:1', 'reg', 'medium'),
    M98: P(T('Испания', 'Spain', 'es'), T('Бельгия', 'Belgium', 'be'), 'a', '2:1', 'reg', 'medium'),
    M99: P(T('Бразилия', 'Brazil', 'br'), T('Англия', 'England', 'gb-eng'), 'a', '1:1 (4:3 пен)', 'pen', 'tossup'),
    M100: P(T('Аргентина', 'Argentina', 'ar'), T('Колумбия', 'Colombia', 'co'), 'a', '2:1', 'reg', 'medium'),
    // ── 1/2 ──
    M101: P(T('Франция', 'France', 'fr'), T('Испания', 'Spain', 'es'), 'b', '1:1 (3:4 пен)', 'pen', 'tossup'),
    M102: P(T('Бразилия', 'Brazil', 'br'), T('Аргентина', 'Argentina', 'ar'), 'b', '1:1 (2:4 пен)', 'pen', 'tossup'),
    // ── Финал + 3-е место ──
    M104: P(T('Испания', 'Spain', 'es'), T('Аргентина', 'Argentina', 'ar'), 'b', '1:1 (3:4 пен)', 'pen', 'tossup'),
    M103: P(T('Франция', 'France', 'fr'), T('Бразилия', 'Brazil', 'br'), 'a', '1:1 (4:3 пен)', 'pen', 'tossup'),
  };

  // META[code] = дата+время (МСК), значок арены и погода.
  // icon: 🏟 крыша/кондиц · ⛰ высота · ☀/⛅/🌧 открытый+погода. extra: высота/температура.
  const V = (date, time, icon, ru, en, extra) => ({ date, time, icon, ru, en, extra });
  const META = {
    M73: V('28.06', '22:00', '🏟', 'Лос-Анджелес', 'Los Angeles', ''),
    M74: V('29.06', '23:30', '🌧', 'Бостон', 'Boston', ' · 26°'),
    M75: V('30.06', '04:00', '☀', 'Монтеррей', 'Monterrey', ' · 35°'),
    M76: V('29.06', '20:00', '🏟', 'Хьюстон', 'Houston', ''),
    M77: V('01.07', '00:00', '⛅', 'Нью-Йорк', 'New York', ' · 30°'),
    M78: V('30.06', '20:00', '🏟', 'Даллас', 'Dallas', ''),
    M79: V('01.07', '04:00', '⛰', 'Мехико', 'Mexico City', ' · 2200м'),
    M80: V('01.07', '19:00', '🏟', 'Атланта', 'Atlanta', ''),
    M81: V('02.07', '03:00', '☀', 'Санта-Клара', 'Santa Clara', ' · 27°'),
    M82: V('01.07', '23:00', '⛅', 'Сиэтл', 'Seattle', ' · 24°'),
    M83: V('03.07', '02:00', '🌧', 'Торонто', 'Toronto', ' · 26°'),
    M84: V('02.07', '22:00', '🏟', 'Лос-Анджелес', 'Los Angeles', ''),
    M85: V('03.07', '06:00', '🏟', 'Ванкувер', 'Vancouver', ''),
    M86: V('04.07', '01:00', '🌧', 'Майами', 'Miami', ' · 32°'),
    M87: V('04.07', '04:30', '🌧', 'Канзас-Сити', 'Kansas City', ' · 32°'),
    M88: V('03.07', '21:00', '🏟', 'Даллас', 'Dallas', ''),
    M89: V('05.07', '00:00', '🌧', 'Филадельфия', 'Philadelphia', ' · 31°'),
    M90: V('04.07', '20:00', '🏟', 'Хьюстон', 'Houston', ''),
    M91: V('05.07', '23:00', '⛅', 'Нью-Йорк', 'New York', ' · 30°'),
    M92: V('06.07', '03:00', '⛰', 'Мехико', 'Mexico City', ' · 2200м'),
    M93: V('06.07', '22:00', '🏟', 'Даллас', 'Dallas', ''),
    M94: V('07.07', '03:00', '⛅', 'Сиэтл', 'Seattle', ' · 24°'),
    M95: V('07.07', '19:00', '🏟', 'Атланта', 'Atlanta', ''),
    M96: V('07.07', '23:00', '🏟', 'Ванкувер', 'Vancouver', ''),
    M97: V('09.07', '23:00', '🌧', 'Бостон', 'Boston', ' · 26°'),
    M98: V('10.07', '22:00', '🏟', 'Лос-Анджелес', 'Los Angeles', ''),
    M99: V('12.07', '00:00', '🌧', 'Майами', 'Miami', ' · 32°'),
    M100: V('12.07', '04:00', '🌧', 'Канзас-Сити', 'Kansas City', ' · 32°'),
    M101: V('14.07', '22:00', '🏟', 'Даллас', 'Dallas', ''),
    M102: V('15.07', '22:00', '🏟', 'Атланта', 'Atlanta', ''),
    M103: V('19.07', '00:00', '🌧', 'Майами', 'Miami', ' · 32°'),
    M104: V('19.07', '22:00', '⛅', 'Нью-Йорк', 'New York', ' · 30°'),
  };

  // Раскладка полусеток (порядок ячеек = соседство пар для линий)
  const TOP = { side: 'top', r32: ['M74', 'M77', 'M73', 'M75', 'M83', 'M84', 'M81', 'M82'], r16: ['M89', 'M90', 'M93', 'M94'], qf: ['M97', 'M98'], sf: 'M101' };
  const BOTTOM = { side: 'bottom', r32: ['M76', 'M78', 'M79', 'M80', 'M86', 'M88', 'M85', 'M87'], r16: ['M91', 'M92', 'M95', 'M96'], qf: ['M99', 'M100'], sf: 'M102' };

  function TeamRow({ team, side, p }) {
    const ai = p.win === side, pa = p.pasha === side, fact = p.fact === side;
    const dim = (p.fact ? !fact : !ai); // приглушаем «проигравшего» по факту (если есть) иначе по AI
    return (
      <div className={'po-team' + (ai ? ' w-ai' : '') + (fact ? ' w-fact' : '') + (dim ? ' dim' : '')}>
        <Flag cc={team.cc} />
        <span className="po-tn">{team.t}</span>
        <span className="po-chips">
          {ai && <i className="po-chip ai" title="Прогноз AI">AI</i>}
          {pa && <i className="po-chip pa" title="Прогноз Паши">П</i>}
          {fact && <i className="po-chip fact" title="Факт">✓</i>}
        </span>
      </div>
    );
  }

  function MatchBox({ code, kind }) {
    const p = PRED[code];
    if (!p) return null;
    const m = META[code];
    return (
      <div className={'po-br-box mb ' + kind + (p.by === 'pen' ? ' pen' : '')}>
        <div className="po-br-tag"><span>{code}</span>{p.score && <span className="po-mb-score">{scoreText(p.score, lang)}</span>}</div>
        {m && (
          <div className="po-mb-meta">
            <span className="po-mb-dt">{m.date} · {m.time}</span>
            <span className="po-mb-venue">{m.icon} {tr(m.ru, m.en)}{m.extra}</span>
          </div>
        )}
        <TeamRow team={p.a} side="a" p={p} />
        <TeamRow team={p.b} side="b" p={p} />
      </div>
    );
  }

  function Half({ cfg }) {
    const cell = (code, kind) => <div className="po-br-cell" key={code}><MatchBox code={code} kind={kind} /></div>;
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

  // Третьи места — ОКОНЧАТЕЛЬНО: 8 лучших третьих посеяны.
  const THIRDS = [
    { g: 'B', t: T('Босния', 'Bosnia', 'ba'), p: 4, opp: T('США', 'USA', 'us') },
    { g: 'D', t: T('Парагвай', 'Paraguay', 'py'), p: 4, opp: T('Германия', 'Germany', 'de') },
    { g: 'E', t: T('Эквадор', 'Ecuador', 'ec'), p: 4, opp: T('Мексика', 'Mexico', 'mx') },
    { g: 'F', t: T('Швеция', 'Sweden', 'se'), p: 4, opp: T('Франция', 'France', 'fr') },
    { g: 'J', t: T('Алжир', 'Algeria', 'dz'), p: 4, opp: T('Швейцария', 'Switzerland', 'ch') },
    { g: 'K', t: T('ДР Конго', 'DR Congo', 'cd'), p: 4, opp: T('Англия', 'England', 'gb-eng') },
    { g: 'L', t: T('Гана', 'Ghana', 'gh'), p: 4, opp: T('Колумбия', 'Colombia', 'co') },
    { g: 'I', t: T('Сенегал', 'Senegal', 'sn'), p: 3, opp: T('Бельгия', 'Belgium', 'be') },
  ];

  const THOUGHTS = [
    [tr('Прогноз AI: чемпион — Аргентина', 'AI forecast: champion — Argentina'),
     tr('Машина ведёт Аргентину через Кабо-Верде, Египет и Колумбию, затем суперкласико с Бразилией в 1/2 и финал с Испанией — оба по пенальти. Решающий фактор поздней стадии — Дибу Мартинес и опыт серий: в нашем прогнозе Аргентина выигрывает обе серии (4:2 и 4:3) и берёт титул.',
        'The model takes Argentina through Cape Verde, Egypt and Colombia, then a Superclásico with Brazil in the semis and a final against Spain — both on penalties. The late-stage swing factor is Dibu Martínez and shootout pedigree: in our forecast Argentina win both shootouts (4-2 and 4-3) and lift the trophy.')],
    [tr('Пенальти решают концовку', 'Penalties decide the business end'),
     tr('Чем дальше — тем плотнее: начиная с 1/4 половина матчей у нас уходит в серию (Бразилия–Англия, оба полуфинала, финал и матч за 3-е). Топ-обороны гасят друг друга до 1:1, и преимущество получает тот, у кого крепче нервы и вратарь у точки.',
        'The deeper it goes, the tighter it gets: from the quarters on, half of our ties go to shootouts (Brazil–England, both semis, the final and the third-place game). Top defences cancel out at 1-1, and the edge goes to whoever has the steadier nerve and keeper.')],
    [tr('Сенсации по версии AI', 'Upsets per the model'),
     tr('Германия вылетает уже в 1/8 от Франции; Норвегия Холанда проходит Кот-д’Ивуар, но застревает на Бразилии; США дома доходят до 1/8 и падают Бельгии по пенальти; Колумбия снимает Швейцарию в серии и выходит на Аргентину.',
        'Germany go out in the round of 16 to France; Haaland’s Norway see off Côte d’Ivoire but stall against Brazil; the USA reach the round of 16 at home and fall to Belgium on penalties; Colombia knock out Switzerland in a shootout and run into Argentina.')],
    [tr('Две половины — два мира', 'Two halves, two worlds'),
     tr('Нижняя половина — мясорубка: Бразилия, Аргентина, Англия, Колумбия. Верхняя мягче: Франция, Испания, Нидерланды, США. Поэтому наш финал — победитель верхней (Испания) против выжившего из нижней (Аргентина).',
        'The bottom half is a mincer: Brazil, Argentina, England, Colombia. The top half is kinder: France, Spain, Netherlands, USA. Hence our final — the top-half winner (Spain) against the bottom-half survivor (Argentina).')],
    [tr('Тёмные лошадки из третьих мест', 'Dark horses from the third places'),
     tr('Лучшие третьи попадают на победителей групп. По прогнозу почти все фавориты проходят, но Алжир огрызается Швейцарии, а Колумбия (как третьей тут нет — она первая) и Гана/ДР Конго тащат свои матчи в борьбу; именно из этих засад рождаются ранние сюрпризы.',
        'The best thirds face group winners. Our forecast has most favourites through, but Algeria bite at Switzerland and Ghana/DR Congo drag their ties into a fight; these ambushes are where early surprises come from.')],
  ];

  // Подводные камни — по урокам апсетов 3 последних ЧМ (research/upsets).
  const RISKS = [
    [tr('🔴 Испания в финале — самый хрупкий «уверенный» узел', '🔴 Spain in the final — the most fragile «confident» node'),
     tr('Профиль стерильного владения без вертикали — ровно тот, что вылетел в 2018 (Россия) и 2022 (Марокко) от плотного блока и пенальти. Мы ведём Испанию в финал — исторически это красная зона.',
        'A sterile-possession profile with no vertical thrust — exactly what went out in 2018 (Russia) and 2022 (Morocco) to a deep block and penalties. We have Spain reaching the final — historically a red zone.')],
    [tr('🔴 Бразилия проходит Англию по пенальти', '🔴 Brazil beats England on penalties'),
     tr('Против фирменного паттерна Бразилии: в 2018 (Бельгия) и 2022 (Хорватия) она не дожимала и горела фаворитом в серии. По истории тут скорее проходит Англия — наш самый спорный узел.',
        'Against Brazil’s signature pattern: in 2018 (Belgium) and 2022 (Croatia) they failed to finish games and lost shootouts as favourites. History leans England here — our shakiest node.')],
    [tr('🟡 Семь серий пенальти — это монетки', '🟡 Seven shootouts — coin-flips'),
     tr('С 1/4 половина пар уходит в серию. Реалистично 1–3 лягут иначе и сдвинут полуфиналистов и чемпиона. «Класс в серии» не гарантирует ничего — Дибу, Ливакович, Буну решали вопреки классу.',
        'From the quarters on, half the ties go to shootouts. Realistically 1–3 land differently and shift the semifinalists and the champion. «Class in a shootout» guarantees nothing — Dibu, Livaković, Bono decided games against the odds.')],
    [tr('🟡 Мексика на Ацтеке — высота + хозяева', '🟡 Mexico at the Azteca — altitude + hosts'),
     tr('Наш пик «Англия по пенальти в Мехико» идёт против 2200 м и фактора поля. Хозяин под грузом нации хрупок (Бразилия-2014), но высота и трибуны — реальный бамп Мексике.',
        'Our pick «England on penalties in Mexico City» runs against 2,200 m and home advantage. A host under the weight of a nation is fragile (Brazil-2014), but altitude and the crowd are a real bump for Mexico.')],
    [tr('🟡 Фавориты, ведущие и «садящиеся» на счёт', '🟡 Favourites who lead and «sit» on it'),
     tr('Аргентина 2:0, Испания 2:0: после двух мячей фавориты часто отдают инициативу (Аргентина–Нидерланды-2022, камбэк до 2:2) → поздний гол и «обе забьют» у соперника недооценены.',
        'Argentina 2-0, Spain 2-0: two goals up, favourites often cede the initiative (Argentina–Netherlands 2022, pegged back to 2-2) → a late goal and the opponent’s BTTS are underrated.')],
  ];

  return (
    <div>
      <h1>{tr('Плей-офф · прогноз AI', 'Playoffs · AI forecast')}</h1>
      <p className="po-intro">
        {tr('Полный прогноз AI по всей сетке — матч за матчем, с учётом формы команд, стиля, умения вскрывать автобус, стадионов и серий пенальти. В каждом боксе подсвечен предсказанный победитель и счёт; «пен» — проход через серию. Метки: синяя AI — наш прогноз; янтарная П (прогноз Паши) и зелёная ✓ (факт) добавятся позже.',
            'The full AI forecast across the whole bracket — match by match, weighing form, style, bus-breaking, stadiums and shootouts. Each box highlights the predicted winner and score; “pen” marks a shootout. Chips: blue AI is our pick; the amber П (Pasha) and green ✓ (actual result) will be added later.')}
      </p>

      <div className="po-champ">
        <span className="po-champ-cap">{tr('Прогноз AI', 'AI forecast')}</span>
        <span className="po-champ-row"><b>🏆 {tr('Чемпион', 'Champion')}:</b> <Flag cc="ar" /> {tr('Аргентина', 'Argentina')}</span>
        <span className="po-champ-row sub"><b>{tr('Финал', 'Final')}:</b> {tr('Испания', 'Spain')} 1:1 {tr('Аргентина', 'Argentina')} · {tr('пен 3:4', 'pens 3:4')}</span>
        <span className="po-champ-row sub"><b>{tr('3-е место', 'Third')}:</b> <Flag cc="fr" /> {tr('Франция', 'France')}</span>
      </div>

      <div className="po-legend">
        <span><i className="po-chip ai">AI</i> {tr('прогноз AI', 'AI pick')}</span>
        <span><i className="po-chip pa">П</i> {tr('Паша', 'Pasha')} <small>({tr('скоро', 'soon')})</small></span>
        <span><i className="po-chip fact">✓</i> {tr('факт', 'result')} <small>({tr('после матчей', 'after matches')})</small></span>
      </div>
      <div className="po-legend mini">
        <span>🏟 {tr('крыша / кондиц.', 'roof / AC')}</span>
        <span>⛰ {tr('высота', 'altitude')}</span>
        <span>☀ ⛅ 🌧 {tr('погода — открытый стадион · время МСК', 'weather — open-air · times MSK')}</span>
      </div>

      <div className="sect"><span className="sect-label">{tr('Верхняя половина', 'Top half')}</span></div>
      <Half cfg={TOP} />

      <div className="sect"><span className="sect-label">{tr('Нижняя половина · мясорубка', 'Bottom half · the mincer')}</span></div>
      <Half cfg={BOTTOM} />

      <div className="sect"><span className="sect-label">{tr('Финал · MetLife · 19 июля', 'Final · MetLife · Jul 19')}</span></div>
      <section className="block po-br-final-wrap">
        <div className="po-fin-box"><MatchBox code="M104" kind="fin" /></div>
        <p className="po-intro" style={{ textAlign: 'center', margin: '4px 0' }}>
          {tr('Матч за 3-е место (M103):', 'Third-place play-off (M103):')}
        </p>
        <div className="po-fin-box third"><MatchBox code="M103" kind="fin" /></div>
      </section>

      <div className="sect"><span className="sect-label">{tr('Третьи места · восьмёрка определена', 'Third places · the eight are set')}</span></div>
      <section className="block">
        <p className="po-intro">
          {tr('Восемь лучших третьих посеяны и знают соперников по 1/16. Семь набрали 4 очка, восьмой — лучшая из 3-очковых, Сенегал. Иран, Корея, Шотландия и Уругвай остались за бортом.',
              'The eight best third-placed teams are seeded and know their round-of-32 opponents. Seven finished on 4 points, the eighth being the best of the 3-point sides — Senegal. Iran, Korea, Scotland and Uruguay missed out.')}
        </p>
        <div className="po-thirds">
          <div className="po-th-row po-th-head">
            <span className="po-th-rk">#</span><span className="po-th-tm">{tr('Команда', 'Team')}</span>
            <span className="po-th-n">{tr('О', 'Pts')}</span><span className="po-th-st">{tr('Соперник в 1/16', 'Round-of-32 opponent')}</span>
          </div>
          {THIRDS.map((x, i) => (
            <div key={i} className="po-th-row safe">
              <span className="po-th-rk">{i + 1}</span>
              <span className="po-th-tm"><Flag cc={x.t.cc} /><b>{x.t.t}</b> <small>· {x.g}</small></span>
              <span className="po-th-n num">{x.p}</span>
              <span className="po-th-st"><Flag cc={x.opp.cc} />{x.opp.t}</span>
            </div>
          ))}
          <div className="po-th-cut">{tr('Все восемь третьих прошли с 3–4 очками · посев официальный', 'All eight thirds advanced on 3–4 points · seeding official')}</div>
        </div>
      </section>

      <div className="sect"><span className="sect-label">{tr('Подводные камни · уроки прошлых ЧМ', 'Pitfalls · lessons from past World Cups')}</span></div>
      <section className="block po-thoughts">
        <p className="po-intro" style={{ marginTop: 0 }}>
          {tr('Прогноз честно «по фаворитам», но история апсетов трёх последних ЧМ говорит: минимум один топ вылетит раньше, а поздняя стадия — серия монеток. Вот где наша сетка тоньше всего.',
              'The forecast is honestly «chalk», but the upset history of the last three World Cups says at least one top side goes early, and the late stages are a run of coin-flips. Here is where our bracket is thinnest.')}
        </p>
        {RISKS.map(([h, b], i) => (
          <div key={i} className="po-thought">
            <div className="po-thought-h">{h}</div>
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

      <p className="foot-note">
        {tr('Прогноз построен нашим движком по 32 матчам (форма, стиль, стадионы, пенальти) и сохранён по каждому матчу отдельно. По ходу плей-офф метки П (Паша) и ✓ (факт) встанут рядом с прогнозом AI — будет видно, кто угадал.',
            'The forecast was built by our engine across 32 matches (form, style, stadiums, shootouts) and saved per match. As the knockouts unfold, the П (Pasha) and ✓ (result) chips will sit next to the AI pick — so you can see who got it right.')}
      </p>
    </div>
  );
}
