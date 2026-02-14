import React from 'react';
import { SidebarSection } from '../../components/navigation';
import type { NavItemProps } from '../../components/navigation';
import styles from './Sidebar.module.css';

/* ── Nav config ─────────────────────────────────────────────────────────── */

const mainNavItems: NavItemProps[] = [
  { label: 'Map',          to: '/map',          iconName: 'map' },
  { label: 'Search',       to: '/search',       iconName: 'search' },
  { label: 'Saved',        to: '/saved',        iconName: 'saved' },
  { label: 'Dashboard',    to: '/dashboard',    iconName: 'dashboard', end: true },
  { label: 'Achievements', to: '/achievements', iconName: 'achievements' },
  { label: 'Leaderboard',  to: '/leaderboard',  iconName: 'leaderboard' },
  { label: 'Profile',      to: '/profile',      iconName: 'profile' },
];

const bottomNavItems: NavItemProps[] = [
  { label: 'Settings', to: '/settings', iconName: 'settings' },
];

/* ── Component ──────────────────────────────────────────────────────────── */

export const Sidebar: React.FC = () => {
  return (
    <aside className={styles.sidebar} aria-label="Main navigation">
      {/* Logo */}
      <div className={styles.logo}>
        <span className={styles.logoIcon} aria-hidden="true">
          N
        </span>
        <span className={styles.logoText}>NomEagle</span>
      </div>

      {/* Main nav */}
      <nav className={styles.nav}>
        <SidebarSection title="Menu" items={mainNavItems} />
      </nav>

      {/* Bottom section */}
      <div className={styles.bottom}>
        <SidebarSection items={bottomNavItems} />
      </div>
    </aside>
  );
};
