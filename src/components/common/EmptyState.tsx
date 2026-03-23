import styles from './EmptyState.module.css';

interface Props {
  message?: string;
}

/**
 * Neutral empty state displayed when a query returns no results.
 */
export function EmptyState({ message = 'No data available for the selected range.' }: Props) {
  return (
    <div className={styles.container} aria-live="polite">
      <p className={styles.message}>{message}</p>
    </div>
  );
}
