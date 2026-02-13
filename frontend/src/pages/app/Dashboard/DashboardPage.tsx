import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/ui/Card';
import { Skeleton } from '../../../components/ui/Skeleton';
import {
  CountryLearningCard,
  EmptyStateCard,
  StatsPanel,
} from '../../../features/dashboard/components';
import { fetchMockDashboard } from '../../../features/dashboard/mock/dashboard.mock';
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

   States: loading → skeleton grid  |  error → message  |  success → content
   ========================================================================== */

/* ---------- Loading skeleton ---------- */

const DashboardSkeleton: React.FC = () => (
  <div className={styles.grid}>
    <div className={styles.left}>
      <Card>
        <CardHeader>
          <Skeleton variant="text" width="60%" height="1.25rem" />
        </CardHeader>
        <CardContent>
          <div className={styles.skeletonCards}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} variant="rect" height={180} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>

    <div className={styles.right}>
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} variant="rect" height={120} />
      ))}
    </div>
  </div>
);

/* ---------- Error state ---------- */

const DashboardError: React.FC<{ message: string }> = ({ message }) => (
  <Card>
    <CardContent className={styles.errorBody}>
      <span className={styles.errorIcon} aria-hidden="true">⚠️</span>
      <p className={styles.errorMessage}>{message}</p>
    </CardContent>
  </Card>
);

/* ---------- Page component ---------- */

export const DashboardPage: React.FC = () => {
  const [state, setState] = useState<AsyncState<DashboardResponse>>({
    status: 'loading',
  });

  useEffect(() => {
    let cancelled = false;

    fetchMockDashboard()
      .then((data) => {
        if (!cancelled) setState({ status: 'success', data });
      })
      .catch((err) => {
        if (!cancelled) setState({ status: 'error', error: String(err) });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /* ---- Loading ---- */
  if (state.status === 'loading' || state.status === 'idle') {
    return <DashboardSkeleton />;
  }

  /* ---- Error ---- */
  if (state.status === 'error') {
    return <DashboardError message={state.error} />;
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
        <StatsPanel stats={user} />
      </section>
    </div>
  );
};
