import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { render, screen, waitFor } from '@/test/utils';
import { server } from '@/test/server';
import { API_BASE_URL } from '@/api/client';
import { Dashboard } from './Dashboard';

describe('Dashboard page', () => {
  it('shows a loading state initially', () => {
    render(<Dashboard />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders indicator cards after fetch', async () => {
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText('Consumer Price Index')).toBeInTheDocument();
    });
    expect(screen.getByText('Unemployment Rate')).toBeInTheDocument();
  });

  it('renders "No data" for null latest_value indicators', async () => {
    render(<Dashboard />);
    await waitFor(() => {
      // GDP in mock data has null latest_value
      const cards = screen.getAllByRole('article');
      const gdpCard = cards.find((c) => c.getAttribute('aria-label') === 'Gross Domestic Product');
      expect(gdpCard).toBeDefined();
      expect(gdpCard!.textContent).toContain('No data');
    });
  });

  it('shows error message when fetch fails', async () => {
    server.use(
      http.get(`${API_BASE_URL}/insights/summary`, () =>
        HttpResponse.json({ detail: 'Server error' }, { status: 500 })
      )
    );
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(/Could not load summary/)).toBeInTheDocument();
    });
  });

  it('shows empty state when indicators array is empty', async () => {
    server.use(
      http.get(`${API_BASE_URL}/insights/summary`, () =>
        HttpResponse.json({ indicators: [] })
      )
    );
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText(/No indicators/)).toBeInTheDocument();
    });
  });
});
