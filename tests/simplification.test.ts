import { describe, expect, it } from 'vitest';
import { simplifyDebts } from '../src/features/balances/services/simplification';

describe('simplifyDebts', () => {
  it('returns an empty list when everyone is settled', () => {
    expect(simplifyDebts({ a: 0, b: 0 })).toEqual([]);
  });

  it('creates a single transaction for a direct debt', () => {
    expect(simplifyDebts({ a: -10, b: 10 })).toEqual([
      { from: 'a', to: 'b', amount: 10 },
    ]);
  });

  it('simplifies a chain: A owes B, B owes C becomes A owes C', () => {
    expect(simplifyDebts({ a: -10, b: 0, c: 10 })).toEqual([
      { from: 'a', to: 'c', amount: 10 },
    ]);
  });

  it('matches the biggest debtor with the biggest creditor', () => {
    expect(simplifyDebts({ a: -25, b: -25, c: 50 })).toEqual([
      { from: 'a', to: 'c', amount: 25 },
      { from: 'b', to: 'c', amount: 25 },
    ]);
  });

  it('splits a debt across multiple creditors (biggest creditor first)', () => {
    expect(simplifyDebts({ a: -30, b: 20, c: 10 })).toEqual([
      { from: 'a', to: 'b', amount: 20 },
      { from: 'a', to: 'c', amount: 10 },
    ]);
  });

  it('ignores amounts within the 0.01 rounding tolerance', () => {
    expect(simplifyDebts({ a: -0.009, b: 0.009 })).toEqual([]);
  });

  it('rounds transaction amounts to two decimals', () => {
    expect(simplifyDebts({ a: -0.3, b: 0.3 })).toEqual([
      { from: 'a', to: 'b', amount: 0.3 },
    ]);
  });

  it('handles a partial settle between unequal balances', () => {
    expect(simplifyDebts({ a: -40, b: 10, c: 30 })).toEqual([
      { from: 'a', to: 'c', amount: 30 },
      { from: 'a', to: 'b', amount: 10 },
    ]);
  });

  it('keeps the total debt intact after simplification', () => {
    const balances = { a: -33.33, b: -33.33, c: 66.66 };
    const transactions = simplifyDebts(balances);
    const moved = transactions.reduce((acc, t) => acc + t.amount, 0);
    expect(moved).toBeCloseTo(66.66, 2);
  });
});