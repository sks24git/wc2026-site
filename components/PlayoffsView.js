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
          tie('M77', true, T('Франция', 'France', 'fr'), T('Швеция', 'Sweden', 'se')),
        ] },
        { m: 'M90', ties: [
          tie('M73', true, T('ЮАР', 'South Africa', 'za'), T('Канада', 'Canada', 'ca')),
          tie('M75', true, T('Нидерланды', 'Netherlands', 'nl'), T('Марокко', 'Morocco', 'ma')),
        ] },
      ] },
      { m: 'M98', r16: [
        { m: 'M93', ties: [
          tie('M83', false, T('2-е K', 'K runner-up'), T('Хорватия', 'Croatia', 'hr')),
          tie('M84', false, T('Испания', 'Spain', 'es'), T('2-е J', 'J runner-up')),
        ] },
        { m: 'M94', ties: [
          tie('M81', true, T('США', 'USA', 'us'), T('Босния', 'Bosnia', 'ba')),
          tie('M82', false, T('Бельгия', 'Belgium', 'be'), THIRD),
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
          tie('M78', true, T('Кот-д’Ивуар', 'Côte d’Ivoire', 'ci'), T('Норвегия', 'Norway', 'no')),
        ] },
        { m: 'M92', ties: [
          tie('M79', false, T('Мексика', 'Mexico', 'mx'), THIRD),
          tie('M80', false, T('Англия', 'England', 'gb-eng'), THIRD),
        ] },
      ] },
      { m: 'M100', r16: [
        { m: 'M95', ties: [
          tie('M86', true, T('Аргентина', 'Argentina', 'ar'), T('Кабо-Верде', 'Cape Verde', 'cv')),
          tie('M88', true, T('Австралия', 'Australia', 'au'), T('Египет', 'Egypt', 'eg')),
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
    [tr('Кто придёт из J и K', 'Who arrives from J and K'),
     tr('L уже закрыта: Хорватия обыграла Гану и пошла второй, а Гана с 4 очками стала третьей и прошла как одна из лучших третьих. Осталось дождаться J — проигравшего в очном Австрия–Алжир (оба по 3 очка, кто-то обязан упасть в третьи) — и K, где третьим, скорее всего, станет ДР Конго или Узбекистан.',
        'L is already done: Croatia beat Ghana to go through second, and Ghana on 4 points finished third and advanced as one of the best thirds. Still to come are J — the loser of Austria vs Algeria (both on 3 points; one must drop to third) — and K, whose third will most likely be DR Congo or Uzbekistan.')],
    [tr('Порядок на вылет', 'Who drops out, in order'),
     tr('Гана (4 очка) уже вошла и подвинула Шотландию (−3, 1 гол). Следующий новичок с 4 очками из J/K заберёт и Корею (−1). Иран (0, 3 гола) сидит крепче всех и вылетит, только если оба оставшихся новых третьих окажутся сильнее.',
        'Ghana (4 points) are already in and have pushed out Scotland (−3, 1 goal). The next 4-point newcomer from J/K also takes Korea (−1). Iran (0, 3 goals) sits sturdiest and only falls if both remaining new thirds finish stronger.')],
  ];

  const THOUGHTS = [
    [tr('Две половины — два мира', 'Two halves, two worlds'),
     tr('Нижняя половина — настоящая мясорубка: Бразилия, Аргентина, Англия, Мексика, Колумбия/Португалия, Швейцария и Норвегия. Верхняя — тяжёлая, но мягче: Германия, Франция, Испания, Нидерланды, США, Египет.',
        'The bottom half is a genuine mincer: Brazil, Argentina, England, Mexico, Colombia/Portugal, Switzerland and Norway. The top half is heavy but kinder: Germany, France, Spain, Netherlands, USA, Egypt.')],
    [tr('Девять пар уже зафиксированы', 'Nine ties already locked'),
     tr('Группы сыграны — в девяти парах из шестнадцати обе команды известны. Самые вкусные: Аргентина — Кабо-Верде (Месси против сказочных дебютантов) и внизу Бразилия — Япония: японцы держали Нидерланды 2:2, очень неудобный первый соперник. Открытыми остались лишь слоты под победителей и вторых из J/K/L и под лучшие третьи места.',
        'With the groups done, nine of the sixteen ties have both teams set. The juiciest: Argentina — Cape Verde (Messi against the fairytale debutants) and, at the bottom, Brazil — Japan: Japan held the Netherlands 2:2, a very awkward first opponent. Only the slots for the J/K/L winners and runners-up and the best third places remain open.')],
    [tr('Бразилия и Аргентина — только в полуфинале', 'Brazil and Argentina — only in a semfinal'),
     tr('Оба выиграли свои группы и оказались в нижней половине, так что пересекутся не раньше 1/2 — возможен полуфинал Бразилия — Аргентина.',
        'Both won their groups and landed in the bottom half, so they cannot meet before the semis — a Brazil — Argentina semifinal is on the cards.')],
    [tr('Испания и Аргентина — только в ФИНАЛЕ', 'Spain and Argentina — only in the FINAL'),
     tr('Так и вышло: Испания выиграла группу и ушла наверх, Аргентина — вниз, и теперь они могут встретиться лишь в финале. Ровно ради этого Испания и рвалась на 1-е место — иначе налетела бы на Аргентину уже в 1/16.',
        'And so it goes: Spain won their group and went up, Argentina down, so they can only meet in the final. That is exactly what Spain wanted first place for — otherwise they would have run into Argentina in the round of 32.')],
    [tr('Проклятие победителя — Норвегия/Франция', 'The winner’s curse — Norway/France'),
     tr('Так и сыграло: Франция выиграла группу I и в верхней половине может уже в 1/16 встретить Германию, зато дальше путь легче; Норвегия — вторая — свалилась в нижнюю мясорубку к Бразилии и Аргентине.',
        'And it played out: France won Group I and, in the top half, could meet Germany as early as the round of 32 — but the path beyond is easier; Norway, the runners-up, dropped into the bottom mincer with Brazil and Argentina.')],
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
