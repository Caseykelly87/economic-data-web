import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useHealth } from '@/hooks/useHealth';
import { AppShell } from '@/components/layout/AppShell';
import { SystemUnavailable } from '@/components/common/SystemUnavailable';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Dashboard } from '@/pages/Dashboard';
import { Metrics } from '@/pages/Metrics';
import { SeriesExplorer } from '@/pages/SeriesExplorer';
import { SeriesDetail } from '@/pages/SeriesDetail';
import styles from './App.module.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 2 * 60 * 1000,
    },
  },
});

/**
 * Inner app component — placed inside QueryClientProvider so hooks work.
 * Performs the required health check before rendering any UI.
 */
function AppContent() {
  const { isLoading, isHealthy, isDegraded } = useHealth();

  if (isLoading) {
    return (
      <div className={styles.gateScreen}>
        <LoadingSpinner size="lg" label="Checking system status…" />
        <p className={styles.gateLabel}>Connecting…</p>
      </div>
    );
  }

  if (isDegraded) {
    return <SystemUnavailable />;
  }

  if (!isHealthy) return null;

  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Dashboard />} />
        <Route path="metrics/:category" element={<Metrics />} />
        <Route path="series" element={<SeriesExplorer />} />
        <Route path="series/:seriesId" element={<SeriesDetail />} />
        {/* Redirect any unknown paths back to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

/**
 * Root application component.
 * Provides routing and global data-fetching context.
 */
export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
