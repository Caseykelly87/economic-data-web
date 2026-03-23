import type { IndicatorSummary } from '@/api/types';
import { formatNumber, formatMonthYear } from '@/utils/formatters';
import styles from './SummaryCard.module.css';

interface Props {
  indicator: IndicatorSummary;
}

/**
 * Displays the latest value and date for a single economic indicator.
 * Renders a "No data" state when latest_value is null — never coerces to 0.
 */
export function SummaryCard({ indicator }: Props) {
  const { series_name, source, latest_value, latest_date } = indicator;
  const hasValue = latest_value !== null;

  return (
    <article className={styles.card} aria-label={series_name}>
      <header className={styles.header}>
        <h3 className={styles.name}>{series_name}</h3>
        <span className={styles.source}>{source}</span>
      </header>

      <div className={styles.body}>
        <span className={hasValue ? styles.value : styles.nullValue}>
          {hasValue ? formatNumber(latest_value) : 'No data'}
        </span>
      </div>

      <footer className={styles.footer}>
        <time dateTime={latest_date} className={styles.date}>
          {formatMonthYear(latest_date)}
        </time>
      </footer>
    </article>
  );
}
