import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { UiSettingsProvider } from './store/ui.store';
import { ThemeProvider } from './providers/ThemeProvider';
import { I18nProvider } from './providers/I18nProvider';

/**
 * Root application component.
 * Providers: UI store (theme, language + localStorage) -> Theme -> I18n -> Router.
 */
export const App: React.FC = () => (
  <UiSettingsProvider>
    <ThemeProvider>
      <I18nProvider>
        <RouterProvider router={router} />
      </I18nProvider>
    </ThemeProvider>
  </UiSettingsProvider>
);
