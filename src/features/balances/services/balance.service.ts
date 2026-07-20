import { ExpenseRepository } from '@/features/expenses/repositories/expense.repository';
import { SettlementRepository } from '@/features/settlements/repositories/settlement.repository';
import { simplifyDebts, SettlementTransaction } from './simplification';

export class BalanceService {
  private expenseRepo = new ExpenseRepository();
  private settlementRepo = new SettlementRepository();

  /**
   * Calculates the net balance for each user in a group and simplifies the debts.
   * 
   * Net Balance = 
   *   (Total amount user PAID for the group in expenses) 
   * - (Total amount user OWES from expense splits)
   * + (Total amount user PAID in settlements to others)
   * - (Total amount user RECEIVED in settlements from others)
   * 
   * @param groupId The ID of the group
   * @returns An array of simplified settlement transactions
   */
  async getSimplifiedBalances(groupId: string): Promise<SettlementTransaction[]> {
    const balances: Record<string, number> = {};

    // 1. Fetch all expenses and compute initial net balances
    const expenses = await this.expenseRepo.getExpensesForGroup(groupId);
    if (expenses && expenses.length > 0) {
      for (const expense of expenses) {
        // Add the amount the payer paid to their net balance
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
    }

    // 2. Fetch all completed settlements and adjust net balances
    const settlements = await this.settlementRepo.getSettlementsForGroup(groupId);
    if (settlements && settlements.length > 0) {
      for (const settlement of settlements) {
        // Person who paid the settlement is effectively giving money back to the group/creditor
        balances[settlement.paid_by] = (balances[settlement.paid_by] || 0) + Number(settlement.amount);
        
        // Person who received the settlement is taking money out
        balances[settlement.paid_to] = (balances[settlement.paid_to] || 0) - Number(settlement.amount);
      }
    }

    // 3. Simplify the debts to find the minimum number of transactions
    return simplifyDebts(balances);
  }
}
