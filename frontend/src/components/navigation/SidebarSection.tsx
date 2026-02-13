import React from 'react';
import { NavItem, type NavItemProps } from './NavItem';
import styles from './SidebarSection.module.css';

/* ── Props ──────────────────────────────────────────────────────────────── */

export interface SidebarSectionProps {
  /** Optional heading rendered above the items */
  title?: string;
  /** Array of nav item descriptors */
  items: NavItemProps[];
}

/* ── Component ──────────────────────────────────────────────────────────── */

export const SidebarSection: React.FC<SidebarSectionProps> = ({
  title,
  items,
}) => {
  if (items.length === 0) return null;

  return (
    <div className={styles.section} role="group" aria-label={title}>
      {title && <span className={styles.title}>{title}</span>}

      {items.map((item) => (
        <NavItem key={item.to} {...item} />
      ))}
    </div>
  );
};
