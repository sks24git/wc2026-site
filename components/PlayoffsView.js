'use client';
import { useLang } from '@/app/providers';

/* Самодостаточная страница сетки плей-офф ЧМ-2026.
   Группы A–I определены; J/K/L доигрывают — отмечены как «проекция».
   Контент двуязычный через локальный tr(ru,en). */

function Flag({ cc }) {
  if (!cc) return <span className="po-flag po-flag-tbd" aria-hidden="true" />;
  return (
    <img className="po-flag" src={`https://flagcdn.com/w40/${cc}.png`}
      srcSet={`https://flagcdn.com/w80/${cc}.png 2x`} width={22} height={22} alt="" loading="lazy" />
  );
}

function Tie({ tag, a, b, locked }) {
  return (
    <div className={'po-tie' + (locked ? ' locked' : '')}>
      <div className="po-tie-tag">{tag}</div>
      <div className="po-team"><Flag cc={a.cc} /><span>{a.t}</span></div>
      <div className="po-team"><Flag cc={b.cc} /><span>{b.t}</span></div>
    </div>
  );
}

export default function PlayoffsView() {
  const lang = useLang();
  const tr = (ru, en) => (lang === 'en' ? en : ru);

  // Команда: {t:имя, cc:код флага|null}
  const T = (ru, en, cc = null) => ({ t: tr(ru, en), cc });
  const THIRD = T('3-е место', 'Third place', null);

  const TOP = [
    { tag: 'M73 · ' + tr('готово', 'set'), locked: true, a: T('ЮАР', 'South Africa', 'za'), b: T('Канада', 'Canada', 'ca') },
    { tag: 'M75 · ' + tr('готово', 'set'), locked: true, a: T('Нидерланды', 'Netherlands', 'nl'), b: T('Марокко', 'Morocco', 'ma') },
    { tag: 'M74 · ' + tr('готово', 'set'), locked: true, a: T('Германия', 'Germany', 'de'), b: T('Парагвай', 'Paraguay', 'py') },
    { tag: 'M77 · ' + tr('готово', 'set'), locked: true, a: T('Франция · 1-е I', 'France · I winner', 'fr'), b: T('Швеция', 'Sweden', 'se') },
    { tag: 'M84', a: T('Испания · 1-е H', 'Spain · H winner', 'es'), b: T('2-е J', 'J runner-up', null) },
    { tag: 'M83', a: T('2-е K', 'K runner-up', null), b: T('2-е L', 'L runner-up', null) },
    { tag: 'M81 · ' + tr('готово', 'set'), locked: true, a: T('США', 'USA', 'us'), b: T('Босния', 'Bosnia', 'ba') },
    { tag: 'M82', a: T('Бельгия · 1-е G', 'Belgium · G winner', 'be'), b: THIRD },
  ];
  const BOTTOM = [
    { tag: 'M76 · ' + tr('готово', 'set'), locked: true, a: T('Бразилия', 'Brazil', 'br'), b: T('Япония', 'Japan', 'jp') },
    { tag: 'M78 · ' + tr('готово', 'set'), locked: true, a: T('Кот-д’Ивуар', 'Côte d’Ivoire', 'ci'), b: T('Норвегия · 2-е I', 'Norway · I runner-up', 'no') },
    { tag: 'M86 · ' + tr('готово', 'set'), locked: true, a: T('Аргентина · 1-е J', 'Argentina · J winner', 'ar'), b: T('Кабо-Верде · 2-е H', 'Cape Verde · H runner-up', 'cv') },
    { tag: 'M79', a: T('Мексика', 'Mexico', 'mx'), b: THIRD },
    { tag: 'M80', a: T('Англия · 1-е L', 'England · L winner', 'gb-eng'), b: THIRD },
    { tag: 'M87', a: T('Колумбия/Португалия · 1-е K', 'Colombia/Portugal · K winner', null), b: THIRD },
    { tag: 'M85', a: T('Швейцария', 'Switzerland', 'ch'), b: THIRD },
    { tag: 'M88 · ' + tr('готово', 'set'), locked: true, a: T('Австралия', 'Australia', 'au'), b: T('Египет · 2-е G', 'Egypt · G runner-up', 'eg') },
  ];

  // Третьи места (A–I определены; J/K/L доигрывают). Статус: safe (гарантирован) | edge (борьба за 3 последних места)
  // Логика: 8 путёвок − 3 нераспределённые группы = 5 мест уже закреплены за лучшими известными третьими.
  const THIRDS = [
    { g: 'F', t: T('Швеция', 'Sweden', 'se'), p: 4, gd: '0', gf: 7, s: 'safe' },
    { g: 'E', t: T('Эквадор', 'Ecuador', 'ec'), p: 4, gd: '0', gf: 2, s: 'safe' },
    { g: 'B', t: T('Босния', 'Bosnia', 'ba'), p: 4, gd: '−1', gf: 5, s: 'safe' },
    { g: 'D', t: T('Парагвай', 'Paraguay', 'py'), p: 4, gd: '−2', gf: 2, s: 'safe' },
    { g: 'I', t: T('Сенегал', 'Senegal', 'sn'), p: 3, gd: '+2', gf: 8, s: 'safe' },
    { g: 'G', t: T('Иран', 'Iran', 'ir'), p: 3, gd: '0', gf: 3, s: 'edge' },
    { g: 'A', t: T('Южная Корея', 'South Korea', 'kr'), p: 3, gd: '−1', gf: 2, s: 'edge' },
    { g: 'C', t: T('Шотландия', 'Scotland', 'gb-sct'), p: 3, gd: '−3', gf: 1, s: 'edge' },
  ];
  const THIRD_VARS = [
    [tr('Почему пятеро уже прошли, хотя три группы не доиграны', 'Why five are already through with three groups unfinished'),
     tr('Третьих путёвок в плей-офф восемь, а нераспределённых третьих осталось всего три — из J, K и L. Больше трёх мест новички забрать физически не могут, значит минимум пять достаются уже известным третьим. Это пятёрка сильнейших: Швеция, Эквадор, Босния, Парагвай (по 4 очка) и Сенегал (3, но разница +2 и 8 голов) — их уже не выбить, как бы ни сыграли оставшиеся группы.',
        'There are eight knockout spots for third places, and only three thirds are still undecided — from J, K and L. Newcomers can grab at most three of them, so at least five must go to the thirds already known. That is the strongest five: Sweden, Ecuador, Bosnia, Paraguay (4 points) and Senegal (3, but +2 and 8 goals) — they can no longer be knocked out, whatever the remaining groups do.')],
    [tr('Иран, Корея, Шотландия — за три последних места', 'Iran, Korea, Scotland — for the last three spots'),
     tr('Эти трое (по 3 очка) держат оставшуюся тройку путёвок, но ровно за них поспорят третьи из J, K и L. По хрупкости: Шотландия самая уязвимая (разница −3, всего 1 гол), за ней Корея (−1), крепче всех Иран (0 и 3 гола). Сильный третий из J/K/L первым выбьет Шотландию.',
        'These three (3 points each) hold the remaining three spots, but the thirds from J, K and L will contest exactly those. By fragility: Scotland is the most exposed (GD −3, just 1 goal), then Korea (−1), with Iran the sturdiest (0 and 3 goals). A strong J/K/L third knocks out Scotland first.')],
    [tr('Сколько очков нужно третьему из J, K или L', 'How many points a J/K/L third needs'),
     tr('4 очка → гарантия прохода: выбивает сначала Шотландию, затем Корею. 3 очка → лотерея по разнице и голам (с разницей лучше −1 обходит Корею и Шотландию, хуже −3 — уступает даже им). 2 и меньше → почти наверняка мимо.',
        '4 points → guaranteed: knocks out Scotland first, then Korea. 3 points → a tiebreak lottery on GD and goals (better than −1 beats Korea and Scotland, worse than −3 loses even to them). 2 or fewer → almost certainly out.')],
  ];

  const THOUGHTS = [
    [tr('Две половины — два мира', 'Two halves, two worlds'),
     tr('Нижняя половина — настоящая мясорубка: Бразилия, Аргентина, Англия, Мексика, Колумбия/Португалия, Швейцария и второй из пары Норвегия/Франция. Верхняя — тяжёлая, но мягче: Германия, Испания, Нидерланды, победитель Норвегия/Франция, США, Египет.',
        'The bottom half is a genuine mincer: Brazil, Argentina, England, Mexico, Colombia/Portugal, Switzerland and the runner-up of Norway/France. The top half is heavy but kinder: Germany, Spain, Netherlands, the Norway/France winner, USA, Egypt.')],
    [tr('Три пары уже зафиксированы', 'Three ties already locked'),
     tr('ЮАР — Канада и Нидерланды — Марокко наверху, и главное — Бразилия — Япония внизу. Японцы держали Нидерланды 2:2 — крайне неудобный первый соперник для Бразилии.',
        'South Africa — Canada and Netherlands — Morocco up top, and crucially Brazil — Japan at the bottom. Japan held the Netherlands 2:2 — a very awkward first opponent for Brazil.')],
    [tr('Бразилия и Аргентина — только в полуфинале', 'Brazil and Argentina — only in a semfinal'),
     tr('Если оба выигрывают группы, обе остаются в нижней половине и пересекутся не раньше 1/2 — возможен полуфинал Бразилия — Аргентина.',
        'If both win their groups they stay in the bottom half and cannot meet before the semis — a Brazil — Argentina semifinal is on the cards.')],
    [tr('Испания и Аргентина — только в ФИНАЛЕ', 'Spain and Argentina — only in the FINAL'),
     tr('Если оба берут первые места: Испания — наверху, Аргентина — внизу, и встретятся лишь в финале. Поэтому Испания кровь из носу хочет 1-е место в группе — иначе налетит на Аргентину уже в 1/16.',
        'If both top their groups, Spain go up, Argentina go down — and they meet only in the final. That is exactly why Spain are desperate to win Group H: otherwise they run into Argentina in the round of 32.')],
    [tr('Проклятие победителя — Норвегия/Франция', 'The winner’s curse — Norway/France'),
     tr('Победитель группы I идёт в 1/16 СРАЗУ на Германию, зато потом в более лёгкую половину; второй уходит в нижнюю мясорубку. Оттого ни Франция (которой хватает ничьей), ни даже Холанд особо не рвутся на первое место.',
        'The Group I winner faces Germany immediately in the round of 32 but then lands in the easier half; the runner-up drops into the bottom mincer. Hence neither France (a draw is enough) nor even Haaland are desperate to finish first.')],
    [tr('Развилка Англии', 'England’s fork'),
     tr('Первое место в L → вниз (Мексика в 1/8, дальше четверть Аргентины). Второе → наверх, к Испании/Германии. Обе дороги тяжёлые, но низ — откровенно адский.',
        'First in L → down (Mexico in the round of 16, then Argentina’s quarter). Second → up, towards Spain/Germany. Both roads are hard, but the bottom is brutal.')],
    [tr('Тёмные лошадки из третьих мест', 'Dark horses from the third places'),
     tr('Эквадор (обыгравший Германию!), Марокко, Кот-д’Ивуар, Швейцария — лучшие третьи попадают на победителей групп и вполне способны устроить засаду уже в 1/16.',
        'Ecuador (who beat Germany!), Morocco, Côte d’Ivoire, Switzerland — the best third-placed sides face group winners and are quite capable of an ambush as early as the round of 32.')],
    [tr('Финал мечты', 'The dream final'),
     tr('Самый вкусный сценарий — Испания против Аргентины или Бразилии: латиноамериканский гранд снизу против европейского сверху. Но сначала низу предстоит пережить самого себя.',
        'The juiciest scenario is Spain against Argentina or Brazil: a South American heavyweight from the bottom against a European one from the top. But first the bottom half has to survive itself.')],
  ];

  return (
    <div>
      <h1>{tr('Плей-офф · сетка', 'Playoffs · the bracket')}</h1>
      <p className="po-intro">
        {tr('Групповой этап завершён. Группа H — за Испанией, сенсационные дебютанты Кабо-Верде вторые; группу G выиграла Бельгия, Египет второй. Осталось официально посеять восьмёрку лучших третьих (последними считают группы J, K, L) — после этого встанут на места слоты с пометкой «3-е место». Пары, где известны обе команды, отмечены «готово»; остальное — проекция по таблицам и нашим раскладам.',
            'The group stage is over. Group H went to Spain, with the sensational debutants Cape Verde second; Belgium won Group G, Egypt second. All that remains is to officially seed the eight best third places (Groups J, K, L are ranked last) — after which the «third place» slots fall into position. Ties where both teams are known are marked “set”; the rest is a projection from the tables and our reads.')}
      </p>

      <div className="sect"><span className="sect-label">{tr('Нижняя половина · мясорубка', 'Bottom half · the mincer')}</span></div>
      <section className="block po-half bottom">
        {BOTTOM.map((x, i) => <Tie key={i} {...x} />)}
        <div className="po-half-foot">{tr('→ к полуфиналу №2', '→ to semifinal #2')}</div>
      </section>

      <div className="sect"><span className="sect-label">{tr('Верхняя половина', 'Top half')}</span></div>
      <section className="block po-half top">
        {TOP.map((x, i) => <Tie key={i} {...x} />)}
        <div className="po-half-foot">{tr('→ к полуфиналу №1', '→ to semifinal #1')}</div>
      </section>

      <div className="sect"><span className="sect-label">{tr('Третьи места · гонка за 8 путёвок', 'Third places · race for 8 spots')}</span></div>
      <section className="block">
        <p className="po-intro">
          {tr('В плей-офф проходят 8 лучших третьих из 12. Девять третьих уже известны (группы A–I), не доиграны только J, K и L. А раз новых третьих максимум трое — больше трёх из восьми путёвок они занять не могут, значит пять лучших известных третьих проходят уже ГАРАНТИРОВАННО: четвёрка с 4 очками плюс Сенегал (3 очка, но разница +2 и 8 голов). Последние три места разыграют Иран, Корея и Шотландия против третьих из J/K/L. Уругвай (3-й в H, 2 очка) уже за бортом.',
              'The 8 best of 12 third places advance. Nine thirds are already known (Groups A–I); only J, K and L are unfinished. And since at most three new thirds remain, they can take at most three of the eight spots — so the five best known thirds are ALREADY guaranteed: the four on 4 points plus Senegal (3 points, but +2 and 8 goals). The last three spots will be fought over by Iran, Korea and Scotland against the J/K/L thirds. Uruguay (third in H on 2 points) is already out.')}
        </p>
        <div className="po-thirds">
          <div className="po-th-row po-th-head">
            <span className="po-th-rk">#</span><span className="po-th-tm">{tr('Команда', 'Team')}</span>
            <span className="po-th-n">{tr('О', 'Pts')}</span><span className="po-th-n">{tr('Разн', 'GD')}</span>
            <span className="po-th-n">{tr('Заб', 'GF')}</span><span className="po-th-st">{tr('Статус', 'Status')}</span>
          </div>
          {THIRDS.map((x, i) => (
            <div key={i} className={'po-th-row ' + x.s}>
              <span className="po-th-rk">{i + 1}</span>
              <span className="po-th-tm"><Flag cc={x.t.cc} /><b>{x.t.t}</b> <small>· {x.g}</small></span>
              <span className="po-th-n num">{x.p}</span>
              <span className="po-th-n num">{x.gd}</span>
              <span className="po-th-n num">{x.gf}</span>
              <span className="po-th-st">{x.s === 'safe' ? tr('в зоне', 'in') : tr('на грани', 'on edge')}</span>
            </div>
          ))}
          <div className="po-th-cut">{tr('↑ верхние 5 уже гарантированы · за места 6–8 спорят Иран/Корея/Шотландия и третьи из J/K/L', '↑ top 5 already guaranteed · spots 6–8 contested by Iran/Korea/Scotland and the J/K/L thirds')}</div>
        </div>
        <div className="po-thoughts" style={{ marginTop: '14px' }}>
          {THIRD_VARS.map(([h, b], i) => (
            <div key={i} className="po-thought">
              <div className="po-thought-h">{h}</div>
              <div className="po-thought-b">{b}</div>
            </div>
          ))}
        </div>
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
        {tr('Группы доиграны — осталось дождаться официального посева третьих мест (J, K, L), и слоты с пометкой «3-е место» встанут на свои позиции.',
            'The groups are done — once the official third-place seeding (J, K, L) is published, the «third place» slots fall into their positions.')}
      </p>
    </div>
  );
}
