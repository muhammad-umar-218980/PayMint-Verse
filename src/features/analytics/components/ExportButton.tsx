'use client';

import { Download } from 'lucide-react';
import { useState } from 'react';

interface ExportButtonProps {
  expenses: any[];
  groupName: string;
}

export default function ExportButton({ expenses, groupName }: ExportButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleExport = () => {
    setLoading(true);
    try {
      // Create CSV Headers
      const headers = ['Date', 'Title', 'Category', 'Paid By', 'Amount', 'Currency', 'Description'];
      
      // Create CSV Rows
      const rows = expenses.map(exp => [
        new Date(exp.created_at).toLocaleDateString(),
        `"${exp.title.replace(/"/g, '""')}"`, // Escape quotes
        exp.category || 'Other',
        `"${exp.payer?.full_name || exp.payer?.email || 'Unknown'}"`,
        exp.amount,
        exp.currency,
        `"${(exp.description || '').replace(/"/g, '""')}"`
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      // Create Blob and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const filename = `${groupName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_expenses.csv`;
      
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to export CSV:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading || expenses.length === 0}
      className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Download className="w-4 h-4" />
      Export to CSV
    </button>
  );
}
