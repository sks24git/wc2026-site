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
          tie('M83', true, T('Португалия', 'Portugal', 'pt'), T('Хорватия', 'Croatia', 'hr')),
          tie('M84', true, T('Испания', 'Spain', 'es'), T('Австрия', 'Austria', 'at')),
        ] },
        { m: 'M94', ties: [
          tie('M81', true, T('США', 'USA', 'us'), T('Босния', 'Bosnia', 'ba')),
          tie('M82', true, T('Бельгия', 'Belgium', 'be'), T('Сенегал', 'Senegal', 'sn')),
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
          tie('M79', true, T('Мексика', 'Mexico', 'mx'), T('Эквадор', 'Ecuador', 'ec')),
          tie('M80', true, T('Англия', 'England', 'gb-eng'), T('ДР Конго', 'DR Congo', 'cd')),
        ] },
      ] },
      { m: 'M100', r16: [
        { m: 'M95', ties: [
          tie('M86', true, T('Аргентина', 'Argentina', 'ar'), T('Кабо-Верде', 'Cape Verde', 'cv')),
          tie('M88', true, T('Австралия', 'Australia', 'au'), T('Египет', 'Egypt', 'eg')),
        ] },
        { m: 'M96', ties: [
          tie('M85', true, T('Швейцария', 'Switzerland', 'ch'), T('Алжир', 'Algeria', 'dz')),
          tie('M87', true, T('Колумбия', 'Colombia', 'co'), T('Гана', 'Ghana', 'gh')),
        ] },
      ] },
    ],
  };

  const RLBL = { r16: tr('1/8', 'R16'), qf: tr('1/4', 'QF'), sf: tr('1/2', 'SF') };
  const SET = tr('готово', 'set');

  // Третьи места — ОКОНЧАТЕЛЬНО: групповой этап завершён, 8 лучших третьих определены и посеяны.
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
  const THIRD_VARS = [
    [tr('Кто прошёл лучшими третьими', 'Who advanced as best thirds'),
     tr('Восьмёрку забрали семь команд с 4 очками (Босния, Парагвай, Эквадор, Швеция, Алжир, ДР Конго, Гана) плюс лучшая из 3-очковых — Сенегал (+2, 8 голов). Алжир, ДР Конго и Гана влезли последними, уже на финишной ленте тура.',
        'The eight went to seven teams on 4 points (Bosnia, Paraguay, Ecuador, Sweden, Algeria, DR Congo, Ghana) plus the best of the 3-point sides — Senegal (+2, 8 goals). Algeria, DR Congo and Ghana sneaked in right at the finish.')],
    [tr('Кто вылетел', 'Who went out'),
     tr('Три новых 4-очковых третьих (Алжир, ДР Конго, Гана) вытеснили из зоны всех 3-очковых аутсайдеров: Иран, Южную Корею и Шотландию. Плюс мимо прошёл третий группы H — Уругвай (2 очка).',
        'The three new 4-point thirds (Algeria, DR Congo, Ghana) pushed every 3-point also-ran out of the zone: Iran, South Korea and Scotland. The Group H third — Uruguay (2 points) — also missed out.')],
  ];

  const THOUGHTS = [
    [tr('Две половины — два мира', 'Two halves, two worlds'),
     tr('Нижняя половина — настоящая мясорубка: Бразилия, Аргентина, Англия, Мексика, Колумбия/Португалия, Швейцария и Норвегия. Верхняя — тяжёлая, но мягче: Германия, Франция, Испания, Нидерланды, США, Египет.',
        'The bottom half is a genuine mincer: Brazil, Argentina, England, Mexico, Colombia/Portugal, Switzerland and Norway. The top half is heavy but kinder: Germany, France, Spain, Netherlands, USA, Egypt.')],
    [tr('Все 16 пар зафиксированы', 'All 16 ties locked'),
     tr('Сетка собрана целиком. Самые вкусные пары: Аргентина — Кабо-Верде (Месси против сказочных дебютантов), Бразилия — Япония (японцы держали Нидерланды 2:2 — очень неудобный первый соперник) и Испания — Австрия. Из третьих громче всех зашли Алжир, ДР Конго и Гана — все трое влезли в восьмёрку на финишной ленте.',
        'The bracket is complete. The juiciest ties: Argentina — Cape Verde (Messi against the fairytale debutants), Brazil — Japan (Japan held the Netherlands 2:2 — a very awkward first opponent) and Spain — Austria. Among the thirds, Algeria, DR Congo and Ghana made the loudest entrances — all three sneaking into the eight at the finish.')],
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
        {tr('Групповой этап полностью завершён — все 16 пар 1/16 финала известны. Ниже сетка двумя половинами: верхняя помягче, нижняя — настоящая мясорубка. Дальше команды играют на вылет до общего финала.',
            'The group stage is fully over — all 16 round-of-32 ties are known. Below is the bracket in two halves: the top half is softer, the bottom a genuine mincer. From here it is knockout football all the way to the final.')}
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

      <div className="sect"><span className="sect-label">{tr('Третьи места · восьмёрка определена', 'Third places · the eight are set')}</span></div>
      <section className="block">
        <p className="po-intro">
          {tr('Групповой этап завершён — восемь лучших третьих посеяны и уже знают соперников по 1/16. Семь из них набрали 4 очка, восьмой стала лучшая из 3-очковых — Сенегал. Иран, Корея, Шотландия и Уругвай остались за бортом.',
              'The group stage is over — the eight best third-placed teams are seeded and already know their round-of-32 opponents. Seven of them finished on 4 points, the eighth being the best of the 3-point sides — Senegal. Iran, Korea, Scotland and Uruguay missed out.')}
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
        {tr('Сетка 1/16 укомплектована полностью. Первые матчи плей-офф — с 28 июня; победители половин сойдутся в финале на MetLife 19 июля.',
            'The round-of-32 bracket is fully complete. The knockouts begin on 28 June; the two half-winners meet in the final at MetLife on 19 July.')}
      </p>
    </div>
  );
}
