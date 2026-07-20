import { ExpenseRepository } from '@/features/expenses/repositories/expense.repository';

export class AnalyticsService {
  private expenseRepo = new ExpenseRepository();

  /**
   * Aggregates expenses by category for a group.
   */
  async getCategoryBreakdown(groupId: string): Promise<{ name: string; value: number }[]> {
    const expenses = await this.expenseRepo.getExpensesForGroup(groupId);
    if (!expenses || expenses.length === 0) return [];

    const categoryMap: Record<string, number> = {};

    expenses.forEach(exp => {
      const category = exp.category || 'Other';
      categoryMap[category] = (categoryMap[category] || 0) + Number(exp.amount);
    });

    return Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value); // Sort by highest spending
  }
}
