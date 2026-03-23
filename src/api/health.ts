import { apiFetch } from './client';
import type { HealthResponse } from './types';

/**
 * Checks API and database availability.
 *
 * Returns the health response on 200.
 * Throws ApiError (server_error) on 503 — callers should block the UI and
 * surface an explicit degraded-system message.
 */
export async function fetchHealth(): Promise<HealthResponse> {
  return apiFetch<HealthResponse>('/health');
}
