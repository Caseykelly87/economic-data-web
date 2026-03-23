import { useQuery } from '@tanstack/react-query';
import { fetchHealth } from '@/api/health';
import type { HealthResponse } from '@/api/types';

const HEALTH_QUERY_KEY = ['health'] as const;

/**
 * Polls the /health endpoint and exposes system availability state.
 *
 * The hook retries on failure using react-query defaults but does NOT
 * retry on 503 — a degraded database should surface immediately.
 */
export function useHealth() {
  const query = useQuery<HealthResponse, Error>({
    queryKey: HEALTH_QUERY_KEY,
    queryFn: fetchHealth,
    // Poll every 30 seconds so the UI reflects status changes in near-real-time
    refetchInterval: 30_000,
    retry: (failureCount, error) => {
      // Immediate surface for server errors — no retry
      if ('status' in error && (error as { status: number }).status >= 500) return false;
      return failureCount < 2;
    },
  });

  return {
    isLoading: query.isLoading,
    isHealthy: query.isSuccess && query.data?.status === 'ok',
    isDegraded: query.isError || (query.isSuccess && query.data?.status !== 'ok'),
    error: query.error,
  };
}
