import { createClient } from '@/lib/supabase/server';
import { Settlement, SettlementMethod, SettlementStatus } from '@/types';

export class SettlementRepository {
  /**
   * Insert a new settlement record.
   */
  async createSettlement(data: {
    group_id: string;
    paid_by: string;
    paid_to: string;
    amount: number;
    method?: SettlementMethod;
    notes?: string;
  }): Promise<Settlement | null> {
    const supabase = await createClient();
    const { data: settlement, error } = await supabase
      .from('settlements')
      .insert({
        ...data,
        status: 'completed' as SettlementStatus
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating settlement:', error);
      return null;
    }
    return settlement as Settlement;
  }

  /**
   * Fetch all completed settlements for a group.
   */
  async getSettlementsForGroup(groupId: string): Promise<Settlement[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('settlements')
      .select('*')
      .eq('group_id', groupId)
      .eq('status', 'completed');

    if (error) {
      console.error('Error fetching settlements:', error);
      return [];
    }
    return data as Settlement[];
  }
}
