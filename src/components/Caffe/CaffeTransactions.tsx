import { useState } from 'react';
import {
  CircularProgress,
} from '@mui/material';
// Using native date inputs instead of date picker library
import { apiService } from '@/services/api';
import { SalesInvoice } from '@/types';
import { format } from 'date-fns';

interface CaffeTransactionsProps {
  refreshTrigger?: number;
}

type DateRange = 'today' | 'yesterday' | 'last_3_days' | 'this_week' | 'last_fortnight' | 'this_month' | 'custom';

export const CaffeTransactions = ({ }: CaffeTransactionsProps) => {
  const [dateRange, setDateRange] = useState<DateRange>('today');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [invoices, setInvoices] = useState<SalesInvoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const getDateRange = (): { start: Date; end: Date } => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch (dateRange) {
      case 'today':
        return { start: today, end: new Date() };
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return { start: yesterday, end: yesterday };
      case 'last_3_days':
        const threeDaysAgo = new Date(today);
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        return { start: threeDaysAgo, end: today };
      case 'this_week':
        const weekStart = new Date(today);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        return { start: weekStart, end: today };
      case 'last_fortnight':
        const fortnightAgo = new Date(today);
        fortnightAgo.setDate(fortnightAgo.getDate() - 14);
        return { start: fortnightAgo, end: today };
      case 'this_month':
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        return { start: monthStart, end: today };
      case 'custom':
        if (startDate && endDate) {
          return { start: startDate, end: endDate };
        }
        return { start: today, end: today };
      default:
        return { start: today, end: today };
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { start, end } = getDateRange();
      const startStr = format(start, 'yyyy-MM-dd');
      const endStr = format(end, 'yyyy-MM-dd');

      // Fetch invoices
      const invoiceData = await apiService.getSalesInvoices({
        posting_date: ['between', [startStr, endStr]],
        docstatus: 1,
      });
      setInvoices(invoiceData);

      // TODO: Fetch payment entries
      // const paymentData = await apiService.getPaymentEntries({...});
      // setPayments(paymentData);
      
    } catch (err: any) {
      setError(err.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const totalInvoiceRevenue = invoices.reduce((sum, inv) => sum + (inv.grand_total || 0), 0);
  const totalPaid = invoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + (inv.grand_total || 0), 0);
  const totalUnpaid = invoices.filter(inv => inv.status !== 'Paid').reduce((sum, inv) => sum + (inv.grand_total || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">View Transactions</h1>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as DateRange)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last_3_days">Last 3 Days</option>
              <option value="this_week">This Week</option>
              <option value="last_fortnight">Last Fortnight</option>
              <option value="this_month">This Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {dateRange === 'custom' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Start Date</label>
                <input
                  type="date"
                  value={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
                  onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : null)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">End Date</label>
                <input
                  type="date"
                  value={endDate ? format(endDate, 'yyyy-MM-dd') : ''}
                  onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>
          )}

          <div className="col-span-full">
            <button
              onClick={fetchTransactions}
              disabled={loading}
              className="w-full px-4 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <CircularProgress size={16} />}
              {loading ? 'Loading...' : 'Fetch Transactions'}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg mt-4 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-destructive hover:text-destructive/80">×</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="bg-card border border-border rounded-lg p-4 shadow-elegant">
          <h3 className="text-sm text-muted-foreground mb-2">Total Invoice Revenue</h3>
          <p className="text-2xl font-bold text-accent">KES {totalInvoiceRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 shadow-elegant">
          <h3 className="text-sm text-muted-foreground mb-2">Total Paid</h3>
          <p className="text-2xl font-bold text-green-600">KES {totalPaid.toFixed(2)}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 shadow-elegant">
          <h3 className="text-sm text-muted-foreground mb-2">Total Unpaid</h3>
          <p className="text-2xl font-bold text-red-600">KES {totalUnpaid.toFixed(2)}</p>
        </div>
      </div>

      {showBreakdown && invoices.length > 0 && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Invoice Breakdown</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Invoice #</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Customer</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.name} className="border-t border-border hover:bg-muted/30">
                    <td className="px-4 py-3 text-sm text-foreground">{invoice.name}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{format(new Date(invoice.posting_date), 'MMM dd, yyyy')}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{invoice.customer}</td>
                    <td className="px-4 py-3 text-sm text-foreground">KES {invoice.grand_total}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        invoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
                        invoice.status === 'Unpaid' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-4">
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          disabled={invoices.length === 0}
          className="px-4 py-2 border border-border rounded-md text-foreground hover:bg-accent/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {showBreakdown ? 'Hide' : 'Show'} Breakdown
        </button>
      </div>
    </div>
  );
};
