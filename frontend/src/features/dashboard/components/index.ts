/* ==========================================================================
   Dashboard Feature — Component Barrel Export
   ========================================================================== */

// Country learning card (left column)
export { CountryLearningCard } from './CountryLearningCard';
export type { CountryLearningCardProps } from './CountryLearningCard';

// Empty state
export { EmptyStateCard } from './EmptyStateCard';
export type { EmptyStateCardProps } from './EmptyStateCard';

// Stats panel (right column — contains all stat cards)
export { StatsPanel } from './StatsPanel';
export type { StatsPanelProps } from './StatsPanel';

// Unified stats card (single card with all stats)
export { UnifiedStatsCard } from './UnifiedStatsCard';
export type { UnifiedStatsCardProps } from './UnifiedStatsCard';

// XP level section (gamified progress bar with runner)
export { XPLevelSection } from './xp';
export type { XPLevelSectionProps } from './xp';

// Streak section (Duolingo-style gamified streak)
export { StreakSection } from './streak';
export type { StreakSectionProps } from './streak';

// Individual stat cards (legacy — kept for standalone use)
export { XPLevelCard } from './cards/XPLevelCard';
export type { XPLevelCardProps } from './cards/XPLevelCard';

export { TimeSpentCard } from './cards/TimeSpentCard';
export type { TimeSpentCardProps } from './cards/TimeSpentCard';

export { AccuracyCard } from './cards/AccuracyCard';
export type { AccuracyCardProps } from './cards/AccuracyCard';

export { StreakCard } from './cards/StreakCard';
export type { StreakCardProps } from './cards/StreakCard';
