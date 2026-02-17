import React from 'react';
import { SpeedCard, PracticeTimeCard, AttemptsCard } from '../../../features/stats/components';
import { getMockStats } from '../../../features/stats/mock/stats.mock';
import styles from './StatisticsPage.module.css';

/* ==========================================================================
   Statistics Page
   Top row: Speed + Accuracy/Coverage, Practice Time donut, Practice Attempts.
   ========================================================================== */

export const StatisticsPage: React.FC = () => {
  const stats = getMockStats();

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>Statistics</h2>
        <p className={styles.subtitle}>Your progress and stats.</p>
      </div>
      <div className={styles.cardsRow}>
        <SpeedCard
          xpLevel={stats.xpLevel}
          accuracyCoverage={stats.accuracyCoverage}
        />
        <PracticeTimeCard practiceTime={stats.practiceTime} />
        <AttemptsCard attempts={stats.attempts} />
      </div>
    </div>
  );
};
