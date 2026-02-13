import { createBrowserRouter, Navigate } from 'react-router-dom';
import { appRoutes } from './routes.app';

/**
 * Application router.
 *
 * Route groups:
 *   /app/*    → authenticated app shell (AppLayout)
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

  /* App routes (protected section) */
  ...appRoutes,
]);
