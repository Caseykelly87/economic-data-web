import { setupServer } from 'msw/node';
import { handlers } from './handlers';

/**
 * Mock Service Worker node server used in unit/integration tests.
 * All API requests are intercepted so tests never hit a real network.
 */
export const server = setupServer(...handlers);
