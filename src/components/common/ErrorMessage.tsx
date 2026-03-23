import styles from './ErrorMessage.module.css';

interface Props {
  title?: string;
  message: string;
  /** Optional action (e.g. a retry button) */
  action?: React.ReactNode;
}

/**
 * Inline error state used within page sections.
 * For full-page errors (degraded system) use SystemUnavailable instead.
 */
export function ErrorMessage({ title = 'Something went wrong', message, action }: Props) {
  return (
    <div className={styles.container} role="alert">
      <span className={styles.icon} aria-hidden="true">⚠</span>
      <div className={styles.content}>
        <p className={styles.title}>{title}</p>
        <p className={styles.message}>{message}</p>
        {action && <div className={styles.action}>{action}</div>}
      </div>
    </div>
  );
}
