'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { SettlementService } from '../services/settlement.service';
import { ActivityService } from '@/features/activities/services/activity.service';
import { SettlementMethod } from '@/types';

const settlementService = new SettlementService();
const activityService = new ActivityService();

export async function recordSettlementAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const groupId = formData.get('group_id') as string;
  const paidBy = formData.get('paid_by') as string;
  const paidTo = formData.get('paid_to') as string;
  const amountStr = formData.get('amount') as string;
  const method = formData.get('method') as SettlementMethod || 'cash';
  const notes = formData.get('notes') as string;

  const amount = parseFloat(amountStr);

  if (!groupId || !paidBy || !paidTo || isNaN(amount) || amount <= 0) {
    return { error: 'Invalid input parameters.' };
  }

  // Optional: Add a check to ensure user is either paidBy or paidTo, 
  // or just a group member. Assuming group member for now (RLS would block anyway if restricted).

  const result = await settlementService.recordSettlement({
    group_id: groupId,
    paid_by: paidBy,
    paid_to: paidTo,
    amount,
    method,
    notes,
  });

  if (result.error) {
    return { error: result.error };
  }

  // Log activity
  if (result.settlement) {
    await activityService.logSettlementRecorded(user.id, result.settlement as any);
  }

  revalidatePath(`/groups/${groupId}`);
  return { success: true };
}
