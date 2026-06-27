'use client';
import { useLang } from '@/app/providers';

/* Самодостаточная страница сетки плей-офф ЧМ-2026 — две полусетки слева-направо.
   Группы A–I определены; J/K/L доигрывают, их слоты — единый TBD-вид.
   Контент двуязычный через локальный tr(ru,en). */

function Flag({ cc }) {
  if (!cc) return <span className="po-flag po-flag-tbd" aria-hidden="true" />;
  return (
    <img className="po-flag" src={`https://flagcdn.com/w40/${cc}.png`}
      srcSet={`https://flagcdn.com/w80/${cc}.png 2x`} width={22} height={22} alt="" loading="lazy" />
  );
}

function R32Box({ m, set, a, b, setLabel }) {
  return (
    <div className={'po-br-box r32' + (set ? ' set' : '')}>
      <div className="po-br-tag">{m}{set ? ' · ' + setLabel : ''}</div>
      <div className="po-team"><Flag cc={a.cc} /><span>{a.t}</span></div>
      <div className="po-team"><Flag cc={b.cc} /><span>{b.t}</span></div>
    </div>
  );
}

function FutureBox({ label, m }) {
  return (
    <div className="po-br-box future">
      <span className="po-br-flabel">{label}</span>
      <span className="po-br-fm">{m}</span>
    </div>
  );
}

function Half({ half, setLabel, lbl }) {
  const ties = half.qfs.flatMap((q) => q.r16.flatMap((r) => r.ties)); // 8 пар 1/16
  const r16 = half.qfs.flatMap((q) => q.r16);                          // 4 матча 1/8
  return (
    <div className="po-bracket">
      <div className={'po-br-half ' + half.side}>
        <div className="po-br-round r-32">
          {ties.map((t, i) => (
            <div className="po-br-cell" key={i}><R32Box {...t} setLabel={setLabel} /></div>
          ))}
        </div>
        <div className="po-br-round">
          {r16.map((r, i) => (
            <div className="po-br-cell" key={i}><FutureBox label={lbl.r16} m={r.m} /></div>
          ))}
        </div>
        <div className="po-br-round">
          {half.qfs.map((q, i) => (
            <div className="po-br-cell" key={i}><FutureBox label={lbl.qf} m={q.m} /></div>
          ))}
        </div>
        <div className="po-br-round is-last">
          <div className="po-br-cell"><FutureBox label={lbl.sf} m={half.sf} /></div>
        </div>
      </div>
    </div>
  );
}

