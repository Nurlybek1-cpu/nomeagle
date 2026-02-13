/* ==========================================================================
   Dashboard Feature — Types
   Composite types specific to the dashboard feature.
   Re-exports core models so feature code only needs one import path.
   ========================================================================== */

export type {
  Region,
  CountryStatus,
  UserStats,
  CountryProgress,
} from '../../types/models';

import type { UserStats, CountryProgress } from '../../types/models';

/* --------------------------------------------------------------------------
   Dashboard API Response
   -------------------------------------------------------------------------- */

/** Shape returned by the dashboard endpoint (or mock) */
export interface DashboardResponse {
  /** Aggregated user statistics */
  user: UserStats;
  /** Countries the user has started or can start */
  activeCountries: CountryProgress[];
}

/* --------------------------------------------------------------------------
   Async State Machine
   -------------------------------------------------------------------------- */

/**
 * Discriminated union that represents every possible state of an async
 * data-fetch.  Use this in hooks / stores so components can exhaustively
 * handle loading → success | error | empty.
 */
export type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };
