'use client';
// Инлайн-акценты для ленты и фактов: **жирный** → <strong>, остальной текст — как есть.
// Лёгкий парсер (без markdown-движка), чтобы не ломать однострочную вёрстку <p>/<span>.
export default function Emph({ text }) {
  const s = String(text ?? '');
  if (!s.includes('**')) return s;
  const parts = s.split(/(\*\*.+?\*\*)/g);
  return parts.map((p, i) =>
    /^\*\*.+\*\*$/.test(p) ? <strong key={i}>{p.slice(2, -2)}</strong> : p
  );
}
