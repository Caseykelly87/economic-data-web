import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import { SummaryCard } from './SummaryCard';
import type { IndicatorSummary } from '@/api/types';

const base: IndicatorSummary = {
  series_id: 'CPIAUCSL',
  series_name: 'Consumer Price Index',
  source: 'BLS',
  latest_date: '2024-01-01',
  latest_value: 308.42,
};

describe('SummaryCard', () => {
  it('renders the series name', () => {
    render(<SummaryCard indicator={base} />);
    expect(screen.getByText('Consumer Price Index')).toBeInTheDocument();
  });

  it('renders the source label', () => {
    render(<SummaryCard indicator={base} />);
    expect(screen.getByText('BLS')).toBeInTheDocument();
  });

  it('renders the formatted value', () => {
    render(<SummaryCard indicator={base} />);
    expect(screen.getByText('308.42')).toBeInTheDocument();
  });

  it('renders "No data" when latest_value is null', () => {
    render(<SummaryCard indicator={{ ...base, latest_value: null }} />);
    expect(screen.getByText('No data')).toBeInTheDocument();
    expect(screen.queryByText('308.42')).not.toBeInTheDocument();
  });

  it('renders a formatted date in the footer', () => {
    render(<SummaryCard indicator={base} />);
    expect(screen.getByText('Jan 2024')).toBeInTheDocument();
  });

  it('has accessible article label matching series name', () => {
    render(<SummaryCard indicator={base} />);
    expect(screen.getByRole('article', { name: 'Consumer Price Index' })).toBeInTheDocument();
  });
});
