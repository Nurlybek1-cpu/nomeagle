import { useCallback, useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/ui/Card';
import { Loading, ErrorState } from '../../../components/feedback';
import {
  CountryLearningCard,
  EmptyStateCard,
  StatsPanel,
} from '../../../features/dashboard/components';
import { fetchMockDashboard, MOCK_WEEK_PROGRESS } from '../../../features/dashboard/mock/dashboard.mock';
import type { DashboardResponse, AsyncState } from '../../../features/dashboard/types';
import styles from './DashboardPage.module.css';

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

  const loadDashboard = useCallback(() => {
    setState({ status: 'loading' });

    fetchMockDashboard()
      .then((data) => setState({ status: 'success', data }))
      .catch((err) => setState({ status: 'error', error: String(err) }));
  }, []);

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
          <CardHeader>
            <h2 className={styles.sectionTitle}>My Learning Countries</h2>
          </CardHeader>
          <CardContent>
            {activeCountries.length > 0 ? (
              <div className={styles.countryGrid}>
                {activeCountries.map((country) => (
                  <CountryLearningCard
                    key={country.countryId}
                    country={country}
                    onAction={(id) => {
                      // TODO: navigate to /country/:id
                      console.log('Navigate to country:', id);
                    }}
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
