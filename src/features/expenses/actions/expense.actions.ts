'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { ExpenseService } from '../services/expense.service';
import { ActivityService } from '@/features/activities/services/activity.service';
import { SplitType } from '@/types';

const expenseService = new ExpenseService();
const activityService = new ActivityService();

export async function addExpenseAction(formData: FormData, splitType: SplitType, splitDetails: any[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const groupId = formData.get('group_id') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const amountStr = formData.get('amount') as string;
  const amount = parseFloat(amountStr);
  const currency = formData.get('currency') as string || 'PKR';
  const category = formData.get('category') as string || 'Other';
  const paidBy = formData.get('paid_by') as string || user.id;

  if (!groupId || !title || isNaN(amount) || amount <= 0) {
    return { error: 'Invalid input' };
  }

  const result = await expenseService.addExpense(
    {
      group_id: groupId,
      title,
      description,
      amount,
      currency,
      category,
      paid_by: paidBy,
      split_type: splitType,
    },
    splitDetails
  );

  if ('error' in result) {
    return { error: result.error };
  }

  // Log activity
  await activityService.logExpenseCreated(user.id, result as any);

  revalidatePath(`/groups/${groupId}`);
  return { success: true };
}

export async function deleteExpenseAction(expenseId: string, groupId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  // We should verify if user is the payer or owner. For now RLS on delete handles this (only payer can delete).
  const success = await expenseService.deleteExpense(expenseId);

  if (!success) {
    return { error: 'Failed to delete expense or permission denied' };
  }

  // Log activity
  await activityService.logExpenseDeleted(user.id, groupId, 'an expense');

  revalidatePath(`/groups/${groupId}`);
  return { success: true };
}
