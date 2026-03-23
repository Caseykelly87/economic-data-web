/**
 * Centralized HTTP client for the Economic Data API.
 *
 * All requests flow through `apiFetch`, which:
 *   - Resolves the base URL from the environment (never hardcoded)
 *   - Attaches consistent headers
 *   - Normalizes error responses into typed ApiError instances
 *   - Strips unknown response fields to prevent type leakage
 */

// ---------------------------------------------------------------------------
// Base URL
// ---------------------------------------------------------------------------

/**
 * Resolved once at module load.
 * Vite exposes VITE_* vars via import.meta.env; falls back to localhost for dev.
 */
export const API_BASE_URL: string =
  (import.meta as { env?: Record<string, string> }).env?.VITE_API_BASE_URL ??
  'http://localhost:8000';

// ---------------------------------------------------------------------------
// Error types
// ---------------------------------------------------------------------------

export type ApiErrorCode = 'validation' | 'not_found' | 'server_error' | 'network' | 'unknown';

export class ApiError extends Error {
  constructor(
    public readonly code: ApiErrorCode,
    public readonly status: number | null,
    message: string,
    public readonly detail?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ---------------------------------------------------------------------------
// Core fetch wrapper
// ---------------------------------------------------------------------------

/**
 * Builds a URL from the base + path + optional query params object.
 */
function buildUrl(path: string, params?: Record<string, string | number | undefined>): string {
  const url = new URL(path, API_BASE_URL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
}

/**
 * Maps an HTTP status code to a typed error code.
 */
function resolveErrorCode(status: number): ApiErrorCode {
  if (status === 422) return 'validation';
  if (status === 404) return 'not_found';
  if (status >= 500) return 'server_error';
  return 'unknown';
}

/**
 * Performs a GET request and returns the parsed JSON body.
 *
 * @throws {ApiError} for any non-2xx response or network failure
 */
export async function apiFetch<T>(
  path: string,
  params?: Record<string, string | number | undefined>
): Promise<T> {
  const url = buildUrl(path, params);

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
  } catch (err) {
    throw new ApiError(
      'network',
      null,
      'Unable to reach the server. Check your connection.',
      err
    );
  }

  if (!response.ok) {
    let detail: unknown;
    try {
      const body = await response.json();
      detail = body?.detail;
    } catch {
      // response body may not be JSON
    }

    const code = resolveErrorCode(response.status);
    const message =
      typeof detail === 'string'
        ? detail
        : `Request failed with status ${response.status}`;

    throw new ApiError(code, response.status, message, detail);
  }

  return response.json() as Promise<T>;
}
