import { describe, it, expect } from 'vitest';
import { hasNextPage, hasPrevPage, nextOffset, prevOffset, pageLabel } from './pagination';

const base = { limit: 10, total: 35 };

describe('hasNextPage', () => {
  it('returns true when more items exist beyond the current window', () => {
    expect(hasNextPage({ ...base, offset: 0 })).toBe(true);
    expect(hasNextPage({ ...base, offset: 20 })).toBe(true);
  });

  it('returns false when on or past the last page', () => {
    expect(hasNextPage({ ...base, offset: 30 })).toBe(false);
    expect(hasNextPage({ ...base, offset: 35 })).toBe(false);
  });

  it('returns false when total is 0', () => {
    expect(hasNextPage({ limit: 10, offset: 0, total: 0 })).toBe(false);
  });
});

describe('hasPrevPage', () => {
  it('returns false on the first page', () => {
    expect(hasPrevPage({ ...base, offset: 0 })).toBe(false);
  });

  it('returns true when offset is greater than 0', () => {
    expect(hasPrevPage({ ...base, offset: 10 })).toBe(true);
  });
});

describe('nextOffset', () => {
  it('increments offset by limit', () => {
    expect(nextOffset({ ...base, offset: 0 })).toBe(10);
    expect(nextOffset({ ...base, offset: 10 })).toBe(20);
  });
});

describe('prevOffset', () => {
  it('decrements offset by limit', () => {
    expect(prevOffset({ ...base, offset: 20 })).toBe(10);
  });

  it('clamps to 0 to avoid negative offsets', () => {
    expect(prevOffset({ ...base, offset: 5 })).toBe(0);
  });
});

describe('pageLabel', () => {
  it('returns "No results" when total is 0', () => {
    expect(pageLabel({ limit: 10, offset: 0, total: 0 })).toBe('No results');
  });

  it('returns "Page 1 of 4" for first page of 35 items at 10 per page', () => {
    expect(pageLabel({ ...base, offset: 0 })).toBe('Page 1 of 4');
  });

  it('returns correct page for last page', () => {
    expect(pageLabel({ ...base, offset: 30 })).toBe('Page 4 of 4');
  });
});