export default function PlayoffsView() {
  const lang = useLang();
  const tr = (ru, en) => (lang === 'en' ? en : ru);

  // Команда: {t:имя, cc:код флага|null}
  const T = (ru, en, cc = null) => ({ t: tr(ru, en), cc });
  const THIRD = T('3-е место', 'Third place', null);
  // tie: {m, set, a, b}
  const tie = (m, set, a, b) => ({ m, set, a, b });

  // ── Верхняя половина → 1/2 (M101) → финал ──
  const HALF_TOP = {
    side: 'top', sf: 'M101',
    qfs: [
      { m: 'M97', r16: [
        { m: 'M89', ties: [
          tie('M74', true, T('Германия', 'Germany', 'de'), T('Парагвай', 'Paraguay', 'py')),
          tie('M77', true, T('Франция · 1-е I', 'France · I winner', 'fr'), T('Швеция', 'Sweden', 'se')),
        ] },
        { m: 'M90', ties: [
          tie('M73', true, T('ЮАР', 'South Africa', 'za'), T('Канада', 'Canada', 'ca')),
          tie('M75', true, T('Нидерланды', 'Netherlands', 'nl'), T('Марокко', 'Morocco', 'ma')),
        ] },
      ] },
      { m: 'M98', r16: [
        { m: 'M93', ties: [
          tie('M83', false, T('2-е K', 'K runner-up'), T('2-е L', 'L runner-up')),
          tie('M84', false, T('Испания · 1-е H', 'Spain · H winner', 'es'), T('2-е J', 'J runner-up')),
        ] },
        { m: 'M94', ties: [
          tie('M81', true, T('США', 'USA', 'us'), T('Босния', 'Bosnia', 'ba')),
          tie('M82', false, T('Бельгия · 1-е G', 'Belgium · G winner', 'be'), THIRD),
        ] },
      ] },
    ],
  };

  // ── Нижняя половина → 1/2 (M102) → финал ──
  const HALF_BOTTOM = {
    side: 'bottom', sf: 'M102',
    qfs: [
      { m: 'M99', r16: [
        { m: 'M91', ties: [
          tie('M76', true, T('Бразилия', 'Brazil', 'br'), T('Япония', 'Japan', 'jp')),
          tie('M78', true, T('Кот-д’Ивуар', 'Côte d’Ivoire', 'ci'), T('Норвегия · 2-е I', 'Norway · I runner-up', 'no')),
        ] },
        { m: 'M92', ties: [
          tie('M79', false, T('Мексика', 'Mexico', 'mx'), THIRD),
          tie('M80', false, T('Победитель L', 'Group L winner'), THIRD),
        ] },
      ] },
      { m: 'M100', r16: [
        { m: 'M95', ties: [
          tie('M86', true, T('Аргентина · 1-е J', 'Argentina · J winner', 'ar'), T('Кабо-Верде · 2-е H', 'Cape Verde · H runner-up', 'cv')),
          tie('M88', true, T('Австралия', 'Australia', 'au'), T('Египет · 2-е G', 'Egypt · G runner-up', 'eg')),
        ] },
        { m: 'M96', ties: [
          tie('M85', false, T('Швейцария', 'Switzerland', 'ch'), THIRD),
          tie('M87', false, T('Победитель K', 'Group K winner'), THIRD),
        ] },
      ] },
    ],
  };

  const RLBL = { r16: tr('1/8', 'R16'), qf: tr('1/4', 'QF'), sf: tr('1/2', 'SF') };
  const SET = tr('готово', 'set');

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
    [tr('Кто придёт из J, K и L', 'Who arrives from J, K and L'),
     tr('J — проигравший в очном Австрия–Алжир (оба по 3 очка, кто-то обязан упасть в третьи). K — скорее ДР Конго: обыграет беспомощный Узбекистан (разница −7) и наберёт 4 очка. L — Хорватия (3 очка), но если она дожмёт Гану, в третьи свалится сама Гана уже с 4 очками.',
        'J — the loser of Austria vs Algeria (both on 3 points; one must drop to third). K — most likely DR Congo: beat a hapless Uzbekistan (GD −7) and they reach 4 points. L — Croatia (3 points), but if they see off Ghana, Ghana themselves slide to third on 4 points.')],
    [tr('Порядок на вылет', 'Who drops out, in order'),
     tr('Любой новичок с 4 очками (ДР Конго или Гана) сразу выбивает Шотландию (−3, 1 гол); второй такой забирает и Корею (−1). Иран (0, 3 гола) сидит крепче всех и вылетит, только если все три новых третьих окажутся сильнее. То есть из нынешней тройки реально проходит как минимум один — скорее Иран.',
        'Any newcomer on 4 points (DR Congo or Ghana) knocks out Scotland straight away (−3, 1 goal); a second one also takes Korea (−1). Iran (0, 3 goals) sits sturdiest and only falls if all three new thirds finish stronger. So at least one of the current trio survives — most likely Iran.')],
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
        {tr('Групповой этап завершён. Группа H — за Испанией, дебютанты Кабо-Верде вторые; группу G выиграла Бельгия, Египет второй. Ниже — сетка двумя половинами: где известны обе команды, пара отмечена «готово»; пустые слоты ждут победителей групп J/K/L, вторых мест и официального посева восьми лучших третьих.',
            'The group stage is over. Group H went to Spain, debutants Cape Verde second; Belgium won Group G, Egypt second. Below is the bracket in two halves: where both teams are known a tie is marked “set”; empty slots await the J/K/L group winners, the runners-up and the official seeding of the eight best third places.')}
      </p>

      <div className="sect"><span className="sect-label">{tr('Нижняя половина · мясорубка', 'Bottom half · the mincer')}</span></div>
      <Half half={HALF_BOTTOM} setLabel={SET} lbl={RLBL} />

      <div className="sect"><span className="sect-label">{tr('Верхняя половина', 'Top half')}</span></div>
      <Half half={HALF_TOP} setLabel={SET} lbl={RLBL} />

      <div className="sect"><span className="sect-label">{tr('Финал', 'Final')}</span></div>
      <section className="block po-br-final-wrap">
        <div className="po-br-box final">
          <div className="po-br-tag">{tr('M104 · MetLife · 19 июля', 'M104 · MetLife · Jul 19')}</div>
          <div className="po-team"><span className="po-flag po-flag-tbd" aria-hidden="true" /><span>{tr('Победитель верхней половины', 'Top-half winner')}</span></div>
          <div className="po-team"><span className="po-flag po-flag-tbd" aria-hidden="true" /><span>{tr('Победитель нижней половины', 'Bottom-half winner')}</span></div>
        </div>
        <p className="po-intro" style={{ textAlign: 'center' }}>
          {tr('Проигравшие полуфиналов сыграют за 3-е место (M103).', 'The semifinal losers contest third place (M103).')}
        </p>
      </section>

      <div className="sect"><span className="sect-label">{tr('Третьи места · гонка за 8 путёвок', 'Third places · race for 8 spots')}</span></div>
      <section className="block">
        <p className="po-intro">
          {tr('8 из 12 третьих идут дальше. Верхняя пятёрка (зелёные) уже не выбивается; за оставшиеся три места рубятся Иран, Корея и Шотландия с тремя ещё не определившимися третьими из J, K и L. Уругвай (2 очка) — уже за бортом.',
              '8 of 12 third places go through. The top five (green) can no longer be knocked out; the last three spots are a scrap between Iran, Korea and Scotland and three still-undecided thirds from J, K and L. Uruguay (2 points) are already out.')}
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
        {tr('Группы доиграны — осталось дождаться официального посева третьих мест (J, K, L), и слоты с пометкой «3-е место» / «2-е» встанут на свои позиции.',
            'The groups are done — once the official third-place seeding (J, K, L) is published, the «third place» / «runner-up» slots fall into their positions.')}
      </p>
    </div>
  );
}
