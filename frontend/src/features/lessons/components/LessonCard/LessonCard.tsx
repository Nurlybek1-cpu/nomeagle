import React from "react";
import type { LessonType, LessonStatus } from "../../types";
import styles from "./LessonCard.module.css";

/* ---------- Utility ---------- */
const cx = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(" ");

/* ---------- Inline SVG Icons ---------- */

const LockIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const CheckIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
  <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

/** Lesson type icon mapping — inline SVGs for each type */
const TYPE_ICONS: Record<LessonType, React.ReactNode> = {
  video: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  ),
  article: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  scenario: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  flashcards: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  ),
  quiz: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  summary: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  matching: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  fill_blank: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="17" y1="10" x2="3" y2="10" />
      <line x1="21" y1="6" x2="3" y2="6" />
      <line x1="21" y1="14" x2="3" y2="14" />
      <line x1="17" y1="18" x2="3" y2="18" />
    </svg>
  ),
};

/* ---------- Props ---------- */

export interface LessonCardProps {
  id: string;
  index: number;
  type: LessonType;
  shortLabel: string;
  status: LessonStatus;
  isCurrent?: boolean;
  starsEarned?: number;
  xpReward: number;
  onClick?: (lessonId: string) => void;
  className?: string;
}

/* ---------- Component ---------- */

export const LessonCard: React.FC<LessonCardProps> = ({
  id,
  index,
  type,
  shortLabel,
  status,
  isCurrent = false,
  starsEarned = 0,
  xpReward,
  onClick,
  className,
}) => {
  const isClickable = status !== "locked";

  const handleClick = () => {
    if (isClickable && onClick) onClick(id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === " ") && isClickable && onClick) {
      e.preventDefault();
      onClick(id);
    }
  };

  return (
    <div
      className={cx(
        styles.card,
        status === "completed" && styles.completed,
        status === "available" && !isCurrent && styles.available,
        status === "locked" && styles.locked,
        isCurrent && styles.current,
        className
      )}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`Lesson ${index}: ${shortLabel}${status === "locked" ? " (locked)" : ""}${status === "completed" ? " (completed)" : ""}`}
    >
      {/* Top area */}
      <div className={styles.top}>
        <span className={styles.lessonNumber}>{index}</span>
        <span className={styles.typeIcon}>{TYPE_ICONS[type]}</span>

        {status === "locked" && (
          <span className={styles.lockBadge} aria-hidden="true">
            <LockIcon />
          </span>
        )}

        {status === "completed" && (
          <span className={styles.checkOverlay} aria-hidden="true">
            <CheckIcon />
          </span>
        )}
      </div>

      {/* Stars (completed only) */}
      {status === "completed" && (
        <div className={styles.starsRow} aria-label={`${starsEarned} of 5 stars`}>
          {Array.from({ length: 5 }, (_, i) => (
            <span
              key={i}
              className={cx(styles.star, i < starsEarned && styles.starFilled)}
            >
              <StarIcon filled={i < starsEarned} />
            </span>
          ))}
        </div>
      )}

      {/* XP tag (available / current) */}
      {status !== "completed" && status !== "locked" && (
        <div className={styles.xpTag}>+{xpReward} XP</div>
      )}

      {/* Bottom strip */}
      <div className={styles.bottom}>
        <p className={styles.label} title={shortLabel}>
          {shortLabel}
        </p>
      </div>
    </div>
  );
};
