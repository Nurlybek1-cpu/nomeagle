import React from 'react';
import { Card } from '../../../../components/ui/Card';
import { ProgressBar } from '../../../../components/ui/Progress/ProgressBar';
import { ProgressRing } from '../../../../components/ui/Progress/ProgressRing';
import { StreakSection } from '../streak';
import type { UserStats } from '../../types';
import styles from './UnifiedStatsCard.module.css';

/* ==========================================================================
   UnifiedStatsCard

   ┌──────────────────────────┐
   │ ⚡ Level & XP            │
   │ Level 7                  │
   │ ████████░░░  1,180 to go │
   ├──────────────────────────┤
   │ 🔥 Streak                │
   │ 12 days                  │
   │ Keep your streak alive!  │
   ├──────────────────────────┤
   │ ⏱️ Time Spent            │
   │ (●) Today (●) Week (●)  │
   │  23m      2h 28m   39h  │
   ├──────────────────────────┤
   │ 🎯 Accuracy              │
   │ 87%                      │
   │ Lessons completed        │
   └──────────────────────────┘
   ========================================================================== */

/* ---------- Helpers ---------- */

const fmtMin = (m: number): string => {
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem > 0 ? `${h}h ${rem}m` : `${h}h`;
};

/* ---------- Shared sub-components ---------- */

/** Section title row — icon + label */
const SectionHeader: React.FC<{ icon: string; label: string }> = ({
  icon,
  label,
}) => (
  <div className={styles.sectionHeader}>
    <span className={styles.sectionIcon} aria-hidden="true">{icon}</span>
    <h4 className={styles.sectionLabel}>{label}</h4>
  </div>
);

/** Horizontal 1px rule between sections */
const SectionDivider: React.FC = () => (
  <hr className={styles.divider} />
);

/* ==========================================================================
   Section 1 — XP & Level
   ========================================================================== */

interface XPLevelSectionProps {
  xp: number;
  level: number;
  xpToNextLevel: number;
}

const XPLevelSection: React.FC<XPLevelSectionProps> = ({
  xp,
  level,
  xpToNextLevel,
}) => {
  const xpInLevel = xp % (xp + xpToNextLevel) || xp;
  const xpMax = xpInLevel + xpToNextLevel;

  return (
    <div className={styles.section}>
      <SectionHeader icon="⚡" label="Level & XP" />
      <span className={styles.bigValue}>Level {level}</span>
      <div className={styles.xpBar}>
        <ProgressBar value={xpInLevel} max={xpMax} color="primary" size="sm" />
        <span className={styles.helpText}>
          {xpToNextLevel.toLocaleString()} XP to next level
        </span>
      </div>
    </div>
  );
};

/* Section 2 — Streak (delegated to standalone StreakSection component) */

/* ==========================================================================
   Section 3 — Time Spent
   ========================================================================== */

interface TimeSpentSectionProps {
  timeTodayMinutes: number;
  timeWeekMinutes: number;
  timeTotalMinutes: number;
}

const DAILY_GOAL = 30;
const WEEKLY_GOAL = 180;
const TOTAL_CAP = 6_000;

const TimeSpentSection: React.FC<TimeSpentSectionProps> = ({
  timeTodayMinutes,
  timeWeekMinutes,
  timeTotalMinutes,
}) => {
  const rings: {
    label: string;
    value: number;
    max: number;
    color: 'primary' | 'success' | 'warning';
    display: string;
  }[] = [
    { label: 'Today', value: timeTodayMinutes, max: DAILY_GOAL,  color: 'primary', display: fmtMin(timeTodayMinutes) },
    { label: 'Week',  value: timeWeekMinutes,  max: WEEKLY_GOAL, color: 'success', display: fmtMin(timeWeekMinutes) },
    { label: 'Total', value: timeTotalMinutes,  max: TOTAL_CAP,  color: 'warning', display: fmtMin(timeTotalMinutes) },
  ];

  return (
    <div className={styles.section}>
      <SectionHeader icon="⏱️" label="Time Spent" />
      <div className={styles.ringsRow}>
        {rings.map((r) => (
          <div key={r.label} className={styles.ringItem}>
            <ProgressRing
              value={Math.min(r.value, r.max)}
              max={r.max}
              size="sm"
              color={r.color}
              showLabel={false}
            />
            <span className={styles.ringValue}>{r.display}</span>
            <span className={styles.ringLabel}>{r.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ==========================================================================
   Section 4 — Accuracy
   ========================================================================== */

interface AccuracySectionProps {
  accuracy: number;
}

const AccuracySection: React.FC<AccuracySectionProps> = ({ accuracy }) => (
  <div className={styles.section}>
    <SectionHeader icon="🎯" label="Accuracy" />
    <div className={styles.valueRow}>
      <span className={styles.bigValue}>{accuracy}</span>
      <span className={styles.valueSuffix}>%</span>
    </div>
    <p className={styles.helpText}>Lessons completed</p>
  </div>
);

/* ==========================================================================
   Main Component
   ========================================================================== */

export interface UnifiedStatsCardProps {
  stats: UserStats;
  /** 7 booleans (Mon → Sun) for the streak week row */
  weekProgress?: boolean[];
}

export const UnifiedStatsCard: React.FC<UnifiedStatsCardProps> = ({
  stats,
  weekProgress = [false, false, false, false, false, false, false],
}) => (
  <Card className={styles.card}>
    <XPLevelSection
      xp={stats.xp}
      level={stats.level}
      xpToNextLevel={stats.xpToNextLevel}
    />
    <SectionDivider />
    <div className={styles.section}>
      <StreakSection
        streakDays={stats.streakDays}
        weekProgress={weekProgress}
      />
    </div>
    <SectionDivider />
    <TimeSpentSection
      timeTodayMinutes={stats.timeTodayMinutes}
      timeWeekMinutes={stats.timeWeekMinutes}
      timeTotalMinutes={stats.timeTotalMinutes}
    />
    <SectionDivider />
    <AccuracySection accuracy={stats.accuracy} />
  </Card>
);
