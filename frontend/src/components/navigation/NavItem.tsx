import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './NavItem.module.css';

/* ── Props ──────────────────────────────────────────────────────────────── */

export interface NavItemProps {
  /** Route path */
  to: string;
  /** Visible label text */
  label: string;
  /** Leading icon (ReactNode – emoji, SVG, component, etc.) */
  icon?: React.ReactNode;
  /** If true, NavLink only matches exact path */
  end?: boolean;
  /** Optional small badge shown on the right (e.g. "NEW") */
  badgeText?: string;
  /** Renders the item as non-interactive */
  disabled?: boolean;
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */

const buildClassName = (
  disabled: boolean,
  { isActive }: { isActive: boolean },
): string =>
  [
    styles.navItem,
    isActive && !disabled ? styles.active : '',
    disabled ? styles.disabled : '',
  ]
    .filter(Boolean)
    .join(' ');

/* ── Component ──────────────────────────────────────────────────────────── */

export const NavItem: React.FC<NavItemProps> = ({
  to,
  label,
  icon,
  end,
  badgeText,
  disabled = false,
}) => {
  return (
    <NavLink
      to={to}
      end={end}
      className={(props) => buildClassName(disabled, props)}
      tabIndex={disabled ? -1 : undefined}
      aria-disabled={disabled || undefined}
      aria-current={undefined} /* NavLink sets this automatically when active */
    >
      {icon != null && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}

      <span className={styles.label}>{label}</span>

      {badgeText && (
        <span className={styles.badge} aria-label={badgeText}>
          {badgeText}
        </span>
      )}
    </NavLink>
  );
};
