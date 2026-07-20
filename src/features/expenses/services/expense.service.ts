import { ExpenseRepository } from '../repositories/expense.repository';
import {
  calculateEqualSplit,
  calculateCustomSplit,
  calculatePercentageSplit,
  calculateSharesSplit,
  SplitResult,
} from './split-calculator';
import { Expense, SplitType } from '@/types';

const expenseRepo = new ExpenseRepository();

export class ExpenseService {
  async getGroupExpenses(groupId: string) {
    return expenseRepo.getExpensesForGroup(groupId);
  }

  async getGroupMembers(groupId: string) {
    return expenseRepo.getGroupMembers(groupId);
  }

  async addExpense(
    data: {
      group_id: string;
      title: string;
      description?: string;
      amount: number;
      currency: string;
      category: string;
      paid_by: string;
      split_type: SplitType;
    },
    splitDetails: any[] // Depends on split_type
  ): Promise<Expense | { error: string }> {
    let splits: SplitResult[] = [];

    // Calculate splits based on type
    if (data.split_type === 'equal') {
      const memberIds = splitDetails as string[];
      splits = calculateEqualSplit(data.amount, memberIds);
    } else if (data.split_type === 'custom') {
      const result = calculateCustomSplit(data.amount, splitDetails);
      if (result.error) return { error: result.error };
      splits = result.splits;
    } else if (data.split_type === 'percentage') {
      const result = calculatePercentageSplit(data.amount, splitDetails);
      if (result.error) return { error: result.error };
      splits = result.splits;
    } else if (data.split_type === 'shares') {
      const result = calculateSharesSplit(data.amount, splitDetails);
      if (result.error) return { error: result.error };
      splits = result.splits;
    } else {
      return { error: 'Invalid split type' };
    }

    if (splits.length === 0) {
      return { error: 'No splits calculated' };
    }

    const expense = await expenseRepo.createExpenseWithSplits(data, splits);
    if (!expense) {
      return { error: 'Failed to save expense' };
    }

    return expense;
  }

  async deleteExpense(expenseId: string): Promise<boolean> {
    return expenseRepo.deleteExpense(expenseId);
  }
}
