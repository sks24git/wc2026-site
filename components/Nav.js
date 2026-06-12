'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  {
    href: '/', label: 'Сегодня',
    icon: <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />,
  },
  {
    href: '/bets/', label: 'Ставки',
    icon: <path d="M4 7h16v4a2 2 0 0 0 0 2v4H4v-4a2 2 0 0 0 0-2V7zM9 7v10" />,
  },
  {
    href: '/stats/', label: 'Стата',
    icon: <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" />,
  },
  {
    href: '/matches/', label: 'Матчи',
    icon: <circle cx="12" cy="12" r="9" />,
  },
];

export default function Nav({ variant }) {
  const pathname = usePathname() || '/';
  const isActive = (href) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href.replace(/\/$/, ''));

  return (
    <nav className={variant === 'bottom' ? 'nav-bottom' : 'nav-top'} aria-label="Основная навигация">
      {TABS.map((t) => (
        <Link key={t.href} href={t.href} className={isActive(t.href) ? 'nav-item active' : 'nav-item'}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            {t.icon}
          </svg>
          <span>{t.label}</span>
        </Link>
      ))}
    </nav>
  );
}
