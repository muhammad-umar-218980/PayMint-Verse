import { ExpenseRepository } from '../repositories/expense.repository';
import ExpenseCard from './ExpenseCard';

interface ExpenseListProps {
  groupId: string;
  membersMap: Record<string, string>;
  currentUserId: string;
}

export default async function ExpenseList({ groupId, membersMap, currentUserId }: ExpenseListProps) {
  const repo = new ExpenseRepository();
  const expenses = await repo.getExpensesForGroup(groupId);

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <p className="text-slate-400 text-[15px]">No expenses yet. Add one above to get started!</p>
      </div>
    );
  }

  // We need the splits for each expense. To avoid N+1 queries in the UI component,
  // we could have fetched them in the repository. Since we didn't, we'll fetch them here in parallel.
  // In a real production app, we would write a single optimized SQL query or use GraphQL.
  
  const expensesWithSplits = await Promise.all(
    expenses.map(async (exp) => {
      const data = await repo.getExpenseWithSplits(exp.id);
      return {
        ...exp,
        splits: data?.splits || [],
      };
    })
  );

  return (
    <div className="space-y-4">
      {expensesWithSplits.map((exp) => (
        <ExpenseCard 
          key={exp.id} 
          expense={exp} 
          splits={exp.splits} 
          membersMap={membersMap}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
}
