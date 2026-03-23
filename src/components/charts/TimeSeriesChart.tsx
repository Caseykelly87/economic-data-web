import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  type TooltipProps,
} from 'recharts';
import type { Observation } from '@/api/types';
import { formatMonthYear, formatNumber } from '@/utils/formatters';
import { NULL_DISPLAY } from '@/utils/formatters';
import styles from './TimeSeriesChart.module.css';

interface ChartPoint {
  date: string;         // formatted for display
  isoDate: string;      // raw "YYYY-MM-DD" for tooltip key
  value: number | null;
}

interface Series {
  seriesId: string;
  seriesName: string;
  observations: Observation[];
}

interface Props {
  series: Series[];
  height?: number;
}

/** Palette cycles through these colors as new series are added */
const LINE_COLORS = ['#1a56db', '#059669', '#d97706', '#7c3aed', '#dc2626'];

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipDate}>{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className={styles.tooltipEntry}>
          <span className={styles.tooltipDot} style={{ background: entry.color }} />
          <span className={styles.tooltipLabel}>{entry.name}:</span>{' '}
          <span className={styles.tooltipValue}>
            {entry.value === null ? NULL_DISPLAY : formatNumber(entry.value as number)}
          </span>
        </p>
      ))}
    </div>
  );
}

/**
 * Renders one or more time-series lines from observation data.
 *
 * - Null values are rendered as gaps in the line (connectNulls=false).
 * - X-axis labels are formatted to "Mon YYYY".
 * - Designed to handle large datasets efficiently via Recharts' internal sampling.
 */
export function TimeSeriesChart({ series, height = 320 }: Props) {
  if (series.length === 0) return null;

  // Merge all series onto a shared date axis
  const dateIndex = new Map<string, ChartPoint>();
  series.forEach(({ observations }) => {
    observations.forEach(({ observation_date }) => {
      if (!dateIndex.has(observation_date)) {
        dateIndex.set(observation_date, {
          isoDate: observation_date,
          date: formatMonthYear(observation_date),
          value: null,
        });
      }
    });
  });

  // Build chart data: one row per date, one column per series
  type DataRow = { isoDate: string; date: string } & Record<string, number | null>;
  const data: DataRow[] = Array.from(dateIndex.values())
    .sort((a, b) => a.isoDate.localeCompare(b.isoDate))
    .map(({ isoDate, date }) => {
      const row: DataRow = { isoDate, date };
      series.forEach(({ seriesId, observations }) => {
        const obs = observations.find((o) => o.observation_date === isoDate);
        row[seriesId] = obs ? obs.value : null;
      });
      return row;
    });

  return (
    <div className={styles.wrapper} aria-label="Time series chart">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 4, right: 16, bottom: 4, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
            tickLine={false}
            axisLine={{ stroke: 'var(--color-border)' }}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => formatNumber(v, 1)}
            width={70}
          />
          <Tooltip content={<CustomTooltip />} />
          {series.length > 1 && <Legend />}
          {series.map(({ seriesId, seriesName }, idx) => (
            <Line
              key={seriesId}
              type="monotone"
              dataKey={seriesId}
              name={seriesName}
              stroke={LINE_COLORS[idx % LINE_COLORS.length]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              connectNulls={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
