/**
 * Shared data types matching the Economic Data API contract.
 *
 * Rules enforced here:
 * - Dates are always "YYYY-MM-DD" strings (formatted in the UI layer).
 * - Numeric values may be null — never coerce null to 0.
 * - Unknown extra fields on response objects are intentionally ignored
 *   to support backwards-compatible API expansion.
 */

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

export type ISODateString = string; // "YYYY-MM-DD"

// ---------------------------------------------------------------------------
// Health
// ---------------------------------------------------------------------------

export type HealthStatus = 'ok' | 'degraded';

export interface HealthResponse {
  status: HealthStatus;
}

// ---------------------------------------------------------------------------
// Series
// ---------------------------------------------------------------------------

export interface SeriesSummary {
  series_id: string;
  series_name: string;
  source: string;
}

export interface SeriesListResponse {
  total: number;
  limit: number;
  offset: number;
  items: SeriesSummary[];
}

export interface Observation {
  observation_date: ISODateString;
  value: number | null;
}

export interface SeriesDetail extends SeriesSummary {
  observations: Observation[];
}

// ---------------------------------------------------------------------------
// Metrics
// ---------------------------------------------------------------------------

export interface MetricSeries extends SeriesSummary {
  latest_date: ISODateString;
  latest_value: number | null;
  observations: Observation[];
}

export type MetricsResponse = MetricSeries[];

// ---------------------------------------------------------------------------
// Dashboard / Insights
// ---------------------------------------------------------------------------

export interface IndicatorSummary extends SeriesSummary {
  latest_date: ISODateString;
  latest_value: number | null;
}

export interface InsightsSummaryResponse {
  indicators: IndicatorSummary[];
}

// ---------------------------------------------------------------------------
// Query params
// ---------------------------------------------------------------------------

export interface DateRangeParams {
  start_date?: ISODateString;
  end_date?: ISODateString;
}

export interface MetricsQueryParams extends DateRangeParams {
  series_id?: string;
}

export interface SeriesListParams {
  limit?: number;
  offset?: number;
}

// ---------------------------------------------------------------------------
// Pagination helpers
// ---------------------------------------------------------------------------

export interface PaginationState {
  limit: number;
  offset: number;
  total: number;
}
