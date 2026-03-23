import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSeriesDetail } from '@/hooks/useSeries';
import { TimeSeriesChart } from '@/components/charts/TimeSeriesChart';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { EmptyState } from '@/components/common/EmptyState';
import styles from './SeriesDetail.module.css';

/** Default lookback: 5 years */
function defaultStartDate(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 5);
  return d.toISOString().slice(0, 10);
}

/**
 * Detailed chart view for a single series.
 * Accessed via /series/{seriesId}.
 */
export function SeriesDetail() {
  const { seriesId } = useParams<{ seriesId: string }>();
  const [startDate] = useState(defaultStartDate);

  const { series, isLoading, isError, error, isEmpty } = useSeriesDetail(seriesId, {
    start_date: startDate,
  });

  return (
    <section className={styles.page}>
      <Link to="/series" className={styles.backLink}>
        ← Back to Series Explorer
      </Link>

      {isLoading && (
        <div className={styles.centered}>
          <LoadingSpinner size="lg" label="Loading series data…" />
        </div>
      )}

      {isError && !isLoading && (
        <ErrorMessage
          title="Could not load series"
          message={error?.message ?? 'An error occurred.'}
        />
      )}

      {series && !isLoading && (
        <>
          <header className={styles.header}>
            <h2 className={styles.title}>{series.series_name}</h2>
            <span className={styles.meta}>
              <code className={styles.id}>{series.series_id}</code>
              <span className={styles.source}>{series.source}</span>
            </span>
          </header>

          {isEmpty ? (
            <EmptyState message="No observations found for the selected date range." />
          ) : (
            <div className={styles.chartCard}>
              <TimeSeriesChart
                series={[
                  {
                    seriesId: series.series_id,
                    seriesName: series.series_name,
                    observations: series.observations,
                  },
                ]}
                height={400}
              />
            </div>
          )}
        </>
      )}
    </section>
  );
}
