'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useT } from '@/app/providers';

const TABS = [
  {
    href: '/', key: 'nav.today',
    icon: <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />,
  },
  {
    href: '/bets/', key: 'nav.bets',
    icon: <path d="M4 7h16v4a2 2 0 0 0 0 2v4H4v-4a2 2 0 0 0 0-2V7zM9 7v10" />,
  },
  {
    href: '/stats/', key: 'nav.stats',
    icon: <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" />,
  },
  {
    href: '/cards/', key: 'nav.cards',
    icon: <><rect x="3" y="5" width="13" height="15" rx="2" /><path d="M19 8v11a2 2 0 0 1-2 2H8" /></>,
  },
  {
    href: '/matches/', key: 'nav.matches',
    icon: <circle cx="12" cy="12" r="9" />,
  },
  {
    href: '/playoffs/', key: 'nav.playoffs',
    icon: <path d="M4 5h5v6H4M4 13h5v6H4M9 8h4v8h4M17 12h3" />,
  },
];

export default function Nav({ variant }) {
  const t = useT();
  const pathname = usePathname() || '/';
  const isActive = (href) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href.replace(/\/$/, ''));

  return (
    <nav className={variant === 'bottom' ? 'nav-bottom' : 'nav-top'} aria-label={t('a11y.mainNav')}>
      {TABS.map((tab) => (
        <Link key={tab.href} href={tab.href} className={isActive(tab.href) ? 'nav-item active' : 'nav-item'}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            {tab.icon}
          </svg>
          <span>{t(tab.key)}</span>
        </Link>
      ))}
    </nav>
  );
}
