/**
 * Split Calculator — Pure math functions for expense splitting.
 * No database calls. No side effects.
 */

export interface SplitResult {
  user_id: string;
  amount_owed: number;
  percentage?: number;
  shares?: number;
}

/**
 * Equal Split: Divide total evenly. Last person absorbs rounding difference.
 */
export function calculateEqualSplit(
  totalAmount: number,
  memberIds: string[]
): SplitResult[] {
  if (memberIds.length === 0) return [];

  const perPerson = Math.floor((totalAmount / memberIds.length) * 100) / 100;
  const splits: SplitResult[] = memberIds.map((userId) => ({
    user_id: userId,
    amount_owed: perPerson,
  }));

  // Fix rounding: last person absorbs the difference
  const distributed = perPerson * memberIds.length;
  const diff = Math.round((totalAmount - distributed) * 100) / 100;
  if (diff !== 0 && splits.length > 0) {
    splits[splits.length - 1].amount_owed =
      Math.round((splits[splits.length - 1].amount_owed + diff) * 100) / 100;
  }

  return splits;
}

/**
 * Custom Split: Exact amounts per user. Validates that amounts sum to total.
 */
export function calculateCustomSplit(
  totalAmount: number,
  customAmounts: { user_id: string; amount: number }[]
): { splits: SplitResult[]; error?: string } {
  const sum = customAmounts.reduce((acc, c) => acc + c.amount, 0);
  const roundedSum = Math.round(sum * 100) / 100;
  const roundedTotal = Math.round(totalAmount * 100) / 100;

  if (roundedSum !== roundedTotal) {
    return {
      splits: [],
      error: `Custom amounts sum to ${roundedSum} but total is ${roundedTotal}`,
    };
  }

  return {
    splits: customAmounts.map((c) => ({
      user_id: c.user_id,
      amount_owed: Math.round(c.amount * 100) / 100,
    })),
  };
}

/**
 * Percentage Split: Each user pays a percentage. Must sum to 100%.
 */
export function calculatePercentageSplit(
  totalAmount: number,
  percentages: { user_id: string; percentage: number }[]
): { splits: SplitResult[]; error?: string } {
  const totalPct = percentages.reduce((acc, p) => acc + p.percentage, 0);
  const roundedPct = Math.round(totalPct * 100) / 100;

  if (roundedPct !== 100) {
    return {
      splits: [],
      error: `Percentages sum to ${roundedPct}% instead of 100%`,
    };
  }

  const splits: SplitResult[] = percentages.map((p) => ({
    user_id: p.user_id,
    amount_owed: Math.round((totalAmount * p.percentage) / 100 * 100) / 100,
    percentage: p.percentage,
  }));

  // Fix rounding on last person
  const distributed = splits.reduce((acc, s) => acc + s.amount_owed, 0);
  const diff = Math.round((totalAmount - distributed) * 100) / 100;
  if (diff !== 0 && splits.length > 0) {
    splits[splits.length - 1].amount_owed =
      Math.round((splits[splits.length - 1].amount_owed + diff) * 100) / 100;
  }

  return { splits };
}

/**
 * Shares Split: Proportional based on assigned shares.
 * e.g., shares [2, 1, 1] on Rs.4000 → [2000, 1000, 1000]
 */
export function calculateSharesSplit(
  totalAmount: number,
  shareData: { user_id: string; shares: number }[]
): { splits: SplitResult[]; error?: string } {
  const totalShares = shareData.reduce((acc, s) => acc + s.shares, 0);

  if (totalShares <= 0) {
    return { splits: [], error: 'Total shares must be greater than 0' };
  }

  const splits: SplitResult[] = shareData.map((s) => ({
    user_id: s.user_id,
    amount_owed: Math.floor((totalAmount * s.shares) / totalShares * 100) / 100,
    shares: s.shares,
  }));

  // Fix rounding on last person
  const distributed = splits.reduce((acc, s) => acc + s.amount_owed, 0);
  const diff = Math.round((totalAmount - distributed) * 100) / 100;
  if (diff !== 0 && splits.length > 0) {
    splits[splits.length - 1].amount_owed =
      Math.round((splits[splits.length - 1].amount_owed + diff) * 100) / 100;
  }

  return { splits };
}
