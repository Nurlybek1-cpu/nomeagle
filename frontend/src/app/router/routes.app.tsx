import { Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { DashboardPage } from '../../pages/app/Dashboard';
import { LeaderboardPage } from '../../pages/app/Leaderboard';
import { MapExplorerPage } from '../../pages/app/MapExplorer';
import { SearchCountriesPage } from '../../pages/app/SearchCountries';

/**
 * Routes nested under /app — protected section of the application.
 *
 * Structure:
 *   /app              → redirect to /app/dashboard
 *   /app/dashboard    → DashboardPage
 *   /app/map          → MapExplorerPage (world map)
 *   /app/search       → SearchCountriesPage
 *   /app/leaderboard  → LeaderboardPage
 *
 * All children render inside AppLayout's <Outlet />.
 * When auth is added later, wrap `element` with a <ProtectedRoute> guard:
 *   element: <ProtectedRoute><AppLayout /></ProtectedRoute>
 */
export const appRoutes: RouteObject[] = [
  {
    path: '/app',
    element: <AppLayout />,
    children: [
      /* /app → redirect to dashboard */
      { index: true, element: <Navigate to="dashboard" replace /> },

      /* /app/dashboard */
      { path: 'dashboard', element: <DashboardPage /> },

      /* /app/map — Map Explorer (world map) */
      { path: 'map', element: <MapExplorerPage /> },

      /* /app/search — Search Countries (catalog) */
      { path: 'search', element: <SearchCountriesPage /> },

      /* /app/leaderboard — Leaderboard */
      { path: 'leaderboard', element: <LeaderboardPage /> },
    ],
  },
];
