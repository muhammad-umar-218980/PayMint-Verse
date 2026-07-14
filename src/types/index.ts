export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Group {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  joined_at: string;
}

export interface Expense {
  id: string;
  group_id: string;
  title: string;
  amount: number;
  paid_by: string;
  created_at: string;
}

export interface ExpenseSplit {
  id: string;
  expense_id: string;
  user_id: string;
  amount: number;
}

export interface Settlement {
  id: string;
  group_id: string;
  payer_id: string;
  receiver_id: string;
  amount: number;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  group_id: string;
  user_id: string;
  action_type: string;
  metadata: any;
  created_at: string;
}

// Custom UI Types for Business Logic
export interface Balance {
  user_id: string;
  amount: number; // Positive means they are owed money, negative means they owe money
}
