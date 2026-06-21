// Проверка контента перед сборкой (prebuild). Схема двуязычная: текстовые поля = {ru,en}.
import fs from 'node:fs';

const root = new URL('../content/', import.meta.url);
function load(name) {
  try {
    return JSON.parse(fs.readFileSync(new URL(name, root), 'utf8'));
  } catch (e) {
    console.error(`\n❌ ${name}: невалидный JSON — ${e.message}\n`);
    process.exit(1);
  }
}

const matches = load('matches.json');
const bets = load('bets.json');
const news = load('news.json');
const facts = load('facts.json');

const TIERS = ['green', 'yellow', 'red'];
const SIDES = ['Паша', 'AI'];
const STATUS = ['pending', 'win', 'lose', 'void'];
const TAGS = ['lineup', 'insight', 'pasha', 'result'];

const err = [];

// Двуязычное поле: {ru, en} с непустыми строками.
const biln = (v) => v && typeof v === 'object' && !Array.isArray(v)
  && typeof v.ru === 'string' && v.ru.trim() && typeof v.en === 'string' && v.en.trim();

const ids = new Set();
matches.forEach((m, i) => {
  ['id', 'date', 'timeMsk'].forEach((k) => { if (!m[k]) err.push(`matches[${i}]: нет поля «${k}»`); });
  ['title', 'stage'].forEach((k) => { if (!biln(m[k])) err.push(`matches[${i}] (${m.id}): «${k}» должно быть {ru,en}`); });
  ['venue', 'lede', 'weather'].forEach((k) => { if (m[k] != null && !biln(m[k])) err.push(`matches[${i}] (${m.id}): «${k}» (если задано) должно быть {ru,en}`); });
  if (ids.has(m.id)) err.push(`matches: дубликат id «${m.id}»`);
  ids.add(m.id);
  if (!Array.isArray(m.cc) || m.cc.length !== 2) err.push(`matches[${i}] (${m.id}): cc должен быть [код, код]`);
  if (!/^\d{4}-\d\d-\d\d$/.test(m.date || '')) err.push(`matches[${i}] (${m.id}): date неверный формат (YYYY-MM-DD)`);
  if (!/^\d\d:\d\d$/.test(m.timeMsk || '')) err.push(`matches[${i}] (${m.id}): timeMsk неверный формат (ЧЧ:ММ)`);
});

const betIds = new Set();
bets.forEach((b, i) => {
  if (betIds.has(b.id)) err.push(`bets: дубликат id ставки ${b.id}`);
  betIds.add(b.id);
  if (!TIERS.includes(b.tier)) err.push(`bets[${i}] (id ${b.id}): tier=«${b.tier}», ожидается ${TIERS.join('/')}`);
  if (!SIDES.includes(b.side)) err.push(`bets[${i}] (id ${b.id}): side=«${b.side}», ожидается ${SIDES.join('/')}`);
  if (!STATUS.includes(b.status)) err.push(`bets[${i}] (id ${b.id}): status=«${b.status}», ожидается ${STATUS.join('/')}`);
  if (typeof b.odds !== 'number' || b.odds < 1) err.push(`bets[${i}] (id ${b.id}): odds=${b.odds} (число ≥ 1)`);
  if (!b.type) err.push(`bets[${i}] (id ${b.id}): нет type`);
  if (!biln(b.match)) err.push(`bets[${i}] (id ${b.id}): «match» должно быть {ru,en}`);
  if (!biln(b.bet)) err.push(`bets[${i}] (id ${b.id}): «bet» должно быть {ru,en}`);
  if (b.note != null && !biln(b.note)) err.push(`bets[${i}] (id ${b.id}): «note» (если задано) должно быть {ru,en}`);
  if (Array.isArray(b.legs)) b.legs.forEach((leg, k) => {
    if (!biln(leg.m)) err.push(`bets[${i}] (id ${b.id}): legs[${k}].m должно быть {ru,en}`);
    if (!biln(leg.p)) err.push(`bets[${i}] (id ${b.id}): legs[${k}].p должно быть {ru,en}`);
  });
  if (b.matchId && !ids.has(b.matchId)) err.push(`bets[${i}] (id ${b.id}): matchId «${b.matchId}» не найден в matches.json`);
});

news.forEach((n, i) => {
  if (!TAGS.includes(n.tag)) err.push(`news[${i}]: tag=«${n.tag}», ожидается ${TAGS.join('/')}`);
  if (!n.time) err.push(`news[${i}]: нужно time`);
  if (!biln(n.text)) err.push(`news[${i}]: «text» должно быть {ru,en}`);
});

if (!Array.isArray(facts)) {
  err.push('facts.json должен быть массивом');
} else facts.forEach((f, i) => {
  if (!biln(f)) err.push(`facts[${i}]: должно быть {ru,en}`);
  if (!f.time) err.push(`facts[${i}]: нужно time`);
});

// Каждому разбору <id>.md нужен перевод <id>.en.md.
const adir = new URL('analysis/', root);
let analysisFiles = [];
try { analysisFiles = fs.readdirSync(adir); } catch {}
const ruMd = analysisFiles.filter((f) => f.endsWith('.md') && !f.endsWith('.en.md'));
const enSet = new Set(analysisFiles.filter((f) => f.endsWith('.en.md')));
ruMd.forEach((f) => {
  const enName = f.replace(/\.md$/, '.en.md');
  if (!enSet.has(enName)) err.push(`analysis: нет перевода «${enName}» для «${f}»`);
});

if (err.length) {
  console.error('\n❌ Ошибки в контенте:\n' + err.map((e) => '   · ' + e).join('\n') + '\n');
  process.exit(1);
}

console.log(`✓ Контент валиден (двуязычный): ${matches.length} матчей · ${bets.length} ставок · ${news.length} новостей · ${facts.length} фактов · ${ruMd.length} разборов (+EN)`);
