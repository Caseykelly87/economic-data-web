import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { EmptyState } from './EmptyState';
import { SystemUnavailable } from './SystemUnavailable';
import { ErrorBoundary } from './ErrorBoundary';

describe('LoadingSpinner', () => {
  it('renders with default label', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByLabelText('Loading…')).toBeInTheDocument();
  });

  it('renders with custom label', () => {
    render(<LoadingSpinner label="Fetching data…" />);
    expect(screen.getByLabelText('Fetching data…')).toBeInTheDocument();
  });
});

describe('ErrorMessage', () => {
  it('renders title and message', () => {
    render(<ErrorMessage message="Something failed" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Something failed')).toBeInTheDocument();
  });

  it('renders custom title', () => {
    render(<ErrorMessage title="Custom error" message="Details here" />);
    expect(screen.getByText('Custom error')).toBeInTheDocument();
  });

  it('renders action slot when provided', () => {
    render(<ErrorMessage message="Error" action={<button>Retry</button>} />);
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });
});

describe('EmptyState', () => {
  it('renders default message', () => {
    render(<EmptyState />);
    expect(screen.getByText(/No data available/)).toBeInTheDocument();
  });

  it('renders custom message', () => {
    render(<EmptyState message="Nothing to see here" />);
    expect(screen.getByText('Nothing to see here')).toBeInTheDocument();
  });
});

describe('SystemUnavailable', () => {
  it('renders heading and retry button', () => {
    render(<SystemUnavailable />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('System Unavailable')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });
});

// Helper: component that throws on render
function BrokenComponent() {
  throw new Error('Render explosion');
}

describe('ErrorBoundary', () => {
  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <p>Safe content</p>
      </ErrorBoundary>
    );
    expect(screen.getByText('Safe content')).toBeInTheDocument();
  });

  it('renders error UI when child throws', () => {
    // Suppress console.error from the intentional throw
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText('Unexpected error')).toBeInTheDocument();
    spy.mockRestore();
  });
});
