import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/server';
import { API_BASE_URL } from './client';
import { fetchHealth } from './health';
import { fetchInsightsSummary } from './insights';
import { fetchSeriesList, fetchSeriesById } from './series';
import { fetchMetrics } from './metrics';

// ---------------------------------------------------------------------------
// Health
// ---------------------------------------------------------------------------

describe('fetchHealth', () => {
  it('resolves with health data on 200', async () => {
    const data = await fetchHealth();
    expect(data).toHaveProperty('status');
  });

  it('throws ApiError on 503', async () => {
    server.use(
      http.get(`${API_BASE_URL}/health`, () =>
        HttpResponse.json({ detail: 'DB unavailable' }, { status: 503 })
      )
    );
    await expect(fetchHealth()).rejects.toMatchObject({ code: 'server_error', status: 503 });
  });
});

// ---------------------------------------------------------------------------
// Insights / Summary
// ---------------------------------------------------------------------------

describe('fetchInsightsSummary', () => {
  it('returns indicators array', async () => {
    const data = await fetchInsightsSummary();
    expect(Array.isArray(data.indicators)).toBe(true);
    expect(data.indicators.length).toBeGreaterThan(0);
  });

  it('handles indicators with null latest_value', async () => {
    const data = await fetchInsightsSummary();
    const nullIndicator = data.indicators.find((i) => i.latest_value === null);
    expect(nullIndicator).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// Series list
// ---------------------------------------------------------------------------

describe('fetchSeriesList', () => {
  it('returns paginated list structure', async () => {
    const data = await fetchSeriesList();
    expect(data).toHaveProperty('total');
    expect(data).toHaveProperty('items');
    expect(Array.isArray(data.items)).toBe(true);
  });

  it('passes limit and offset as query params', async () => {
    let receivedUrl = '';
    server.use(
      http.get(`${API_BASE_URL}/series`, ({ request }) => {
        receivedUrl = request.url;
        return HttpResponse.json({ total: 0, limit: 5, offset: 10, items: [] });
      })
    );

    await fetchSeriesList({ limit: 5, offset: 10 });
    const url = new URL(receivedUrl);
    expect(url.searchParams.get('limit')).toBe('5');
    expect(url.searchParams.get('offset')).toBe('10');
  });
});

// ---------------------------------------------------------------------------
// Series detail
// ---------------------------------------------------------------------------

describe('fetchSeriesById', () => {
  it('fetches a single series with observations', async () => {
    const data = await fetchSeriesById('CPIAUCSL');
    expect(data.series_id).toBe('CPIAUCSL');
    expect(Array.isArray(data.observations)).toBe(true);
  });

  it('passes start_date as a query param when provided', async () => {
    let receivedUrl = '';
    server.use(
      http.get(`${API_BASE_URL}/series/CPIAUCSL`, ({ request }) => {
        receivedUrl = request.url;
        return HttpResponse.json({
          series_id: 'CPIAUCSL',
          series_name: 'CPI',
          source: 'BLS',
          observations: [],
        });
      })
    );

    await fetchSeriesById('CPIAUCSL', { start_date: '2023-01-01' });
    const url = new URL(receivedUrl);
    expect(url.searchParams.get('start_date')).toBe('2023-01-01');
  });
});

// ---------------------------------------------------------------------------
// Metrics
// ---------------------------------------------------------------------------

describe('fetchMetrics', () => {
  it('returns an array of metric series', async () => {
    const data = await fetchMetrics('inflation');
    expect(Array.isArray(data)).toBe(true);
    expect(data[0]).toHaveProperty('observations');
  });

  it('encodes the category in the URL path', async () => {
    let receivedUrl = '';
    server.use(
      http.get(`${API_BASE_URL}/metrics/unemployment`, ({ request }) => {
        receivedUrl = request.url;
        return HttpResponse.json([]);
      })
    );

    await fetchMetrics('unemployment');
    expect(receivedUrl).toContain('/metrics/unemployment');
  });
});
