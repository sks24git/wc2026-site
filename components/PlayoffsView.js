'use client';
import { useLang } from '@/app/providers';

/* Самодостаточная страница сетки плей-офф ЧМ-2026.
   Группы A–F определены; G–L доигрываются — отмечены как «проекция».
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
    { tag: 'M74', a: T('Германия', 'Germany', 'de'), b: THIRD },
    { tag: 'M77', a: T('Франция/Норвегия · 1-е I', 'France/Norway · I winner', null), b: THIRD },
    { tag: 'M84', a: T('Испания · 1-е H', 'Spain · H winner', 'es'), b: T('2-е J', 'J runner-up', null) },
    { tag: 'M83', a: T('2-е K', 'K runner-up', null), b: T('2-е L', 'L runner-up', null) },
    { tag: 'M81', a: T('США', 'USA', 'us'), b: THIRD },
    { tag: 'M82', a: T('Египет · 1-е G', 'Egypt · G winner', 'eg'), b: THIRD },
  ];
  const BOTTOM = [
    { tag: 'M76 · ' + tr('готово', 'set'), locked: true, a: T('Бразилия', 'Brazil', 'br'), b: T('Япония', 'Japan', 'jp') },
    { tag: 'M78', a: T('Кот-д’Ивуар', 'Côte d’Ivoire', 'ci'), b: T('2-е I · Норвегия/Франция', 'I runner-up · Norway/France', null) },
    { tag: 'M86', a: T('Аргентина · 1-е J', 'Argentina · J winner', 'ar'), b: T('2-е H', 'H runner-up', null) },
    { tag: 'M79', a: T('Мексика', 'Mexico', 'mx'), b: THIRD },
    { tag: 'M80', a: T('Англия · 1-е L', 'England · L winner', 'gb-eng'), b: THIRD },
    { tag: 'M87', a: T('Колумбия/Португалия · 1-е K', 'Colombia/Portugal · K winner', null), b: THIRD },
    { tag: 'M85', a: T('Швейцария', 'Switzerland', 'ch'), b: THIRD },
    { tag: 'M88', a: T('Австралия', 'Australia', 'au'), b: T('2-е G', 'G runner-up', null) },
  ];

  // Третьи места (A–F определены; G–L ещё доигрывают). Статус: safe | edge
  const THIRDS = [
    { g: 'F', t: T('Швеция', 'Sweden', 'se'), p: 4, gd: '0', gf: 7, s: 'safe' },
    { g: 'E', t: T('Эквадор', 'Ecuador', 'ec'), p: 4, gd: '0', gf: 2, s: 'safe' },
    { g: 'B', t: T('Босния', 'Bosnia', 'ba'), p: 4, gd: '−1', gf: 5, s: 'safe' },
    { g: 'D', t: T('Парагвай', 'Paraguay', 'py'), p: 4, gd: '−2', gf: 2, s: 'safe' },
    { g: 'A', t: T('Южная Корея', 'South Korea', 'kr'), p: 3, gd: '−1', gf: 2, s: 'edge' },
    { g: 'C', t: T('Шотландия', 'Scotland', 'gb-sct'), p: 3, gd: '−3', gf: 1, s: 'edge' },
  ];
  const THIRD_VARS = [
    [tr('Четвёрка с 4 очками — фактически прошла', 'The four on 4 points — all but through'),
     tr('Швеция, Эквадор, Босния и Парагвай набрали по 4 очка. Третье место с четырьмя очками при формате на 48 команд почти не выбивается — считаем их в плей-офф.',
        'Sweden, Ecuador, Bosnia and Paraguay have 4 points each. A third place on four points in a 48-team format is almost never knocked out — treat them as through.')],
    [tr('Корея и Шотландия (по 3) — на тоненького', 'Korea and Scotland (3 each) — on a knife’s edge'),
     tr('Они держат два последних из восьми мест, но именно за них будут биться все шесть третьих из групп G–L. Шотландия — самая хрупкая: худшая разница (−3) и всего 1 гол; почти любой третий с 3 очками её обходит.',
        'They hold the last two of eight spots, but all six thirds from Groups G–L will fight for them. Scotland are the most fragile: the worst goal difference (−3) and just one goal — almost any 3-point third leapfrogs them.')],
    [tr('Сколько очков нужно третьему из G–L', 'How many points a G–L third needs'),
     tr('4 очка → гарантия прохода: выбивает сначала Шотландию, затем Корею. 3 очка → лотерея по разнице и голам (с разницей лучше −1 обходит обеих, хуже −3 — уступает даже Шотландии). 2 и меньше → почти наверняка мимо.',
        '4 points → guaranteed: knocks out Scotland first, then Korea. 3 points → a tiebreak lottery on GD and goals (better than −1 beats both, worse than −3 loses even to Scotland). 2 or fewer → almost certainly out.')],
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
        {tr('Группы A–F уже сыграны и зафиксированы; группы G–L доигрываются сегодня и завтра, а восьмёрку лучших третьих мест посчитают после всех групп. Пары ниже — по позициям сетки: где обе команды известны, стоит «готово», остальное — проекция по таблицам и нашим раскладам.',
            'Groups A–F are played and locked; Groups G–L finish today and tomorrow, and the eight best third places are settled after all groups. The ties below follow the fixed bracket positions: where both teams are known it says “set”, the rest is a projection from the tables and our reads.')}
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
          {tr('В плей-офф проходят 8 лучших третьих мест из 12. Определены пока шесть — из групп A–F (все сейчас в зоне). Ещё шесть дадут группы G–L; сильные третьи оттуда вытеснят слабейших отсюда.',
              'The 8 best of 12 third places advance. Six are decided so far — from Groups A–F (all currently in the zone). Six more come from Groups G–L; strong thirds there will bump the weakest here.')}
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
          <div className="po-th-cut">{tr('↑ 8 проходят · ниже сюда впишутся третьи из G–L', '↑ 8 advance · G–L thirds slot in below')}</div>
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
        {tr('Сетка обновится автоматически, как только группы G–L доиграют и определится восьмёрка лучших третьих.',
            'The bracket updates automatically once Groups G–L finish and the eight best third places are decided.')}
      </p>
    </div>
  );
}
