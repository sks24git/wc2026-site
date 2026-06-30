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
  const norm = (s) => (s || '').replace(/\s+/g, ' ').trim();

  // PRED[code] = { a, b, win:'a'|'b', score, by:'reg'|'aet'|'pen', conf, pasha?, fact? }
  // pasha/fact — позже: 'a'/'b' (кого ведёт Паша / кто реально прошёл).
  const P = (a, b, win, score, by, conf) => ({ a, b, win, score, by, conf });
  const PRED = {
    // ── 1/16 ──
    M73: { ...P(T('ЮАР', 'South Africa', 'za'), T('Канада', 'Canada', 'ca'), 'b', '0:1', 'reg', 'medium'), fact: 'b', fscore: '0:1', fby: 'reg' },
    M74: { ...P(T('Германия', 'Germany', 'de'), T('Парагвай', 'Paraguay', 'py'), 'a', '2:1', 'reg', 'medium'), fact: 'b', fscore: '1:1, пен. 3:4', fby: 'pen' },
    M75: { ...P(T('Нидерланды', 'Netherlands', 'nl'), T('Марокко', 'Morocco', 'ma'), 'a', '2:1 (доп. время)', 'aet', 'low'), fact: 'b', fscore: '1:1, пен. 2:3', fby: 'pen' },
    M77: P(T('Франция', 'France', 'fr'), T('Швеция', 'Sweden', 'se'), 'a', '3:1', 'reg', 'high'),
    M81: P(T('США', 'USA', 'us'), T('Босния', 'Bosnia', 'ba'), 'a', '2:1', 'reg', 'high'),
    M82: P(T('Бельгия', 'Belgium', 'be'), T('Сенегал', 'Senegal', 'sn'), 'a', '2:1', 'reg', 'medium'),
    M83: P(T('Португалия', 'Portugal', 'pt'), T('Хорватия', 'Croatia', 'hr'), 'a', '2:1', 'reg', 'medium'),
    M84: P(T('Испания', 'Spain', 'es'), T('Австрия', 'Austria', 'at'), 'a', '2:0', 'reg', 'high'),
    M76: { ...P(T('Бразилия', 'Brazil', 'br'), T('Япония', 'Japan', 'jp'), 'a', '2:1', 'reg', 'medium'), fact: 'a', fscore: '2:1', fby: 'reg' },
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
    M94: P(T('США', 'USA', 'us'), T('Бельгия', 'Belgium', 'be'), 'b', '1:2 (доп. время)', 'aet', 'medium'),
    M91: P(T('Бразилия', 'Brazil', 'br'), T('Норвегия', 'Norway', 'no'), 'a', '2:1', 'reg', 'medium'),
    M92: P(T('Мексика', 'Mexico', 'mx'), T('Англия', 'England', 'gb-eng'), 'b', '1:1 (2:4 пен)', 'pen', 'tossup'),
    M95: P(T('Аргентина', 'Argentina', 'ar'), T('Египет', 'Egypt', 'eg'), 'a', '2:0', 'reg', 'high'),
    M96: P(T('Швейцария', 'Switzerland', 'ch'), T('Колумбия', 'Colombia', 'co'), 'b', '1:1 (3:4 пен)', 'pen', 'tossup'),
    // ── 1/4 ──
    M97: P(T('Франция', 'France', 'fr'), T('Нидерланды', 'Netherlands', 'nl'), 'a', '2:1', 'reg', 'medium'),
    M98: P(T('Испания', 'Spain', 'es'), T('Бельгия', 'Belgium', 'be'), 'a', '1:0', 'reg', 'medium'),
    M99: P(T('Бразилия', 'Brazil', 'br'), T('Англия', 'England', 'gb-eng'), 'b', '1:1 (3:4 пен)', 'pen', 'tossup'),
    M100: P(T('Аргентина', 'Argentina', 'ar'), T('Колумбия', 'Colombia', 'co'), 'a', '2:1', 'reg', 'medium'),
    // ── 1/2 ──
    M101: P(T('Франция', 'France', 'fr'), T('Испания', 'Spain', 'es'), 'b', '1:1 (3:4 пен)', 'pen', 'tossup'),
    M102: P(T('Англия', 'England', 'gb-eng'), T('Аргентина', 'Argentina', 'ar'), 'b', '1:2 (доп. время)', 'aet', 'medium'),
    // ── Финал + 3-е место ──
    M104: P(T('Испания', 'Spain', 'es'), T('Аргентина', 'Argentina', 'ar'), 'b', '1:1 (3:4 пен)', 'pen', 'tossup'),
    M103: P(T('Франция', 'France', 'fr'), T('Англия', 'England', 'gb-eng'), 'a', '2:1', 'reg', 'medium'),
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

  function TeamRow({ code, side, p }) {
    const sm = slotModel(code, side);
    const team = sm.team || { t: '—', cc: null };
    const played = !!p.fact;
    const isWin = played && p.fact === side;
    const isLose = played && p.fact !== side;
    const aiPick = p.win === side;
    // расхождение: реальный участник заменил спрогнозированную AI команду в этом слоте
    const diverged = sm.real && !played && p[side] && team.cc && p[side].cc !== team.cc;
    const cls = 'po-team' + (isWin ? ' win' : isLose ? ' out' : sm.real ? ' real' : ' proj');
    let chip = null;
    if (played) {
      if (isWin) chip = aiPick ? <i className="po-chip aiwin" title={tr('AI угадал проход', 'AI called it')}>AI ✓</i> : <i className="po-chip fact" title={tr('прошёл', 'advanced')}>✓</i>;
      else if (aiPick) chip = <i className="po-chip aimiss" title={tr('AI ошибся', 'AI missed')}>AI ✗</i>;
    } else if (aiPick) {
      chip = diverged
        ? <i className="po-chip aibust" title={tr('пик AI не прошёл в этот раунд', 'AI pick did not reach this round')}>AI</i>
        : <i className="po-chip ai ghost" title={tr('прогноз AI на победителя', 'AI pick to win')}>AI</i>;
    }
    const through = !played && sm.real && !!feederRef(code, side); // реально прошёл из предыдущего раунда, матч впереди (в 1/16 фидера нет)
    return (
      <div className={cls}>
        <Flag cc={team.cc} />
        <span className="po-tn">{team.t}</span>
        <span className="po-chips">
          {through && <span className="po-through" title={tr('команда реально прошла в этот раунд', 'team has really advanced here')}>✓ {tr('дальше', 'through')}</span>}
          {p.pasha === side && <i className="po-chip pa" title={tr('Прогноз Паши', 'Pasha pick')}>П</i>}
          {chip}
        </span>
      </div>
    );
  }

  function MatchBox({ code, kind }) {
    const p = PRED[code];
    if (!p) return null;
    const m = META[code];
    const played = !!p.fact;
    const shownScore = played ? p.fscore : p.score;
    const shownBy = played ? p.fby : p.by;
    const hit = played && p.fscore && p.score && norm(p.fscore) === norm(p.score);
    return (
      <div className={'po-br-box mb ' + kind + (played ? ' played' : '') + (shownBy === 'pen' && !hit ? ' pen' : '')}>
        <div className="po-br-tag">
          <span>{code}</span>
          {played && <span className="po-ft">FT</span>}
          {!played && (p.conf === 'tossup' || p.conf === 'low') && (
            <span className={'po-conf ' + p.conf}>{p.conf === 'tossup' ? '50/50' : tr('слабо', 'soft')}</span>
          )}
          {shownScore && (
            <span className={'po-mb-score' + (hit ? ' hit' : '')}>
              {played ? (hit ? '✓ ' : '') : tr('прогноз ', 'proj. ')}{scoreText(shownScore, lang)}
            </span>
          )}
        </div>
        {m && (
          <div className="po-mb-meta">
            <span className="po-mb-dt">{m.date} · {m.time}</span>
            <span className="po-mb-venue">{m.icon} {tr(m.ru, m.en)}{m.extra}</span>
          </div>
        )}
        <TeamRow code={code} side="a" p={p} />
        <TeamRow code={code} side="b" p={p} />
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
  const THOUGHTS = [
    [tr('Прогноз AI: чемпион — Аргентина', 'AI forecast: champion — Argentina'),
     tr('Машина ведёт Аргентину через Кабо-Верде, Египет и Колумбию, в 1/2 — на Англию (та выбивает Бразилию), и финал с Испанией. Ключ поздней стадии — Дибу Мартинес и опыт: Англию Аргентина дожимает в доп. время, а финал с Испанией берёт в серии пенальти. По Elo-моделям Аргентина — №1; Opta фаворитом считает Испанию.',
        'The model takes Argentina through Cape Verde, Egypt and Colombia, then England in the semis (who knock Brazil out) and a final against Spain. The late-stage key is Dibu Martínez and big-game nous: Argentina edge England in extra time, then beat Spain in the final on penalties. Elo models rank Argentina #1; Opta makes Spain the favourite.')],
    [tr('Пенальти и доп. время — по статистике', 'Penalties and extra time — calibrated'),
     tr('Число серий откалибровали под статистику и линии буков: ≈6 серий пенальти на 32 матча (1/4 Англия–Бразилия, полуфинал Франция–Испания, финал) плюс несколько концовок в доп. время. Второй полуфинал и матч за 3-е решаются в игре. Серия — почти монетка: решают вратарь и нервы.',
        'We calibrated the number of shootouts to history and the bookmaker lines: ≈6 penalty shootouts across 32 ties (the England–Brazil quarter, the France–Spain semi, the final) plus a few extra-time finishes. The other semi and the third-place game are settled in play. A shootout is near a coin-flip — keeper and nerve decide.')],
    [tr('Сенсации по версии AI', 'Upsets per the model'),
     tr('Германия вылетает в 1/8 от Франции; Бразилия — в 1/4 от Англии (с этим согласны и Opta, и ChatGPT, и история «Бразилия горит в сериях»); Норвегия проходит Кот-д’Ивуар, но застревает на Бразилии в 1/8; США доходят до 1/8 и падают Бельгии в доп. время; Колумбия снимает Швейцарию в серии и выходит на Аргентину.',
        'Germany go out in the round of 16 to France; Brazil fall in the quarters to England (Opta, ChatGPT and the «Brazil chokes shootouts» history all agree); Haaland’s Norway see off Côte d’Ivoire but stall against Brazil in the round of 16; the USA reach the round of 16 and lose to Belgium in extra time; Colombia knock out Switzerland in a shootout and run into Argentina.')],
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
    [tr('🟡 Чемпион-Аргентина — против Opta', '🟡 Champion Argentina — against Opta'),
     tr('Наш чемпион совпал с Elo-моделями (там Аргентина №1), но Opta и рынок фаворитом считают Испанию/Францию — Аргентина лишь 4-я (~10%). ChatGPT даёт ту же финальную пару, но победителем — Испанию. Титул Аргентины — ставка на Elo-семью и фактор Дибу, а не на консенсус.',
        'Our champion matches the Elo models (Argentina #1 there), but Opta and the market favour Spain/France — Argentina only 4th (~10%). ChatGPT has the same final but with Spain winning. An Argentina title backs the Elo family and the Dibu factor, not the consensus.')],
    [tr('🟡 Шесть серий пенальти — это монетки', '🟡 Six shootouts — coin-flips'),
     tr('После калибровки у нас ≈6 серий (под линию буков 5.5). Но даже шесть монеток означают: 1–2 лягут иначе и сдвинут полуфиналистов или чемпиона. «Класс в серии» не гарантирует ничего — Дибу, Ливакович, Буну решали вопреки классу.',
        'After calibration we have ≈6 shootouts (matching the bookmaker line of 5.5). But even six coin-flips mean 1–2 land differently and shift the semifinalists or the champion. «Class in a shootout» guarantees nothing — Dibu, Livaković, Bono decided games against the odds.')],
    [tr('🟡 Мексика на Ацтеке — высота + хозяева', '🟡 Mexico at the Azteca — altitude + hosts'),
     tr('Наш пик «Англия по пенальти в Мехико» идёт против 2200 м и фактора поля. Хозяин под грузом нации хрупок (Бразилия-2014), но высота и трибуны — реальный бамп Мексике.',
        'Our pick «England on penalties in Mexico City» runs against 2,200 m and home advantage. A host under the weight of a nation is fragile (Brazil-2014), but altitude and the crowd are a real bump for Mexico.')],
    [tr('🟡 Фавориты, ведущие и «садящиеся» на счёт', '🟡 Favourites who lead and «sit» on it'),
     tr('Аргентина 2:0, Испания 2:0: после двух мячей фавориты часто отдают инициативу (Аргентина–Нидерланды-2022, камбэк до 2:2) → поздний гол и «обе забьют» у соперника недооценены.',
        'Argentina 2-0, Spain 2-0: two goals up, favourites often cede the initiative (Argentina–Netherlands 2022, pegged back to 2-2) → a late goal and the opponent’s BTTS are underrated.')],
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
     tr('Сравнили с Opta и Elo-моделями. Финал Испания–Аргентина и чемпион Аргентина совпали; а где история и модели сошлись (Бразилия раз за разом горит в сериях) — поправили: Англия выбивает Бразилию в 1/4.',
        'We compared with Opta and Elo models. The Spain–Argentina final and an Argentina title matched; and where history and the models agreed (Brazil keep losing shootouts) we adjusted — England knock Brazil out in the quarters.')],
    [tr('Что заметили интересного', 'What we found interesting'),
     tr('Плей-офф — низовой: четвертьфиналы самые сухие (~2 гола за матч), финалы и полуфиналы тоже. Камбэков «в победу» за 90 минут почти не бывает — отстающий лишь дотягивает матч до серии. А матч за 3-е место наоборот: открытый и почти никогда не доходит до пенальти.',
        'The knockouts are low-scoring: quarter-finals are the driest (~2 goals a game), finals and semis too. Comebacks rarely turn into wins inside 90 minutes — the trailing side mostly just drags the tie to a shootout. The third-place game is the opposite: open, and almost never goes to penalties.')],
  ];

  return (
    <div>
      <h1>{tr('Плей-офф · прогноз AI', 'Playoffs · AI forecast')}</h1>
      <p className="po-intro">
        {tr('Полный прогноз AI по всей сетке — матч за матчем. Сыгранные боксы заливаются и помечаются FT: прошедшая команда — жирная с зелёной ✓, счёт зеленеет, если точный счёт AI зашёл. Дальше по сетке сплошная тёмная команда — та, что реально прошла сюда, а бледный курсив — ещё не сыгранный прогноз (он сам подменяется фактом, как только нужный матч завершён).',
            'The full AI forecast across the whole bracket — match by match. Played ties are filled and tagged FT: the team that advanced is bold with a green ✓, and the score turns green if AI nailed the exact scoreline. Deeper in the bracket a solid dark team is one that has really arrived, while faint italic is a not-yet-played forecast (it swaps itself for the real result as soon as the feeding tie finishes).')}
      </p>

      <div className="po-champ">
        <span className="po-champ-cap">{tr('Прогноз AI', 'AI forecast')}</span>
        <span className="po-champ-row"><b>🏆 {tr('Чемпион', 'Champion')}:</b> <Flag cc="ar" /> {tr('Аргентина', 'Argentina')}</span>
        <span className="po-champ-row sub"><b>{tr('Финал', 'Final')}:</b> {tr('Испания', 'Spain')} 1:1 {tr('Аргентина', 'Argentina')} · {tr('пен 3:4', 'pens 3:4')}</span>
        <span className="po-champ-row sub"><b>{tr('3-е место', 'Third')}:</b> <Flag cc="fr" /> {tr('Франция', 'France')}</span>
      </div>

      <div className="po-legend">
        <span><i className="po-chip ai ghost">AI</i> {tr('прогноз AI', 'AI pick')}</span>
        <span className="po-team real" style={{ fontSize: '12px' }}>{tr('тёмный', 'solid')}<span className="po-through">✓ {tr('дальше', 'through')}</span></span> = {tr('реально прошёл', 'really advanced')}
        <span className="po-team proj" style={{ fontSize: '12px' }}>{tr('бледный курсив', 'faint italic')}</span> = {tr('прогноз (матч не сыгран)', 'forecast (tie not played)')}
      </div>
      <div className="po-legend">
        <span><i className="po-chip aiwin">AI ✓</i> {tr('AI угадал', 'AI right')}</span>
        <span><i className="po-chip aimiss">AI ✗</i> {tr('AI мимо', 'AI missed')}</span>
        <span><i className="po-chip fact">✓</i> {tr('прошёл', 'advanced')}</span>
        <span><i className="po-ft">FT</i> {tr('сыгран · зелёный счёт = точный счёт AI зашёл', 'played · green score = AI nailed the scoreline')}</span>
      </div>
      <div className="po-legend mini">
        <span>🏟 {tr('крыша / кондиц.', 'roof / AC')}</span>
        <span>⛰ {tr('высота', 'altitude')}</span>
        <span>☀ ⛅ 🌧 {tr('погода — открытый стадион · время МСК', 'weather — open-air · times MSK')}</span>
      </div>
      <div className="po-legend mini">
        <span><i className="po-conf tossup">50/50</i> {tr('серия пенальти / равный матч', 'shootout / even tie')}</span>
        <span><i className="po-conf low">{tr('слабо', 'soft')}</i> {tr('шаткий прогноз', 'shaky pick')}</span>
        <span>{tr('без метки — уверенный/склонный прогноз', 'no tag — confident/leaning pick')}</span>
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

      <div className="sect"><span className="sect-label">{tr('Подводные камни · уроки прошлых ЧМ', 'Pitfalls · lessons from past World Cups')}</span></div>
      <section className="block po-thoughts">
        <p className="po-intro" style={{ marginTop: 0 }}>
          {tr('Прогноз честно «по фаворитам». Один узел флипнули по согласию моделей и истории — Бразилию в 1/4 убрала Англия. Остальные монетки оставили модально (метки «50/50»/«слабо»), а число серий пенальти откалибровали под статистику. Вот где сетка всё ещё тоньше всего.',
              'The forecast is honestly «chalk». We flipped one node on the agreement of the models and history — England knock Brazil out in the quarters. The other coin-flips stay modal (tagged «50/50»/«soft»), and we calibrated the number of shootouts to the stats. Here is where the bracket is still thinnest.')}
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
