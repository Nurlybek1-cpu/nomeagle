import React from "react";
import type { LessonType, LessonStatus } from "../../types";
import styles from "./LessonCard.module.css";

/* ---------- Utility ---------- */
const cx = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(" ");

/* ---------- Inline SVG Icons (lock / check / star only) ---------- */

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

/* ---------- Sprite class map ---------- */

const SPRITE_CLASS: Record<LessonType, string> = {
  video: styles.spriteVideo,
  article: styles.spriteArticle,
  flashcards: styles.spriteFlashcards,
  quiz: styles.spriteQuiz,
  scenario: styles.spriteScenario,
  summary: styles.spriteSummary,
  matching: styles.spriteMatching,
  open_response: styles.spriteOpenResponse,
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
      {/* Lesson number */}
      <span className={styles.lessonNumber}>{index}</span>

      {/* SVG sprite illustration */}
      <div
        className={cx(styles.spriteIcon, SPRITE_CLASS[type])}
        aria-hidden="true"
      />

      {/* Lock badge (top-right) */}
      {status === "locked" && (
        <span className={styles.lockBadge} aria-hidden="true">
          <LockIcon />
        </span>
      )}

      {/* Green check (bottom-left, Edclub style) */}
      {status === "completed" && (
        <span className={styles.checkOverlay} aria-hidden="true">
          <CheckIcon />
        </span>
      )}

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

      {/* Bottom label */}
      <div className={styles.bottom}>
        <p className={styles.label} title={shortLabel}>
          {shortLabel}
        </p>
      </div>
    </div>
  );
};
