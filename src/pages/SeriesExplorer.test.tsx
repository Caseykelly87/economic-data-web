import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { render, screen, waitFor } from '@/test/utils';
import { server } from '@/test/server';
import { API_BASE_URL } from '@/api/client';
import { SeriesExplorer } from './SeriesExplorer';

describe('SeriesExplorer page', () => {
  it('shows loading spinner initially', () => {
    render(<SeriesExplorer />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders series rows after data loads', async () => {
    render(<SeriesExplorer />);
    await waitFor(() => {
      expect(screen.getByText('Consumer Price Index')).toBeInTheDocument();
      expect(screen.getByText('Unemployment Rate')).toBeInTheDocument();
    });
  });

  it('renders series IDs in code style', async () => {
    render(<SeriesExplorer />);
    await waitFor(() => {
      expect(screen.getByText('CPIAUCSL')).toBeInTheDocument();
    });
  });

  it('renders "View →" links for each series', async () => {
    render(<SeriesExplorer />);
    await waitFor(() => {
      const links = screen.getAllByRole('link', { name: /View chart for/ });
      expect(links.length).toBeGreaterThan(0);
    });
  });

  it('shows error message when fetch fails', async () => {
    server.use(
      http.get(`${API_BASE_URL}/series`, () =>
        HttpResponse.json({ detail: 'Error' }, { status: 500 })
      )
    );
    render(<SeriesExplorer />);
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('shows empty state when no series exist', async () => {
    server.use(
      http.get(`${API_BASE_URL}/series`, () =>
        HttpResponse.json({ total: 0, limit: 50, offset: 0, items: [] })
      )
    );
    render(<SeriesExplorer />);
    await waitFor(() => {
      expect(screen.getByText(/No data available/)).toBeInTheDocument();
    });
  });
});
