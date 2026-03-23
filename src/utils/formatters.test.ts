import { describe, it, expect } from 'vitest';
import {
  formatMonthYear,
  formatFullDate,
  formatNumber,
  formatPercent,
  formatCompact,
  NULL_DISPLAY,
} from './formatters';

describe('formatMonthYear', () => {
  it('formats an ISO date to "Mon YYYY"', () => {
    expect(formatMonthYear('2024-01-15')).toBe('Jan 2024');
    expect(formatMonthYear('2024-12-01')).toBe('Dec 2024');
  });

  it('is consistent regardless of day value', () => {
    expect(formatMonthYear('2024-06-01')).toBe(formatMonthYear('2024-06-30'));
  });
});

describe('formatFullDate', () => {
  it('formats an ISO date to full readable form', () => {
    expect(formatFullDate('2024-01-01')).toBe('January 1, 2024');
    expect(formatFullDate('2024-03-15')).toBe('March 15, 2024');
  });
});

describe('formatNumber', () => {
  it('returns NULL_DISPLAY for null', () => {
    expect(formatNumber(null)).toBe(NULL_DISPLAY);
  });

  it('formats with 2 decimal places by default', () => {
    expect(formatNumber(1234.5)).toBe('1,234.50');
  });

  it('respects custom decimal count', () => {
    expect(formatNumber(1234.5678, 3)).toBe('1,234.568');
  });

  it('adds thousand separators', () => {
    expect(formatNumber(1000000)).toBe('1,000,000.00');
  });

  it('handles zero correctly (does not treat as null)', () => {
    expect(formatNumber(0)).toBe('0.00');
  });
});

describe('formatPercent', () => {
  it('returns NULL_DISPLAY for null', () => {
    expect(formatPercent(null)).toBe(NULL_DISPLAY);
  });

  it('appends % to the formatted number', () => {
    expect(formatPercent(3.7)).toBe('3.70%');
  });
});

describe('formatCompact', () => {
  it('returns NULL_DISPLAY for null', () => {
    expect(formatCompact(null)).toBe(NULL_DISPLAY);
  });

  it('formats trillions with "t" suffix', () => {
    expect(formatCompact(27_360_000_000_000)).toBe('27.36t');
  });

  it('formats billions with "b" suffix', () => {
    expect(formatCompact(28_000_000_000)).toBe('28.00b');
  });

  it('formats millions with "m" suffix', () => {
    expect(formatCompact(5_500_000)).toBe('5.50m');
  });

  it('passes through smaller values unchanged', () => {
    expect(formatCompact(3.7)).toBe('3.70');
  });
});
