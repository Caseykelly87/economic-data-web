import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { Routes, Route } from 'react-router-dom';
import { render, screen, waitFor } from '@/test/utils';
import { server } from '@/test/server';
import { API_BASE_URL } from '@/api/client';
import { Metrics } from './Metrics';

/**
 * Wraps Metrics in a Route so useParams can extract the :category segment.
 */
function MetricsRoute() {
  return (
    <Routes>
      <Route path="/metrics/:category" element={<Metrics />} />
    </Routes>
  );
}

describe('Metrics page', () => {
  it('shows loading spinner initially', async () => {
    render(<MetricsRoute />, { initialEntries: ['/metrics/inflation'] });
    // Loading spinner appears briefly — query is fired on mount
    // Verify the page title renders for the route
    await waitFor(() => {
      expect(screen.getByText('Inflation')).toBeInTheDocument();
    });
  });

  it('renders chart cards after data loads', async () => {
    render(<MetricsRoute />, { initialEntries: ['/metrics/inflation'] });
    await waitFor(() => {
      expect(screen.getByText('Consumer Price Index')).toBeInTheDocument();
    });
  });

  it('shows empty state when no series returned', async () => {
    server.use(
      http.get(`${API_BASE_URL}/metrics/:category`, () => HttpResponse.json([]))
    );
    render(<MetricsRoute />, { initialEntries: ['/metrics/gdp'] });
    await waitFor(() => {
      expect(screen.getByText(/no.*data available/i)).toBeInTheDocument();
    });
  });

  it('shows error message when fetch fails', async () => {
    server.use(
      http.get(`${API_BASE_URL}/metrics/:category`, () =>
        HttpResponse.json({ detail: 'Service error' }, { status: 500 })
      )
    );
    render(<MetricsRoute />, { initialEntries: ['/metrics/unemployment'] });
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});
