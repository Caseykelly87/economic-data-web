import styles from './SystemUnavailable.module.css';

/**
 * Full-page blocker shown when /health returns 503.
 * Prevents interaction with stale or unavailable data.
 */
export function SystemUnavailable() {
  return (
    <div className={styles.page} role="alert" aria-live="assertive">
      <div className={styles.card}>
        <div className={styles.icon} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" width="48" height="48">
            <circle cx="12" cy="12" r="10" stroke="#dc2626" strokeWidth="1.5" />
            <path d="M12 7v5" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="16" r="1" fill="#dc2626" />
          </svg>
        </div>
        <h1 className={styles.heading}>System Unavailable</h1>
        <p className={styles.body}>
          The data service is currently unreachable. Our team has been notified.
          Please try again in a few minutes.
        </p>
        <button
          className={styles.retryBtn}
          onClick={() => window.location.reload()}
          type="button"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
