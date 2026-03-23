import { apiFetch } from './client';
import type { MetricsResponse, MetricsQueryParams } from './types';

/**
 * Fetches metric time-series data for any /metrics/{category} endpoint.
 *
 * The category is dynamic (e.g. "inflation", "unemployment", "gdp") and
 * may expand — do not hardcode valid values in this layer.
 * Always supply start_date to limit the dataset size.
 */
export async function fetchMetrics(
  category: string,
  params?: MetricsQueryParams
): Promise<MetricsResponse> {
  return apiFetch<MetricsResponse>(`/metrics/${encodeURIComponent(category)}`, {
    start_date: params?.start_date,
    end_date: params?.end_date,
    series_id: params?.series_id,
  });
}
