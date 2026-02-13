import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

/**
 * Root application component.
 * Mounts the router which owns all layout + page rendering.
 */
export const App: React.FC = () => <RouterProvider router={router} />;
