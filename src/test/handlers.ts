import { http, HttpResponse } from 'msw';
import { API_BASE_URL } from '@/api/client';

/**
 * Default MSW request handlers used across the test suite.
 * Individual tests may add or override handlers via server.use().
 */
export const handlers = [
  // Health check — healthy by default
  http.get(`${API_BASE_URL}/health`, () =>
    HttpResponse.json({ status: 'ok' }, { status: 200 })
  ),

  // Dashboard summary
  http.get(`${API_BASE_URL}/insights/summary`, () =>
    HttpResponse.json({
      indicators: [
        {
          series_id: 'CPIAUCSL',
          series_name: 'Consumer Price Index',
          source: 'BLS',
          latest_date: '2024-01-01',
          latest_value: 308.42,
        },
        {
          series_id: 'UNRATE',
          series_name: 'Unemployment Rate',
          source: 'BLS',
          latest_date: '2024-01-01',
          latest_value: 3.7,
        },
        {
          series_id: 'GDP',
          series_name: 'Gross Domestic Product',
          source: 'BEA',
          latest_date: '2024-01-01',
          latest_value: null,
        },
      ],
    })
  ),

  // Series list
  http.get(`${API_BASE_URL}/series`, () =>
    HttpResponse.json({
      total: 2,
      limit: 50,
      offset: 0,
      items: [
        { series_id: 'CPIAUCSL', series_name: 'Consumer Price Index', source: 'BLS' },
        { series_id: 'UNRATE', series_name: 'Unemployment Rate', source: 'BLS' },
      ],
    })
  ),

  // Single series
  http.get(`${API_BASE_URL}/series/:seriesId`, ({ params }) =>
    HttpResponse.json({
      series_id: params['seriesId'],
      series_name: 'Consumer Price Index',
      source: 'BLS',
      observations: [
        { observation_date: '2024-01-01', value: 308.42 },
        { observation_date: '2024-02-01', value: null },
      ],
    })
  ),

  // Metrics — handles /metrics/inflation, /metrics/unemployment, /metrics/gdp, etc.
  http.get(`${API_BASE_URL}/metrics/:category`, () =>
    HttpResponse.json([
      {
        series_id: 'CPIAUCSL',
        series_name: 'Consumer Price Index',
        source: 'BLS',
        latest_date: '2024-01-01',
        latest_value: 308.42,
        observations: [
          { observation_date: '2023-12-01', value: 306.75 },
          { observation_date: '2024-01-01', value: 308.42 },
        ],
      },
    ])
  ),
];
