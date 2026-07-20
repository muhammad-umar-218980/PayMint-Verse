import { createClient } from '@/lib/supabase/server';
import { Expense, ExpenseSplit, GroupMember } from '@/types';

export class ExpenseRepository {
  /**
   * Get all expenses for a group, ordered by newest first.
   * Includes the payer's profile info via a join.
   */
  async getExpensesForGroup(groupId: string): Promise<(Expense & { payer: { full_name: string | null; email: string } })[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('expenses')
      .select('*, payer:profiles!expenses_paid_by_fkey(full_name, email)')
      .eq('group_id', groupId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching expenses:', error);
      return [];
    }
    return data as any;
  }

  /**
   * Get a single expense with its splits.
   */
  async getExpenseWithSplits(expenseId: string): Promise<{ expense: Expense; splits: ExpenseSplit[] } | null> {
    const supabase = await createClient();

    const { data: expense, error: expError } = await supabase
      .from('expenses')
      .select('*')
      .eq('id', expenseId)
      .single();

    if (expError) {
      console.error('Error fetching expense:', expError);
      return null;
    }

    const { data: splits, error: splitError } = await supabase
      .from('expense_splits')
      .select('*')
      .eq('expense_id', expenseId);

    if (splitError) {
      console.error('Error fetching splits:', splitError);
      return null;
    }

    return { expense: expense as Expense, splits: (splits || []) as ExpenseSplit[] };
  }

  /**
   * Get all members of a group with their profile info.
   */
  async getGroupMembers(groupId: string): Promise<(GroupMember & { profile: { full_name: string | null; email: string } })[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('group_members')
      .select('*, profile:profiles!group_members_user_id_fkey(full_name, email)')
      .eq('group_id', groupId);

    if (error) {
      console.error('Error fetching group members:', error);
      return [];
    }
    return data as any;
  }

  /**
   * Create an expense and its splits in one go using a single client.
   */
  async createExpenseWithSplits(
    expenseData: {
      group_id: string;
      title: string;
      description?: string;
      amount: number;
      currency: string;
      category: string;
      split_type: string;
      paid_by: string;
    },
    splits: { user_id: string; amount_owed: number; percentage?: number; shares?: number }[]
  ): Promise<Expense | null> {
    const supabase = await createClient();

    // 1. Insert the expense
    const { data: expense, error: expError } = await supabase
      .from('expenses')
      .insert(expenseData)
      .select()
      .single();

    if (expError) {
      console.error('Error creating expense:', expError);
      return null;
    }

    // 2. Insert all splits
    const splitRows = splits.map((s) => ({
      expense_id: expense.id,
      user_id: s.user_id,
      amount_owed: s.amount_owed,
      percentage: s.percentage || null,
      shares: s.shares || null,
    }));

    const { error: splitError } = await supabase
      .from('expense_splits')
      .insert(splitRows);

    if (splitError) {
      console.error('Error creating splits:', splitError);
      // Expense was created but splits failed — still return the expense
    }

    return expense as Expense;
  }

  /**
   * Delete an expense (CASCADE deletes its splits automatically).
   */
  async deleteExpense(expenseId: string): Promise<boolean> {
    const supabase = await createClient();
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', expenseId);

    if (error) {
      console.error('Error deleting expense:', error);
      return false;
    }
    return true;
  }
}
