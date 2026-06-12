// Проверка контента перед сборкой. Запускается автоматически как prebuild.
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
const ids = new Set();

matches.forEach((m, i) => {
  ['id', 'date', 'timeMsk', 'title', 'stage'].forEach((k) => { if (!m[k]) err.push(`matches[${i}]: нет поля «${k}»`); });
  if (ids.has(m.id)) err.push(`matches: дубликат id «${m.id}»`);
  ids.add(m.id);
  if (!Array.isArray(m.cc) || m.cc.length !== 2) err.push(`matches[${i}] (${m.id}): cc должен быть [код, код]`);
  if (!/^\d{4}-\d\d-\d\d$/.test(m.date || '')) err.push(`matches[${i}] (${m.id}): date неверный формат (нужно YYYY-MM-DD)`);
  if (!/^\d\d:\d\d$/.test(m.timeMsk || '')) err.push(`matches[${i}] (${m.id}): timeMsk неверный формат (нужно ЧЧ:ММ)`);
});

const betIds = new Set();
bets.forEach((b, i) => {
  if (betIds.has(b.id)) err.push(`bets: дубликат id ставки ${b.id}`);
  betIds.add(b.id);
  if (!TIERS.includes(b.tier)) err.push(`bets[${i}] (id ${b.id}): tier=«${b.tier}», ожидается ${TIERS.join('/')}`);
  if (!SIDES.includes(b.side)) err.push(`bets[${i}] (id ${b.id}): side=«${b.side}», ожидается ${SIDES.join('/')}`);
  if (!STATUS.includes(b.status)) err.push(`bets[${i}] (id ${b.id}): status=«${b.status}», ожидается ${STATUS.join('/')}`);
  if (typeof b.odds !== 'number' || b.odds < 1) err.push(`bets[${i}] (id ${b.id}): odds=${b.odds} (число ≥ 1)`);
  if (!b.bet || !b.type) err.push(`bets[${i}] (id ${b.id}): нет bet/type`);
  if (b.matchId && !ids.has(b.matchId)) err.push(`bets[${i}] (id ${b.id}): matchId «${b.matchId}» не найден в matches.json`);
});

news.forEach((n, i) => {
  if (!TAGS.includes(n.tag)) err.push(`news[${i}]: tag=«${n.tag}», ожидается ${TAGS.join('/')}`);
  if (!n.text || !n.time) err.push(`news[${i}]: нужны time и text`);
});

if (!Array.isArray(facts) || facts.some((f) => typeof f !== 'string')) {
  err.push('facts.json должен быть массивом строк');
}

if (err.length) {
  console.error('\n❌ Ошибки в контенте:\n' + err.map((e) => '   · ' + e).join('\n') + '\n');
  process.exit(1);
}

console.log(`✓ Контент валиден: ${matches.length} матчей · ${bets.length} ставок · ${news.length} новостей · ${facts.length} фактов`);
