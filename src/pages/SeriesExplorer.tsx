import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSeriesList } from '@/hooks/useSeries';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { EmptyState } from '@/components/common/EmptyState';
import { hasNextPage, hasPrevPage, nextOffset, prevOffset, pageLabel } from '@/utils/pagination';
import styles from './SeriesExplorer.module.css';

const PAGE_SIZE = 50;

/**
 * Paginated browser for all available series.
 * Each row links to the detail view (/series/{id}).
 */
export function SeriesExplorer() {
  const [offset, setOffset] = useState(0);
  const { items, total, isLoading, isError, error } = useSeriesList({
    limit: PAGE_SIZE,
    offset,
  });

  const pagination = { limit: PAGE_SIZE, offset, total };

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h2 className={styles.title}>Series Explorer</h2>
        <p className={styles.subtitle}>
          Browse all available data series and open them for detailed chart views.
        </p>
      </header>

      {isLoading && (
        <div className={styles.centered}>
          <LoadingSpinner size="lg" label="Loading series list…" />
        </div>
      )}

      {isError && !isLoading && (
        <ErrorMessage
          title="Could not load series"
          message={error?.message ?? 'An error occurred.'}
        />
      )}

      {!isLoading && !isError && items.length === 0 && <EmptyState />}

      {!isLoading && !isError && items.length > 0 && (
        <>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Series ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">Source</th>
                  <th scope="col" aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.series_id}>
                    <td>
                      <code className={styles.seriesId}>{item.series_id}</code>
                    </td>
                    <td>{item.series_name}</td>
                    <td>
                      <span className={styles.sourceBadge}>{item.source}</span>
                    </td>
                    <td>
                      <Link
                        to={`/series/${encodeURIComponent(item.series_id)}`}
                        className={styles.viewLink}
                        aria-label={`View chart for ${item.series_name}`}
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <nav className={styles.pagination} aria-label="Series list pagination">
            <button
              className={styles.pageBtn}
              onClick={() => setOffset(prevOffset(pagination))}
              disabled={!hasPrevPage(pagination)}
              type="button"
            >
              ← Previous
            </button>
            <span className={styles.pageLabel}>{pageLabel(pagination)}</span>
            <button
              className={styles.pageBtn}
              onClick={() => setOffset(nextOffset(pagination))}
              disabled={!hasNextPage(pagination)}
              type="button"
            >
              Next →
            </button>
          </nav>
        </>
      )}
    </section>
  );
}
