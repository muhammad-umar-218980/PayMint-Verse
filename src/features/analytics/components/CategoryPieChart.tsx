'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface CategoryPieChartProps {
  data: { name: string; value: number }[];
}

const CATEGORY_COLORS: Record<string, string> = {
  'Food': '#ec4899', // Pink
  'Transport': '#3b82f6', // Blue
  'Shopping': '#a855f7', // Purple
  'Entertainment': '#f59e0b', // Amber
  'Housing': '#10b981', // Emerald
  'Utilities': '#06b6d4', // Cyan
  'Other': '#64748b'  // Slate
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#151f30] border border-white/10 rounded-xl p-3 shadow-xl">
        <p className="text-white font-medium mb-1">{payload[0].name}</p>
        <p className="text-violet-400 font-space font-bold">
          PKR {payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export default function CategoryPieChart({ data }: CategoryPieChartProps) {
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
          <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            iconType="circle"
            formatter={(value) => <span className="text-slate-300 text-xs ml-1">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
