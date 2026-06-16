'use client';
import { useT } from '@/app/providers';

// Маленький клиентский заголовок по i18n-ключу — для серверных страниц,
// которые сами не могут звать useT() (h1/подзаголовки).
export default function Heading({ tkey, tag = 'h1', className }) {
  const t = useT();
  const Tag = tag;
  return <Tag className={className}>{t(tkey)}</Tag>;
}
