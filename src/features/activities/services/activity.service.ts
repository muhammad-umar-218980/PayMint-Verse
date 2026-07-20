import { ActivityRepository } from '../repositories/activity.repository';
import { Expense, Settlement } from '@/types';

export class ActivityService {
  private repo = new ActivityRepository();

  async logExpenseCreated(userId: string, expense: Expense) {
    return this.repo.logActivity({
      group_id: expense.group_id,
      user_id: userId,
      action: 'added an expense',
      target_type: 'expense',
      target_id: expense.id,
      details: {
        title: expense.title,
        amount: expense.amount,
        currency: expense.currency,
      },
    });
  }

  async logExpenseDeleted(userId: string, groupId: string, expenseTitle: string) {
    return this.repo.logActivity({
      group_id: groupId,
      user_id: userId,
      action: 'deleted an expense',
      target_type: 'expense',
      details: {
        title: expenseTitle,
      },
    });
  }

  async logSettlementRecorded(userId: string, settlement: Settlement) {
    return this.repo.logActivity({
      group_id: settlement.group_id,
      user_id: userId,
      action: 'recorded a payment',
      target_type: 'settlement',
      target_id: settlement.id,
      details: {
        amount: settlement.amount,
        method: settlement.method,
        paid_to: settlement.paid_to,
      },
    });
  }

  async logMemberAdded(userId: string, groupId: string, invitedUserId: string) {
    return this.repo.logActivity({
      group_id: groupId,
      user_id: userId,
      action: 'added a new member',
      target_type: 'member',
      target_id: invitedUserId,
    });
  }
}
