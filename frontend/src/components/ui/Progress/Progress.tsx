import React from 'react';
import styles from './Progress.module.css';

/* ---------- ProgressBar ---------- */
export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0-100
  max?: number;
  color?: 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  color = 'primary',
  size = 'md',
  showLabel = false,
  className,
  ...rest
}) => {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      className={[styles.barTrack, styles[`bar-${size}`], className]
        .filter(Boolean)
        .join(' ')}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      {...rest}
    >
      <div
        className={[styles.barFill, styles[`fill-${color}`]]
          .filter(Boolean)
          .join(' ')}
        style={{ width: `${pct}%` }}
      />
      {showLabel && (
        <span className={styles.barLabel}>{Math.round(pct)}%</span>
      )}
    </div>
  );
};

/* ---------- ProgressRing (Edclub circles) ---------- */
export interface ProgressRingProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0-100
  max?: number;
  size?: number; // px, default 48
  strokeWidth?: number; // px, default 4
  color?: 'primary' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  max = 100,
  size: ringSize = 48,
  strokeWidth = 4,
  color = 'primary',
  showLabel = true,
  className,
  ...rest
}) => {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div
      className={[styles.ringWrapper, className].filter(Boolean).join(' ')}
      style={{ width: ringSize, height: ringSize }}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      {...rest}
    >
      <svg width={ringSize} height={ringSize} className={styles.ringSvg}>
        <circle
          className={styles.ringBg}
          cx={ringSize / 2}
          cy={ringSize / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className={[styles.ringFill, styles[`ring-${color}`]]
            .filter(Boolean)
            .join(' ')}
          cx={ringSize / 2}
          cy={ringSize / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      {showLabel && (
        <span
          className={styles.ringLabel}
          style={{ fontSize: ringSize * 0.26 }}
        >
          {Math.round(pct)}%
        </span>
      )}
    </div>
  );
};
