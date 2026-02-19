import { createBrowserRouter, Navigate } from 'react-router-dom';
import { appRoutes } from './routes.app';
import { LearningPathPage } from '../../pages/app/LearningPath';

/**
 * Application router.
 *
 * Route groups:
 *   /app/*    → authenticated app shell (AppLayout)
 *   /app/countries/:countryCode/learn → full-screen lesson page (no shell)
 *   /         → redirect to /app/dashboard
 *
 * Add more route groups here as features grow:
 *   - authRoutes  → /login, /register  (public)
 *   - adminRoutes → /admin/*           (admin-only)
 */
export const router = createBrowserRouter([
  /* Root redirect */
  {
    path: '/',
    element: <Navigate to="/app/dashboard" replace />,
  },

  /* Full-screen lesson roadmap (no sidebar/topbar) — more specific path first */
  {
    path: '/app/countries/:countryCode/learn',
    element: <LearningPathPage />,
  },

  /* App routes (protected section) */
  ...appRoutes,
]);
