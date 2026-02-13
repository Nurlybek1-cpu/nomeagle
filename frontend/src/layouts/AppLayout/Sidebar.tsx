import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

/* ── Nav item config ────────────────────────────────────────────────────── */

interface NavItem {
  label: string;
  to: string;
  icon: string; // emoji placeholder — swap for real icons later
}

const mainNavItems: NavItem[] = [
  { label: 'Map', to: '/map', icon: '🗺️' },
  { label: 'Search', to: '/search', icon: '🔍' },
  { label: 'Saved', to: '/saved', icon: '⭐' },
  { label: 'Dashboard', to: '/dashboard', icon: '📊' },
  { label: 'Achievements', to: '/achievements', icon: '🏆' },
  { label: 'Leaderboard', to: '/leaderboard', icon: '🥇' },
  { label: 'Profile', to: '/profile', icon: '👤' },
];

const bottomNavItems: NavItem[] = [
  { label: 'Settings', to: '/settings', icon: '⚙️' },
];

/* ── Helpers ─────────────────────────────────────────────────────────────── */

const buildLinkClass = ({ isActive }: { isActive: boolean }): string =>
  [styles.navLink, isActive ? styles.active : ''].filter(Boolean).join(' ');

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
        <span className={styles.navLabel}>Menu</span>

        {mainNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={buildLinkClass}
            end={item.to === '/dashboard'}
          >
            <span className={styles.navIcon} aria-hidden="true">
              {item.icon}
            </span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className={styles.bottom}>
        {bottomNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={buildLinkClass}
          >
            <span className={styles.navIcon} aria-hidden="true">
              {item.icon}
            </span>
            {item.label}
          </NavLink>
        ))}
      </div>
    </aside>
  );
};
