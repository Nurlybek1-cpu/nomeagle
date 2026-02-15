import { useCallback, useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/ui/Card';
import { Loading, ErrorState } from '../../../components/feedback';
import {
  CountryLearningCard,
  EmptyStateCard,
  StatsPanel,
  ViewToggle,
} from '../../../features/dashboard/components';
import type { ViewMode } from '../../../features/dashboard/components';
import { fetchMockDashboard, MOCK_WEEK_PROGRESS } from '../../../features/dashboard/mock/dashboard.mock';
import type { DashboardResponse, AsyncState } from '../../../features/dashboard/types';
import { removeLearningCountry } from '../../../features/countries/data';
import styles from './DashboardPage.module.css';

/* ---------- localStorage key for view mode persistence ---------- */
const VIEW_MODE_STORAGE_KEY = 'ne.dashboard.countriesViewMode';

/** Get initial view mode from localStorage or default to 'grid' */
const getInitialViewMode = (): ViewMode => {
  try {
    const stored = localStorage.getItem(VIEW_MODE_STORAGE_KEY);
    if (stored === 'list' || stored === 'grid') {
      return stored;
    }
  } catch {
    // localStorage not available
  }
  return 'grid';
};

/* ==========================================================================
   Dashboard Page

   ┌─────────────────────────────────────────────────────────┐
   │  AppLayout (Sidebar │ Topbar)                           │
   │  ┌────────────────────────────┬────────────────────────┐│
   │  │  My Learning Countries     │  Stats Panel           ││
   │  │  ┌──────────┬──────────┐   │  ┌──────────────────┐  ││
   │  │  │ 🇯🇵 Japan │ 🇮🇹 Italy│   │  │ ⚡ Level & XP    │  ││
   │  │  │  64%     │  100%    │   │  ├──────────────────┤  ││
   │  │  ├──────────┼──────────┤   │  │ 🔥 Streak        │  ││
   │  │  │ 🇧🇷 Brazil│          │   │  ├──────────────────┤  ││
   │  │  │  0%      │          │   │  │ ⏱️ Time Spent    │  ││
   │  │  └──────────┴──────────┘   │  ├──────────────────┤  ││
   │  │                            │  │ 🎯 Accuracy      │  ││
   │  │                            │  └──────────────────┘  ││
   │  └────────────────────────────┴────────────────────────┘│
   └─────────────────────────────────────────────────────────┘

   States: loading → <Loading />  |  error → <ErrorState />  |  success → content
   ========================================================================== */

export const DashboardPage: React.FC = () => {
  const [state, setState] = useState<AsyncState<DashboardResponse>>({
    status: 'loading',
  });

  /* ---- View mode state (persisted to localStorage) ---- */
  const [viewMode, setViewMode] = useState<ViewMode>(getInitialViewMode);

  /** Handle view mode change and persist to localStorage */
  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    try {
      localStorage.setItem(VIEW_MODE_STORAGE_KEY, mode);
    } catch {
      // localStorage not available
    }
  }, []);

  const loadDashboard = useCallback(() => {
    setState({ status: 'loading' });

    fetchMockDashboard()
      .then((data) => setState({ status: 'success', data }))
      .catch((err) => setState({ status: 'error', error: String(err) }));
  }, []);

  /** Handle reset progress action from card menu */
  const handleResetProgress = useCallback((countryId: string) => {
    // TODO: Implement reset progress API call
    console.log('Reset progress for country:', countryId);
  }, []);

  /** Handle remove from dashboard action from card menu */
  const handleRemoveFromDashboard = useCallback(
    (countryId: string) => {
      removeLearningCountry(countryId);
      loadDashboard();
    },
    [loadDashboard]
  );

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  /* ---- Loading ---- */
  if (state.status === 'loading' || state.status === 'idle') {
    return (
      <div className={styles.grid}>
        <div className={styles.left}>
          <Card>
            <CardContent>
              <Loading rows={2} columns={2} blockHeight={180} />
            </CardContent>
          </Card>
        </div>
        <div className={styles.right}>
          <Loading rows={4} columns={1} blockHeight={120} showHeading={false} />
        </div>
      </div>
    );
  }

  /* ---- Error ---- */
  if (state.status === 'error') {
    return (
      <Card>
        <CardContent>
          <ErrorState message={state.error} onRetry={loadDashboard} />
        </CardContent>
      </Card>
    );
  }

  /* ---- Success ---- */
  const { user, activeCountries } = state.data;

  return (
    <div className={styles.grid}>
      {/* ── Left column: country cards ────────────────────────────── */}
      <section className={styles.left}>
        <Card>
          <CardHeader className={styles.cardHeader}>
            <h2 className={styles.sectionTitle}>My Learning Countries</h2>
            <ViewToggle value={viewMode} onChange={handleViewModeChange} />
          </CardHeader>
          <CardContent>
            {activeCountries.length > 0 ? (
              <div className={viewMode === 'grid' ? styles.countryGrid : styles.countryList}>
                {activeCountries.map((country) => (
                  <CountryLearningCard
                    key={country.countryId}
                    country={country}
                    variant={viewMode}
                    onAction={(id) => {
                      // TODO: navigate to /country/:id
                      console.log('Navigate to country:', id);
                    }}
                    onReset={handleResetProgress}
                    onRemove={handleRemoveFromDashboard}
                  />
                ))}
              </div>
            ) : (
              <EmptyStateCard
                onAction={() => {
                  // TODO: navigate to /browse
                  console.log('Navigate to browse');
                }}
              />
            )}
          </CardContent>
        </Card>
      </section>

      {/* ── Right column: stats ───────────────────────────────────── */}
      <section className={styles.right}>
        <StatsPanel stats={user} weekProgress={MOCK_WEEK_PROGRESS} />
      </section>
    </div>
  );
};
