export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  currency: string;
  timezone: string;
  theme: string;
  notification_settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Group {
  id: string;
  name: string;
  description: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export type GroupRole = 'owner' | 'admin' | 'moderator' | 'member';

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: GroupRole;
  joined_at: string;
}

export type SplitType = 'equal' | 'custom' | 'percentage' | 'shares';

export interface Expense {
  id: string;
  group_id: string;
  title: string;
  description: string | null;
  amount: number;
  currency: string;
  category: string;
  receipt_url: string | null;
  split_type: SplitType;
  paid_by: string;
  created_at: string;
  updated_at: string;
}

export interface ExpenseSplit {
  id: string;
  expense_id: string;
  user_id: string;
  amount_owed: number;
  percentage: number | null;
  shares: number | null;
  is_settled: boolean;
}

export type SettlementMethod = 'cash' | 'bank_transfer' | 'easypaisa' | 'jazzcash' | 'other';
export type SettlementStatus = 'pending' | 'completed' | 'failed';

export interface Settlement {
  id: string;
  group_id: string;
  paid_by: string;
  paid_to: string;
  amount: number;
  method: SettlementMethod;
  status: SettlementStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  group_id: string;
  user_id: string;
  action: string;
  target_type: string | null;
  target_id: string | null;
  details: Record<string, any> | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  message: string;
  is_read: boolean;
  related_id: string | null;
  created_at: string;
}

// Custom UI Types for Business Logic
export interface Balance {
  user_id: string;
  amount: number; // Positive means they are owed money, negative means they owe money
}
