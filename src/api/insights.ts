import { apiFetch } from './client';
import type { InsightsSummaryResponse } from './types';

/**
 * Fetches the dashboard summary — latest value for each tracked indicator.
 * Maps to the /insights/summary dashboard cards view.
 */
export async function fetchInsightsSummary(): Promise<InsightsSummaryResponse> {
  return apiFetch<InsightsSummaryResponse>('/insights/summary');
}
