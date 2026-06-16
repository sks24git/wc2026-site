import fs from 'node:fs';
import path from 'node:path';

// Читается только на сборке (server / static export). Не импортировать в клиентские компоненты.
// lang='en' → <id>.en.md (фолбэк на <id>.md, если перевода ещё нет).
function readFile(id, suffix) {
  try {
    return fs.readFileSync(path.join(process.cwd(), 'content', 'analysis', id + suffix), 'utf8');
  } catch {
    return '';
  }
}

export function readAnalysis(id, lang = 'ru') {
  if (lang === 'en') return readFile(id, '.en.md') || readFile(id, '.md');
  return readFile(id, '.md');
}

// Оба языка сразу — для передачи в клиентский <Analysis> (выбор языка на клиенте).
export function readAnalysisBoth(id) {
  return { ru: readFile(id, '.md'), en: readFile(id, '.en.md') || readFile(id, '.md') };
}
