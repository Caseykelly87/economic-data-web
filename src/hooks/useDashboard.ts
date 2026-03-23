import { useQuery } from '@tanstack/react-query';
import { fetchInsightsSummary } from '@/api/insights';
import type { InsightsSummaryResponse } from '@/api/types';

const SUMMARY_QUERY_KEY = ['insights', 'summary'] as const;

/**
 * Fetches the dashboard summary indicators from /insights/summary.
 * This is the primary data source for the top-level dashboard cards.
 */
export function useDashboard() {
  const query = useQuery<InsightsSummaryResponse, Error>({
    queryKey: SUMMARY_QUERY_KEY,
    queryFn: fetchInsightsSummary,
    staleTime: 5 * 60 * 1000, // treat data as fresh for 5 minutes
  });

  return {
    indicators: query.data?.indicators ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
