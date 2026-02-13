import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import styles from './AppLayout.module.css';

export const AppLayout: React.FC = () => {
  return (
    <div className={styles.layout}>
      <Sidebar />

      <div className={styles.main}>
        <Topbar />

        <main className={styles.content} role="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
