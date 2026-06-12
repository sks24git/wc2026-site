import fs from 'node:fs';
import path from 'node:path';

// Читается только на сборке (server / static export). Не импортировать в клиентские компоненты.
export function readAnalysis(id) {
  try {
    return fs.readFileSync(path.join(process.cwd(), 'content', 'analysis', id + '.md'), 'utf8');
  } catch {
    return '';
  }
}
