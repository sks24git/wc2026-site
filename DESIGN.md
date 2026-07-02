---
name: ЧМ-26 · Альбом дуэли (Паша vs AI)
description: Коллекционный наклеечный альбом — тёмный стол, бумажный разворот, все блоки — вклеенные артефакты двух голосов
colors:
  desk: "#463c2f"
  paper: "#f3ecd7"
  paper-sunken: "#ece1c1"
  sticker: "#ffffff"
  sticker-border: "#d5c9a4"
  ink: "#2b2519"
  muted: "#6b5b3f"
  faint: "#8a7a58"
  rule: "#8b7a55"
  hair: "#ddd2ae"
  hair-strong: "#c9bb92"
  hair-dot: "#c3ac79"
  slot-dash: "#a68f5c"
  pasha: "#d97706"
  pasha-deep: "#92400e"
  pasha-plate: "#e29a19"
  ai: "#4f46e5"
  ai-deep: "#312e81"
  ai-ink: "#171335"
  win: "#15803d"
  lose: "#b91c1c"
  void: "#7c8794"
  pending: "#98a1ac"
  live: "#c2410c"
  gold: "#b97f10"
  pen: "#2643a6"
  pencil: "#8a8070"
  tier-safe: "#15803d"
  tier-mid: "#d9a406"
  tier-risk: "#d2402c"
  shadow: "#422e0e38"
  shadow-soft: "#422e0e1f"
typography:
  body:
    fontFamily: "Golos Text, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  display:
    fontFamily: "Oswald, sans-serif"
    fontSize: "clamp(20px, 3vw, 34px)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "0.08em"
  numeric:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
  hand:
    fontFamily: "Caveat, cursive"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "normal"
rounded:
  none: "0px"
spacing:
  pad: "clamp(14px, 3.5vw, 40px)"
  gutter: "64px"
components:
  sticker:
    backgroundColor: "{colors.sticker}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
  plate-pasha:
    backgroundColor: "{colors.pasha-plate}"
    textColor: "#3b2405"
    typography: "{typography.display}"
    rounded: "{rounded.none}"
    padding: "4px 12px"
  plate-ai:
    backgroundColor: "#0f0c2b"
    textColor: "#c7d2fe"
    typography: "{typography.numeric}"
    rounded: "{rounded.none}"
    padding: "4px 12px"
  receipt-ai:
    backgroundColor: "#fdfbef"
    textColor: "{colors.ink}"
    typography: "{typography.numeric}"
    rounded: "{rounded.none}"
  scrap-pasha:
    backgroundColor: "#fbf5e0"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
  stamp-hit:
    textColor: "{colors.win}"
    typography: "{typography.display}"
    rounded: "{rounded.none}"
  stamp-miss:
    textColor: "{colors.lose}"
    typography: "{typography.display}"
    rounded: "{rounded.none}"
  stamp-live:
    textColor: "{colors.live}"
    typography: "{typography.display}"
    rounded: "{rounded.none}"
---

# ЧМ-26 · Дизайн-система «АЛЬБОМ»

## 1. Overview

Сайт свёрстан как **разворот коллекционного наклеечного альбома** (оммаж Panini
и журналам с вкладышами 90-х): тёмный стол `desk`, на нём бумажный разворот
`paper` с желобком переплёта, всё содержимое — **вклеенные артефакты**:
наклейки, чеки, обрывки, штампы, рукописные пометки. Регистр — **brand**:
альбомная подача и есть продукт. Любой новый элемент UI обязан быть артефактом,
а не «веб-карточкой».

Сердце системы — **два голоса**: Паша = человек/бумага/рукопись (янтарь,
Caveat), AI = машина/печать/holo-chrome (индиго, JetBrains Mono). Дуэль
читается через материалы, а не только через цвет.

Канонический источник правил — скилл `wc2026-design` (читать перед любой
правкой UI); референс-мокап — `archive/design/album.html`; токены живут в
`app/styles/base.css` (`:root`), использовать только их — хексы в правилах
запрещены.

## 2. Colors: печатные краски на бумаге

- **Бумага и чернила**: `paper` (разворот), `paper-sunken` (утопленные плашки),
  `sticker` (белая наклейка), `ink`/`muted`/`faint` (чернильная шкала текста).
- **Стороны дуэли**: янтарь `pasha`/`pasha-deep`/`pasha-plate` — только Паша;
  индиго `ai`/`ai-deep`/`ai-ink` — только AI. Сторона окрашивает плашки, линии
  графика, моно-ярлычки — никогда фоны длинного текста.
- **Деньги — зарезервированы**: `win` (зелёная краска) ТОЛЬКО плюс/выигрыш,
  `lose` ТОЛЬКО минус/проигрыш, `void`/`pending` — возврат/в игре, `gold` —
  конкурс ЛС. Зелёный/красный ни для чего другого не использовать.
- **Сигналы и рука**: `live` — штамп «идёт»; `pen` (синяя ручка) — рукописные
  акценты и ссылки; `pencil` — карандашные пометки пустых состояний.
