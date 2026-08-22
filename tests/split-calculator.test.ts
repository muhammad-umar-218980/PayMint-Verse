import { describe, expect, it } from 'vitest';
import {
  calculateEqualSplit,
  calculateCustomSplit,
  calculatePercentageSplit,
  calculateSharesSplit,
} from '../src/features/expenses/services/split-calculator';

describe('calculateEqualSplit', () => {
  it('splits evenly across members', () => {
    const splits = calculateEqualSplit(100, ['a', 'b', 'c']);
    expect(splits.splits).toEqual([
      { user_id: 'a', amount_owed: 33.33 },
      { user_id: 'b', amount_owed: 33.33 },
      { user_id: 'c', amount_owed: 33.34 },
    ]);
  });

  it('last person absorbs the rounding difference', () => {
    const splits = calculateEqualSplit(100, ['a', 'b', 'c']);
    const sum = splits.splits.reduce((acc, s) => acc + s.amount_owed, 0);
    expect(sum).toBeCloseTo(100, 2);
  });

  it('handles a single member (pays everything)', () => {
    const splits = calculateEqualSplit(42.5, ['a']);
    expect(splits.splits).toEqual([{ user_id: 'a', amount_owed: 42.5 }]);
  });

  it('returns an empty array when there are no members', () => {
    expect(calculateEqualSplit(100, [])).toEqual({ splits: [] });
  });
});

describe('calculateCustomSplit', () => {
  it('returns exact amounts when they sum to the total', () => {
    const result = calculateCustomSplit(30.3, [
      { user_id: 'a', amount: 10.1 },
      { user_id: 'b', amount: 20.2 },
    ]);
    expect(result.error).toBeUndefined();
    expect(result.splits).toEqual([
      { user_id: 'a', amount_owed: 10.1 },
      { user_id: 'b', amount_owed: 20.2 },
    ]);
  });

  it('errors when amounts do not sum to the total', () => {
    const result = calculateCustomSplit(100, [
      { user_id: 'a', amount: 40 },
      { user_id: 'b', amount: 40 },
    ]);
    expect(result.splits).toEqual([]);
    expect(result.error).toContain('sum to 80');
  });
});

describe('calculatePercentageSplit', () => {
  it('allocates amounts by percentage', () => {
    const result = calculatePercentageSplit(200, [
      { user_id: 'a', percentage: 50 },
      { user_id: 'b', percentage: 30 },
      { user_id: 'c', percentage: 20 },
    ]);
    expect(result.error).toBeUndefined();
    expect(result.splits).toEqual([
      { user_id: 'a', amount_owed: 100, percentage: 50 },
      { user_id: 'b', amount_owed: 60, percentage: 30 },
      { user_id: 'c', amount_owed: 40, percentage: 20 },
    ]);
  });

  it('errors when percentages do not sum to 100', () => {
    const result = calculatePercentageSplit(200, [
      { user_id: 'a', percentage: 60 },
      { user_id: 'b', percentage: 30 },
    ]);
    expect(result.splits).toEqual([]);
    expect(result.error).toContain('90%');
  });

  it('last person absorbs rounding on recurring percentages', () => {
    const result = calculatePercentageSplit(100, [
      { user_id: 'a', percentage: 33.33 },
      { user_id: 'b', percentage: 33.33 },
      { user_id: 'c', percentage: 33.34 },
    ]);
    const sum = result.splits.reduce((acc, s) => acc + s.amount_owed, 0);
    expect(sum).toBeCloseTo(100, 2);
  });
});

describe('calculateSharesSplit', () => {
  it('allocates proportionally to shares', () => {
    const result = calculateSharesSplit(4000, [
      { user_id: 'a', shares: 2 },
      { user_id: 'b', shares: 1 },
      { user_id: 'c', shares: 1 },
    ]);
    expect(result.error).toBeUndefined();
    expect(result.splits).toEqual([
      { user_id: 'a', amount_owed: 2000, shares: 2 },
      { user_id: 'b', amount_owed: 1000, shares: 1 },
      { user_id: 'c', amount_owed: 1000, shares: 1 },
    ]);
  });

  it('errors when total shares are zero', () => {
    const result = calculateSharesSplit(4000, [
      { user_id: 'a', shares: 0 },
      { user_id: 'b', shares: 0 },
    ]);
    expect(result.splits).toEqual([]);
    expect(result.error).toContain('greater than 0');
  });

  it('last person absorbs rounding on uneven shares', () => {
    const result = calculateSharesSplit(100, [
      { user_id: 'a', shares: 1 },
      { user_id: 'b', shares: 1 },
      { user_id: 'c', shares: 1 },
    ]);
    const sum = result.splits.reduce((acc, s) => acc + s.amount_owed, 0);
    expect(sum).toBeCloseTo(100, 2);
  });
});