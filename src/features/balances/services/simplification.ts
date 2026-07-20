export interface SettlementTransaction {
  from: string;
  to: string;
  amount: number;
}

/**
 * Simplifies a set of net balances to minimize the number of transactions required to settle up.
 * 
 * @param balances A dictionary of net balances where key = user_id, value = net amount.
 *                 Positive means they are owed money, negative means they owe money.
 * @returns A list of required transactions.
 */
export function simplifyDebts(balances: Record<string, number>): SettlementTransaction[] {
  // Separate into debtors (those who owe) and creditors (those who are owed)
  const debtors: { id: string; amount: number }[] = [];
  const creditors: { id: string; amount: number }[] = [];

  for (const [id, amount] of Object.entries(balances)) {
    // We round to 2 decimal places to avoid floating point issues
    const roundedAmount = Math.round(amount * 100) / 100;
    
    if (roundedAmount < -0.01) { // They owe money
      debtors.push({ id, amount: Math.abs(roundedAmount) });
    } else if (roundedAmount > 0.01) { // They are owed money
      creditors.push({ id, amount: roundedAmount });
    }
  }

  // Sort them so we match the biggest debtor with the biggest creditor (Greedy approach)
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const transactions: SettlementTransaction[] = [];

  let i = 0; // debtor index
  let j = 0; // creditor index

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    // The amount to settle is the minimum of what the debtor owes and what the creditor is owed
    const amountToSettle = Math.min(debtor.amount, creditor.amount);

    if (amountToSettle > 0.01) {
      transactions.push({
        from: debtor.id,
        to: creditor.id,
        amount: Math.round(amountToSettle * 100) / 100,
      });
    }

    // Update their remaining balances
    debtor.amount -= amountToSettle;
    creditor.amount -= amountToSettle;

    // If the debtor has paid off their debt, move to the next debtor
    if (debtor.amount <= 0.01) {
      i++;
    }

    // If the creditor has received all they are owed, move to the next creditor
    if (creditor.amount <= 0.01) {
      j++;
    }
  }

  return transactions;
}
