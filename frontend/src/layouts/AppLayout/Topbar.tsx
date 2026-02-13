import React from 'react';
import { useLocation } from 'react-router-dom';
import { Avatar } from '../../components/ui/Avatar/Avatar';
import { Breadcrumbs } from '../../components/navigation';
import type { BreadcrumbItem } from '../../components/navigation';
import styles from './Topbar.module.css';

/* ── Route → Page title map ─────────────────────────────────────────────── */

const pageTitles: Record<string, string> = {
  '/map': 'Map',
  '/search': 'Search',
  '/saved': 'Saved Places',
  '/dashboard': 'Dashboard',
  '/achievements': 'Achievements',
  '/leaderboard': 'Leaderboard',
  '/profile': 'Profile',
  '/settings': 'Settings',
};

/* ── Build breadcrumbs from pathname ────────────────────────────────────── */

const buildBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  const crumbs: BreadcrumbItem[] = [{ label: 'Home', to: '/dashboard' }];

  const segments = pathname.split('/').filter(Boolean);
  let accumulated = '';

  segments.forEach((segment, i) => {
    accumulated += `/${segment}`;
    const isLast = i === segments.length - 1;
    const label =
      pageTitles[accumulated] ??
      segment.charAt(0).toUpperCase() + segment.slice(1);

    crumbs.push(isLast ? { label } : { label, to: accumulated });
  });

  return crumbs;
};

/* ── Component ──────────────────────────────────────────────────────────── */

export const Topbar: React.FC = () => {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] ?? 'NomEagle';
  const crumbs = buildBreadcrumbs(pathname);

  return (
    <header className={styles.topbar} role="banner">
      {/* Left – title + breadcrumbs */}
      <div className={styles.left}>
        <h1 className={styles.title}>{title}</h1>
        {crumbs.length > 1 && <Breadcrumbs items={crumbs} />}
      </div>

      {/* Right – actions */}
      <div className={styles.actions}>
        {/* Language selector placeholder */}
        <button
          type="button"
          className={styles.langSelect}
          aria-label="Select language"
        >
          🌐
          <span>EN</span>
          <span className={styles.chevron} aria-hidden="true">
            ▾
          </span>
        </button>

        {/* User dropdown placeholder */}
        <button
          type="button"
          className={styles.userTrigger}
          aria-label="User menu"
        >
          <Avatar name="Nurlybek" size="sm" />
          <span className={styles.userName}>Nurlybek</span>
          <span className={styles.chevron} aria-hidden="true">
            ▾
          </span>
        </button>
      </div>
    </header>
  );
};
