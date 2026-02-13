import React from 'react';
import type { UserStats } from '../../types';
import { XPLevelCard } from '../cards/XPLevelCard';
import { TimeSpentCard } from '../cards/TimeSpentCard';
import { AccuracyCard } from '../cards/AccuracyCard';
import { StreakCard } from '../cards/StreakCard';
import styles from './StatsPanel.module.css';

/* ---------- Props ---------- */

export interface StatsPanelProps {
  stats: UserStats;
}

/* ---------- Component ---------- */

/**
 * Right-column stats stack (Edclub-style).
 * Arranges the four stat cards in a vertical layout.
 */
export const StatsPanel: React.FC<StatsPanelProps> = ({ stats }) => (
  <aside className={styles.panel} aria-label="Your statistics">
    <XPLevelCard stats={stats} />
    <StreakCard stats={stats} />
    <TimeSpentCard stats={stats} />
    <AccuracyCard stats={stats} />
  </aside>
);
