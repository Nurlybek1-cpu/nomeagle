import React from 'react';
import { SidebarSection } from '../../components/navigation';
import type { NavItemProps } from '../../components/navigation';
import styles from './Sidebar.module.css';

/* ── Nav config ─────────────────────────────────────────────────────────── */

const mainNavItems: NavItemProps[] = [
  { label: 'Map', to: '/map', icon: '🗺️' },
  { label: 'Search', to: '/search', icon: '🔍' },
  { label: 'Saved', to: '/saved', icon: '⭐' },
  { label: 'Dashboard', to: '/dashboard', icon: '📊', end: true },
  { label: 'Achievements', to: '/achievements', icon: '🏆' },
  { label: 'Leaderboard', to: '/leaderboard', icon: '🥇' },
  { label: 'Profile', to: '/profile', icon: '👤' },
];

const bottomNavItems: NavItemProps[] = [
  { label: 'Settings', to: '/settings', icon: '⚙️' },
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
