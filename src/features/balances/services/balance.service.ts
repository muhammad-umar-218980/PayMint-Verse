import { ExpenseRepository } from '@/features/expenses/repositories/expense.repository';
import { simplifyDebts, SettlementTransaction } from './simplification';

export class BalanceService {
  private expenseRepo = new ExpenseRepository();

  /**
   * Calculates the net balance for each user in a group and simplifies the debts.
   * 
   * Net Balance = Total amount user PAID for the group - Total amount user OWES from splits.
   * 
   * @param groupId The ID of the group
   * @returns An array of simplified settlement transactions
   */
  async getSimplifiedBalances(groupId: string): Promise<SettlementTransaction[]> {
    // 1. Fetch all expenses for the group
    const expenses = await this.expenseRepo.getExpensesForGroup(groupId);

    if (!expenses || expenses.length === 0) {
      return [];
    }

    const balances: Record<string, number> = {};

    // 2. Fetch all splits for these expenses and compute net balances
    for (const expense of expenses) {
      // Add the amount the payer paid to their net balance
      // They are "owed" this money back by the group
      balances[expense.paid_by] = (balances[expense.paid_by] || 0) + Number(expense.amount);

      // Fetch splits for this expense
      const data = await this.expenseRepo.getExpenseWithSplits(expense.id);
      if (data && data.splits) {
        for (const split of data.splits) {
          // Subtract what each user owes from their net balance
          balances[split.user_id] = (balances[split.user_id] || 0) - Number(split.amount_owed);
        }
      }
    }

    // 3. Simplify the debts to find the minimum number of transactions
    return simplifyDebts(balances);
  }
}
