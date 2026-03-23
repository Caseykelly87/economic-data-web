import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMetrics } from '@/hooks/useMetrics';
import { TimeSeriesChart } from '@/components/charts/TimeSeriesChart';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { EmptyState } from '@/components/common/EmptyState';
import { formatFullDate, formatNumber } from '@/utils/formatters';
import styles from './Metrics.module.css';

/** Default lookback window: 2 years from today */
function defaultStartDate(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 2);
  return d.toISOString().slice(0, 10);
}

/**
 * Metrics detail page — renders time-series charts for a given category
 * (e.g. /metrics/inflation, /metrics/unemployment, /metrics/gdp).
 *
 * The category comes from the URL param so new endpoints require no code changes.
 */
export function Metrics() {
  const { category = '' } = useParams<{ category: string }>();
  const [startDate] = useState(defaultStartDate);

  const { series, isLoading, isError, error, isEmpty } = useMetrics(category, {
    start_date: startDate,
  });

  const displayTitle = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : 'Metrics';

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h2 className={styles.title}>{displayTitle}</h2>
        <p className={styles.subtitle}>
          Displaying the past 2 years of data. Use the Series Explorer for custom ranges.
        </p>
      </header>

      {isLoading && (
        <div className={styles.centered}>
          <LoadingSpinner size="lg" label={`Loading ${displayTitle} data…`} />
        </div>
      )}

      {isError && !isLoading && (
        <ErrorMessage
          title={`Could not load ${displayTitle}`}
          message={error?.message ?? 'An error occurred.'}
        />
      )}

      {!isLoading && !isError && isEmpty && (
        <EmptyState message={`No ${displayTitle.toLowerCase()} data available for this period.`} />
      )}

      {!isLoading && !isError && series.length > 0 && (
        <div className={styles.charts}>
          {series.map((s) => (
            <div key={s.series_id} className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <div>
                  <h3 className={styles.chartTitle}>{s.series_name}</h3>
                  <span className={styles.chartSource}>{s.source}</span>
                </div>
                <div className={styles.latestBadge}>
                  <span className={styles.latestLabel}>Latest</span>
                  <span className={styles.latestValue}>
                    {s.latest_value !== null
                      ? formatNumber(s.latest_value)
                      : 'No data'}
                  </span>
                  <span className={styles.latestDate}>
                    {formatFullDate(s.latest_date)}
                  </span>
                </div>
              </div>

              <TimeSeriesChart
                series={[
                  {
                    seriesId: s.series_id,
                    seriesName: s.series_name,
                    observations: s.observations,
                  },
                ]}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
