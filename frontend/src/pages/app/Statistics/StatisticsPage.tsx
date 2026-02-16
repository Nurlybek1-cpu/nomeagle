import React from 'react';
import styles from './StatisticsPage.module.css';

/* ==========================================================================
   Statistics Page
   Placeholder for user statistics (e.g. progress, visited countries).
   ========================================================================== */

export const StatisticsPage: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>Statistics</h2>
        <p className={styles.subtitle}>Your progress and stats will appear here.</p>
      </div>
    </div>
  );
};
