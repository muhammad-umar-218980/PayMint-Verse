'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface CategoryPieChartProps {
  data: { name: string; value: number }[];
  currency?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Food': '#ec4899', // Pink
  'Transport': '#3b82f6', // Blue
  'Accommodation': '#a855f7', // Purple
  'Housing': '#10b981', // Emerald (legacy)
  'Entertainment': '#f59e0b', // Amber
  'Shopping': '#06b6d4', // Cyan
  'Utilities': '#f97316', // Orange
  'Other': '#64748b'  // Slate
};

const CustomTooltip = ({ active, payload, currency }: { active?: boolean; payload?: { name: string; value: number }[]; currency: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-line rounded-xl p-3 shadow-xl">
        <p className="text-ink font-medium mb-1">{payload[0].name}</p>
        <p className="text-emerald-700 font-serif tracking-tight">
          {currency} {payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export default function CategoryPieChart({ data, currency = 'PKR' }: CategoryPieChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-slate-500 text-sm">
        No expense data to analyze yet.
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || CATEGORY_COLORS['Other']} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip currency={currency} />} cursor={{fill: 'transparent'}} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            iconType="circle"
            formatter={(value) => <span className="text-slate-600 text-xs ml-1">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
