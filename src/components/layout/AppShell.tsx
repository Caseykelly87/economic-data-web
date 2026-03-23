import { NavLink, Outlet } from 'react-router-dom';
import styles from './AppShell.module.css';

interface NavItem {
  to: string;
  label: string;
}

/**
 * Static nav items — add entries here as new sections are built.
 * Metric routes are listed explicitly rather than generated from API
 * so navigation remains predictable during the MVP phase.
 */
const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Dashboard' },
  { to: '/metrics/inflation', label: 'Inflation' },
  { to: '/metrics/unemployment', label: 'Unemployment' },
  { to: '/metrics/gdp', label: 'GDP' },
  { to: '/series', label: 'Series Explorer' },
];

/**
 * Persistent application shell: top header bar + sidebar nav + content area.
 * The <Outlet /> renders the active page route.
 */
export function AppShell() {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
            <rect width="32" height="32" rx="4" fill="var(--color-brand)" />
            <polyline
              points="4,24 10,14 16,18 22,8 28,12"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className={styles.brandName}>Economic Dashboard</span>
        </div>
        <span className={styles.tagline}>Executive Summary · MVP</span>
      </header>

      <div className={styles.body}>
        <nav className={styles.sidebar} aria-label="Main navigation">
          <ul className={styles.navList} role="list">
            {NAV_ITEMS.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <main className={styles.content} id="main-content">
          <div className={styles.contentInner}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
