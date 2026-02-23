import { createBrowserRouter, Navigate } from 'react-router-dom';
import { appRoutes } from './routes.app';
import { LearningPathPage } from '../../pages/app/LearningPath';
import { CultureMatchRushPage } from '../../pages/app/Game/CultureMatchRushPage';

/**
 * Application router.
 *
 * Route groups:
 *   /app/*    → authenticated app shell (AppLayout)
 *   /app/countries/:countryCode/learn → full-screen lesson page (no shell)
 *   /app/countries/:countryCode/game  → full-screen Culture Match Rush game (no shell)
 *   /         → redirect to /app/dashboard
 */
export const router = createBrowserRouter([
  /* Root redirect */
  {
    path: '/',
    element: <Navigate to="/app/dashboard" replace />,
  },

  /* Full-screen lesson roadmap (no sidebar/topbar) */
  {
    path: '/app/countries/:countryCode/learn',
    element: <LearningPathPage />,
  },

  /* Full-screen Culture Match Rush game */
  {
    path: '/app/countries/:countryCode/game',
    element: <CultureMatchRushPage />,
  },

  /* App routes (protected section) */
  ...appRoutes,
]);
