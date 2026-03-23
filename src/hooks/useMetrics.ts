import { useQuery } from '@tanstack/react-query';
import { fetchMetrics } from '@/api/metrics';
import type { MetricsResponse, MetricsQueryParams } from '@/api/types';

/**
 * Fetches time-series data for a given /metrics/{category} endpoint.
 *
 * @param category - e.g. "inflation", "unemployment", "gdp"
 * @param params   - optional date range and series filter
 *
 * Always supply start_date to prevent loading the entire observation history.
 */
export function useMetrics(category: string, params?: MetricsQueryParams) {
  const query = useQuery<MetricsResponse, Error>({
    queryKey: ['metrics', category, params] as const,
    queryFn: () => fetchMetrics(category, params),
    enabled: Boolean(category),
    staleTime: 5 * 60 * 1000,
  });

  return {
    series: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isEmpty: !query.isLoading && (query.data?.length ?? 0) === 0,
  };
}
