import { useDashboard } from '@/hooks/useDashboard';
import { SummaryCard } from '@/components/dashboard/SummaryCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { EmptyState } from '@/components/common/EmptyState';
import styles from './Dashboard.module.css';

/**
 * Executive dashboard — entry point for stakeholders.
 * Shows the latest value for every tracked economic indicator.
 * Data sourced from GET /insights/summary.
 */
export function Dashboard() {
  const { indicators, isLoading, isError, error } = useDashboard();

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h2 className={styles.title}>Economic Overview</h2>
        <p className={styles.subtitle}>
          Latest available values across key economic indicators.
        </p>
      </header>

      {isLoading && (
        <div className={styles.centered}>
          <LoadingSpinner size="lg" label="Loading indicators…" />
        </div>
      )}

      {isError && !isLoading && (
        <ErrorMessage
          title="Could not load summary"
          message={error?.message ?? 'An error occurred fetching indicator data.'}
        />
      )}

      {!isLoading && !isError && indicators.length === 0 && (
        <EmptyState message="No indicators are currently available." />
      )}

      {!isLoading && !isError && indicators.length > 0 && (
        <div className={styles.grid}>
          {indicators.map((indicator) => (
            <SummaryCard key={indicator.series_id} indicator={indicator} />
          ))}
        </div>
      )}
    </section>
  );
}
