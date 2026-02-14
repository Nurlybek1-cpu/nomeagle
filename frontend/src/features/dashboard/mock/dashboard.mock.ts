/* ==========================================================================
   Dashboard Feature — Mock Data
   Provides realistic sample data so we can build & test UI without a backend.
   ========================================================================== */

import type { DashboardResponse } from '../types';
import type { UserStats, CountryProgress } from '../../../types/models';

/* --------------------------------------------------------------------------
   Mock: User Stats
   -------------------------------------------------------------------------- */

export const MOCK_USER_STATS: UserStats = {
  xp: 4_820,
  level: 7,
  xpToNextLevel: 1_180, // 6 000 − 4 820
  streakDays: 12,
  accuracy: 87,
  timeTodayMinutes: 23,
  timeWeekMinutes: 148,
  timeTotalMinutes: 2_340,
};

/**
 * Mock week progress (Mon → Sun).
 * true = practised that day, false = not yet.
 * Simulates: Mon–Wed done, Thu is today (not done yet), Fri–Sun upcoming.
 */
export const MOCK_WEEK_PROGRESS: boolean[] = [
  true, true, true, false, false, false, false,
];

/* --------------------------------------------------------------------------
   Mock: Country Progress
   -------------------------------------------------------------------------- */

export const MOCK_COUNTRIES: CountryProgress[] = [
  {
    countryId: 'jp',
    countryName: 'Japan',
    flagEmoji: '🇯🇵',
    region: 'Asia',
    status: 'in_progress',
    progressPct: 64,
    teaser: 'Discover sushi origins, bullet trains, and ancient temples.',
    lastLessonTitle: 'Geography: Islands & Mountains',
  },
  {
    countryId: 'it',
    countryName: 'Italy',
    flagEmoji: '🇮🇹',
    region: 'Europe',
    status: 'completed',
    progressPct: 100,
    teaser: 'From the Colosseum to Tuscan vineyards — bellissimo!',
    lastLessonTitle: 'Culture: Art & Architecture',
  },
  {
    countryId: 'br',
    countryName: 'Brazil',
    flagEmoji: '🇧🇷',
    region: 'South America',
    status: 'not_started',
    progressPct: 0,
    teaser: 'Explore the Amazon, Carnival, and football culture.',
  },
];

/* --------------------------------------------------------------------------
   Mock: Full Dashboard Response
   -------------------------------------------------------------------------- */

export const MOCK_DASHBOARD: DashboardResponse = {
  user: MOCK_USER_STATS,
  activeCountries: MOCK_COUNTRIES,
};

/* --------------------------------------------------------------------------
   Simulated Async Fetcher
   Use this in hooks to mimic network latency.
   Usage:  const data = await fetchMockDashboard();
   -------------------------------------------------------------------------- */

const SIMULATED_DELAY_MS = 600;

export function fetchMockDashboard(): Promise<DashboardResponse> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(structuredClone(MOCK_DASHBOARD)), SIMULATED_DELAY_MS);
  });
}
