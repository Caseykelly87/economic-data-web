import { apiFetch } from './client';
import type {
  SeriesListResponse,
  SeriesDetail,
  SeriesListParams,
  DateRangeParams,
} from './types';

/**
 * Fetches a paginated list of all available series.
 * Use for the Series Explorer table view.
 */
export async function fetchSeriesList(params?: SeriesListParams): Promise<SeriesListResponse> {
  return apiFetch<SeriesListResponse>('/series', {
    limit: params?.limit ?? 50,
    offset: params?.offset ?? 0,
  });
}

/**
 * Fetches time-series observations for a single series.
 * Always provide start_date — avoid loading the full observation history.
 */
export async function fetchSeriesById(
  seriesId: string,
  params?: DateRangeParams
): Promise<SeriesDetail> {
  return apiFetch<SeriesDetail>(`/series/${encodeURIComponent(seriesId)}`, {
    start_date: params?.start_date,
    end_date: params?.end_date,
  });
}
