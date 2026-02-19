import React from "react";
import styles from "./CourseHeader.module.css";

/* ---------- Utility ---------- */
const cx = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(" ");

/* ---------- Inline SVG Icons ---------- */

const StarIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const BoltIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

/* ---------- Props ---------- */

export interface CourseHeaderProps {
  countryCode: string;
  countryName: string;
  completedCount: number;
  totalCount: number;
  progressPct: number;
  starsTotal: number;
  pointsTotal: number;
  className?: string;
}

/* ---------- Component ---------- */

export const CourseHeader: React.FC<CourseHeaderProps> = ({
  countryCode,
  countryName,
  completedCount,
  totalCount,
  progressPct,
  starsTotal,
  pointsTotal,
  className,
}) => {
  const flagSrc = `/assets/icons/countries/${countryCode}.svg`;

  return (
    <header className={cx(styles.header, className)}>
      {/* Country flag */}
      <img
        className={styles.flag}
        src={flagSrc}
        alt={`${countryName} flag`}
        width={48}
        height={48}
      />

      {/* Title block */}
      <div className={styles.info}>
        <h1 className={styles.title}>{countryName}</h1>
        <p className={styles.subtitle}>Country Course</p>
      </div>

      {/* Progress bar */}
      <div className={styles.progressSection}>
        <div className={styles.progressLabel}>
          <span className={styles.progressPct}>{progressPct}%</span>
          <span className={styles.progressCount}>
            {completedCount} / {totalCount} lessons
          </span>
        </div>
        <div
          className={styles.progressTrack}
          role="progressbar"
          aria-valuenow={progressPct}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={styles.progressFill}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Stats chips */}
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={cx(styles.statIcon, styles.statIconStars)}>
            <StarIcon />
          </span>
          <span className={styles.statValue}>{starsTotal}</span>
          <span className={styles.statLabel}>Stars</span>
        </div>
        <div className={styles.stat}>
          <span className={cx(styles.statIcon, styles.statIconPoints)}>
            <BoltIcon />
          </span>
          <span className={styles.statValue}>{pointsTotal.toLocaleString()}</span>
          <span className={styles.statLabel}>XP</span>
        </div>
      </div>
    </header>
  );
};
