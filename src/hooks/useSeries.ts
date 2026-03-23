import { useQuery } from '@tanstack/react-query';
import { fetchSeriesList, fetchSeriesById } from '@/api/series';
import type { SeriesListParams, DateRangeParams } from '@/api/types';

/**
 * Fetches the paginated list of all series for the Explorer view.
 */
export function useSeriesList(params?: SeriesListParams) {
  const query = useQuery({
    queryKey: ['series', 'list', params] as const,
    queryFn: () => fetchSeriesList(params),
    staleTime: 5 * 60 * 1000,
  });

  return {
    data: query.data,
    items: query.data?.items ?? [],
    total: query.data?.total ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

/**
 * Fetches detailed observation data for a single series.
 * Pass enabled=false to defer fetching until an ID is available.
 */
export function useSeriesDetail(seriesId: string | undefined, params?: DateRangeParams) {
  const query = useQuery({
    queryKey: ['series', 'detail', seriesId, params] as const,
    queryFn: () => fetchSeriesById(seriesId!, params),
    enabled: Boolean(seriesId),
    staleTime: 5 * 60 * 1000,
  });

  return {
    series: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isEmpty: !query.isLoading && (query.data?.observations?.length ?? 0) === 0,
  };
}
