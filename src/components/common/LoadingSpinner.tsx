import styles from './LoadingSpinner.module.css';

interface Props {
  /** Accessible label for screen readers */
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Inline SVG spinner used during data fetch states.
 * Renders a visually hidden label for assistive technology.
 */
export function LoadingSpinner({ label = 'Loading…', size = 'md' }: Props) {
  return (
    <span className={`${styles.wrapper} ${styles[size]}`} role="status" aria-label={label}>
      <svg
        className={styles.svg}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <circle
          className={styles.track}
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path
          className={styles.arc}
          d="M12 2a10 10 0 0 1 10 10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
