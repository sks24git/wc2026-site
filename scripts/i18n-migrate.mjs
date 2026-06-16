// Миграция/перевод контента в двуязычную схему {ru,en}.
//   node scripts/i18n-migrate.mjs extract            → /tmp/wc-strings.json  ([{id,ru}])
//   node scripts/i18n-migrate.mjs apply <trans.json> → переписывает content/*.json ({ru,en})
// Поля переводятся по стабильным id; перевод берётся из карты {id:en}, фолбэк — ru.
// Идемпотентно: уже мигрированные поля ({ru,en}) берут ru как источник.
import fs from 'node:fs';

const dir = new URL('../content/', import.meta.url);
const read = (f) => JSON.parse(fs.readFileSync(new URL(f, dir), 'utf8'));
const write = (f, d) => fs.writeFileSync(new URL(f, dir), JSON.stringify(d, null, 2) + '\n');

function collect() {
  const matches = read('matches.json');
  const bets = read('bets.json');
  const news = read('news.json');
  const facts = read('facts.json');
  const items = [];
  const srcRu = (cur) => (cur && typeof cur === 'object' && !Array.isArray(cur) ? cur.ru : cur);
  const add = (id, obj, key) => {
    const cur = obj[key];
    if (cur == null) return;
    const ru = srcRu(cur);
    items.push({ id, ru, set: (en) => { obj[key] = { ru, en: en ?? ru }; } });
  };

  matches.forEach((m) => ['title', 'stage', 'venue', 'weather', 'lede'].forEach((k) => add(`match|${m.id}|${k}`, m, k)));
  bets.forEach((b) => {
    ['match', 'bet', 'note'].forEach((k) => add(`bet|${b.id}|${k}`, b, k));
    if (Array.isArray(b.legs)) b.legs.forEach((leg, i) => { add(`bet|${b.id}|leg${i}|m`, leg, 'm'); add(`bet|${b.id}|leg${i}|p`, leg, 'p'); });
  });
  news.forEach((n, i) => add(`news|${i}|text`, n, 'text'));
  facts.forEach((f, i) => {
    const ru = srcRu(f);
    items.push({ id: `fact|${i}`, ru, set: (en) => { facts[i] = { ru, en: en ?? ru }; } });
  });

  return { files: { matches, bets, news, facts }, items };
}

const mode = process.argv[2];
const { files, items } = collect();

if (mode === 'extract') {
  const out = items.map(({ id, ru }) => ({ id, ru }));
  fs.writeFileSync('/tmp/wc-strings.json', JSON.stringify(out, null, 2));
  console.log(`✓ extracted ${out.length} strings → /tmp/wc-strings.json`);
} else if (mode === 'apply') {
  const transPath = process.argv[3];
  const map = transPath ? JSON.parse(fs.readFileSync(transPath, 'utf8')) : {};
  let filled = 0;
  for (const it of items) { const en = map[it.id]; it.set(en); if (en) filled++; }
  write('matches.json', files.matches);
  write('bets.json', files.bets);
  write('news.json', files.news);
  write('facts.json', files.facts);
  console.log(`✓ applied: ${items.length} fields → {ru,en} · ${filled} with EN translation · ${items.length - filled} EN=RU fallback`);
} else {
  console.error('usage: i18n-migrate.mjs extract | apply <translations.json>');
  process.exit(1);
}
