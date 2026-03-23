/**
 * Display formatting utilities for dates and numbers.
 *
 * Dates come from the API as "YYYY-MM-DD" strings and are formatted
 * into human-readable text for the UI (e.g. "Jan 2024").
 *
 * Numbers may be null — all formatters handle null explicitly and
 * return a "No data" placeholder rather than treating null as zero.
 */

const NULL_DISPLAY = 'No data';

// ---------------------------------------------------------------------------
// Dates
// ---------------------------------------------------------------------------

/**
 * Converts "YYYY-MM-DD" to a short month-year label like "Jan 2024".
 * The day component is ignored — used for chart axis labels and cards.
 */
export function formatMonthYear(isoDate: string): string {
  // Append T00:00:00 to force UTC interpretation and avoid day-boundary shifts
  const date = new Date(`${isoDate}T00:00:00Z`);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/**
 * Converts "YYYY-MM-DD" to a full readable date like "January 1, 2024".
 */
export function formatFullDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

// ---------------------------------------------------------------------------
// Numbers
// ---------------------------------------------------------------------------

/**
 * Formats a number with thousands separators and fixed decimal precision.
 * Returns NULL_DISPLAY when value is null.
 *
 * @param value - The numeric value or null
 * @param decimals - Decimal places (default 2)
 */
export function formatNumber(value: number | null, decimals = 2): string {
  if (value === null) return NULL_DISPLAY;
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Formats a percentage value with a "%" suffix.
 * Returns NULL_DISPLAY when value is null.
 */
export function formatPercent(value: number | null, decimals = 2): string {
  if (value === null) return NULL_DISPLAY;
  return `${formatNumber(value, decimals)}%`;
}

/**
 * Compact formatter for large numbers (e.g. GDP in billions).
 * Values ≥ 1 trillion → "X.XXt", ≥ 1 billion → "X.XXb", ≥ 1 million → "X.XXm".
 * Smaller values fall through to formatNumber.
 */
export function formatCompact(value: number | null, decimals = 2): string {
  if (value === null) return NULL_DISPLAY;
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000_000) return `${formatNumber(value / 1_000_000_000_000, decimals)}t`;
  if (abs >= 1_000_000_000) return `${formatNumber(value / 1_000_000_000, decimals)}b`;
  if (abs >= 1_000_000) return `${formatNumber(value / 1_000_000, decimals)}m`;
  return formatNumber(value, decimals);
}

export { NULL_DISPLAY };
