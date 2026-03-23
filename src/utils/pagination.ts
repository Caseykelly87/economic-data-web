import type { PaginationState } from '@/api/types';

/**
 * Derives whether a next page exists given the current pagination state.
 */
export function hasNextPage({ offset, limit, total }: PaginationState): boolean {
  return offset + limit < total;
}

/**
 * Derives whether a previous page exists.
 */
export function hasPrevPage({ offset }: PaginationState): boolean {
  return offset > 0;
}

/**
 * Returns the offset for the next page.
 * Caller should guard with hasNextPage before using.
 */
export function nextOffset({ offset, limit }: PaginationState): number {
  return offset + limit;
}

/**
 * Returns the offset for the previous page.
 * Caller should guard with hasPrevPage before using.
 */
export function prevOffset({ offset, limit }: PaginationState): number {
  return Math.max(0, offset - limit);
}

/**
 * Returns a 1-based "Page X of Y" label for display purposes.
 */
export function pageLabel({ offset, limit, total }: PaginationState): string {
  if (total === 0) return 'No results';
  const current = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);
  return `Page ${current} of ${totalPages}`;
}
