'use client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLang } from '@/app/providers';

// Принимает { ru, en } markdown-строки (обе прочитаны на сборке), рендерит активный язык.
export default function Analysis({ md }) {
  const lang = useLang();
  const text = (md && (md[lang] || md.ru || md.en)) || '';
  if (!text) return null;
  return (
    <article className="md">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
    </article>
  );
}
