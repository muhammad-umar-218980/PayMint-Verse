import { SettlementRepository } from '../repositories/settlement.repository';
import { SettlementMethod } from '@/types';

export class SettlementService {
  private repo = new SettlementRepository();

  async recordSettlement(data: {
    group_id: string;
    paid_by: string;
    paid_to: string;
    amount: number;
    method: SettlementMethod;
    notes?: string;
  }) {
    if (data.amount <= 0) {
      return { error: 'Amount must be greater than zero.' };
    }
    
    if (data.paid_by === data.paid_to) {
      return { error: 'Cannot settle with yourself.' };
    }

    const settlement = await this.repo.createSettlement(data);
    
    if (!settlement) {
      return { error: 'Failed to record settlement in database.' };
    }

    return { success: true, settlement };
  }
}
