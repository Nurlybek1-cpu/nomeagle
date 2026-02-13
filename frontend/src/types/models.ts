/* ==========================================================================
   NomEagle — Core Domain Models
   Single source of truth for shared data types across the app.
   ========================================================================== */

/* --------------------------------------------------------------------------
   Enums & Unions
   -------------------------------------------------------------------------- */

/** Geographic region of a country */
export type Region =
  | 'Asia'
  | 'Europe'
  | 'Africa'
  | 'North America'
  | 'South America'
  | 'Oceania';

/** Learning status for a country card */
export type CountryStatus = 'not_started' | 'in_progress' | 'completed';

/* --------------------------------------------------------------------------
   User Stats
   -------------------------------------------------------------------------- */

/** Aggregate statistics shown on the dashboard right-hand column */
export interface UserStats {
  /** Total experience points earned */
  xp: number;
  /** Current level (derived from xp) */
  level: number;
  /** XP required to reach the next level */
  xpToNextLevel: number;
  /** Consecutive days the user has practised */
  streakDays: number;
  /** Overall answer accuracy (0–100) */
  accuracy: number;
  /** Minutes practised today */
  timeTodayMinutes: number;
  /** Minutes practised this week */
  timeWeekMinutes: number;
  /** Total minutes practised all-time */
  timeTotalMinutes: number;
}

/* --------------------------------------------------------------------------
   Country Progress
   -------------------------------------------------------------------------- */

/** A single country the user can learn about */
export interface CountryProgress {
  /** Unique identifier (e.g. "jp", "it", "br") */
  countryId: string;
  /** Display name */
  countryName: string;
  /** Unicode flag emoji (optional, falls back to placeholder) */
  flagEmoji?: string;
  /** Geographic region */
  region: Region;
  /** Current learning status */
  status: CountryStatus;
  /** Completion percentage (0–100) */
  progressPct: number;
  /** Short teaser sentence shown on the card */
  teaser: string;
  /** Title of the last completed lesson (undefined if none) */
  lastLessonTitle?: string;
}