- Ссылки — чернила с подчёркиванием или `pen`; никаких синих веб-ссылок.
- Контраст основного текста ≥4.5:1 (чернила на бумаге это дают с запасом).

## 3. Typography: четыре руки альбома

Роли жёсткие, смешивать запрещено:

- **Golos Text** (`--font-ui`) — весь текст, лиды, ленты; ≥13px, line-height ≥1.5.
- **Oswald** (`--font-disp`) — капс-заголовки, плашки, крупные значения;
  капс-лейблы с letter-spacing 0.08–0.3em.
- **JetBrains Mono** (`--font-num`) — кэфы, счёт, время, суммы, чеки,
  микро-ярлычки; всегда `font-variant-numeric: tabular-nums` (класс `.num`).
- **Caveat** (`--font-hand`) — ТОЛЬКО короткие рукописные акценты в 1–2 строки
  (лидер-строка, пометки, пустые слоты). НИКОГДА: длинный текст, данные, навигация.

Все видимые строки двуязычные RU/EN через `lib/i18n.js` (`t()`) либо inline
`lang === 'en' ? … : …`.

## 4. Elevation: физика вклейки

Глубина — материальная, не «веб-мягкая»:

- Тени ТОЛЬКО резкие офсетные `Xpx Ypx 0 {colors.shadow}` (наклейка над
  бумагой). Никаких blur/glow/мягких теней.
- Наклоны `rotate(±0.5–2deg)` — только у вклеек (карточки, штампы, заметки,
  скотч); чередовать через nth-child odd/even, у соседей противоположные.
  Таблицы, сетки, графики, длинные тексты — строго ровно.
- Скотч `.scotch` — на «особо приклеенных» вкладышах (2 кусочка, разные углы).
- `border-radius: 0` всюду — бумага режется прямо.

## 5. Components: примитивы альбома (переиспользовать, не изобретать)

- **Наклейка** — базовая вклейка: `sticker` + рамка `sticker-border` +
  офсетная тень + наклон.
- **Штамп** `.stampword` (`.hit`/`.miss`/`.golive`/`.void`) — статус
  ЗАШЛО/МИМО/ИДЁТ. Никаких цветных чипов-бейджей — только штампы.
- **Слот** — `border: 2px dashed {colors.slot-dash}` + ярлычок `.slot-no`;
  пустое состояние = слот + карандашная надпись `.pencil`.
- **Рубрика** `.sect > .sect-label` — по центру, двойные линейки по бокам.
- **Плашка стороны** (`.card-plate`, `.duo-plate`, `.sl-plate`) — Паша:
  градиент `#f6b93f→pasha-plate`, рамка `#9a6206`; AI: фон `#0f0c2b`, текст
  `#c7d2fe`, рамка `#6366f1`.
- **Чек терминала** (голос AI) — `receipt-ai`: dashed верх/низ, перфорация
  точками, шапка моно-капсом.
- **Обрывок** (голос Паши) — `scrap-pasha`: рваный clip-path, линованные
  строки, 1–2 акцента Caveat.
- **Holo-карта AI** — тёмно-индиговая база + перелив + гильош + металлическая
  рамка + медленный `.shine` (см. `.card-ai`).
- **Счёт дуэли** `.scoreline` (`ScoreStrip`) — узкая полоска для внутренних
  страниц; большой герой `BattleBoard` — ТОЛЬКО на главной.
- **Флаг** `.flag`, **купонная строка** `.pick-line`, **результат** `.res-ic`,
  **тир-иконки** `TierIcon` (штриховые щит/молния/огонь, stroke `tier-*`).
- Иконки — только инлайн-SVG 24×24, stroke=currentColor, 1.7–2px, размер 14–20px.

## 6. Do's and Don'ts

**Do:**

- Новый блок → наклейка/чек/обрывок по голосу + рубрика `.sect`.
- Новый статус → `.stampword` с цветом-токеном, слово капсом.
- Крупное число → Oswald 600/700; число в строке/таблице → JetBrains Mono `.num`.
- Проверка перед сдачей: dev 200 без ошибок, скрины 1440/390 без
  горизонтального скролла, обе локали, grep-линт на border-radius/blur/эмодзи/хексы.
- Build запускать только при остановленном dev-сервере.

**Don't (жёсткие запреты):**

- `border-radius` > 0; blur/glow-тени; полупрозрачные tint-чипы; градиентные
  ауры; «shadcn-вид»; тёмные hero-панели с glow.
- Эмодзи в интерфейсном хроме (в текстах контента из `content/*.json` — можно).
- Зелёный/красный вне денег; хексы вместо токенов в правилах.
- Наклоны/рукопись на таблицах, сетках, графиках и абзацах.
- Одноязычные строки; Caveat длиннее двух строк.
- Дефолтная сетка одинаковых карточек — если блок похож на «AI-дашборд»,
  переделать в артефакт альбома.
