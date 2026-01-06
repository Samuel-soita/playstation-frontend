import { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Payment, Print } from '@mui/icons-material';
import { apiService } from '@/services/api';
import { SalesInvoice } from '@/types';
import { format } from 'date-fns';

interface SalesInvoiceListProps {
  onPay?: (invoice: SalesInvoice) => void;
  refreshTrigger?: number;
}

export const SalesInvoiceList = ({ onPay, refreshTrigger }: SalesInvoiceListProps) => {
  const [invoices, setInvoices] = useState<SalesInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string>('today');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let filters: Record<string, any> = { docstatus: 1 };
      
      if (dateFilter === 'today') {
        const today = new Date().toISOString().split('T')[0];
        filters.posting_date = today;
      } else if (dateFilter === 'this_week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        filters.posting_date = ['>=', weekAgo.toISOString().split('T')[0]];
      } else if (dateFilter === 'this_month') {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        filters.posting_date = ['>=', monthAgo.toISOString().split('T')[0]];
      }
      
      if (statusFilter !== 'all') {
        if (statusFilter === 'paid') {
          filters.outstanding_amount = 0;
        } else if (statusFilter === 'unpaid') {
          filters.outstanding_amount = ['>', 0];
        }
      }
      
      const data = await apiService.getSalesInvoices(filters);
      setInvoices(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load invoices');
      console.error('Error fetching invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [refreshTrigger, dateFilter, statusFilter]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchInvoices, 30000);
    return () => clearInterval(interval);
  }, [dateFilter, statusFilter]);

  const formatCurrency = (amount: number, currency: string = 'KES') => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };


  if (loading && invoices.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="flex flex-wrap gap-6 p-6 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-3xl border-2 border-yellow-300 shadow-xl">
        <div className="min-w-[200px]">
          <label className="block text-sm font-bold text-gray-700 mb-2">Date Filter</label>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full px-4 py-3 border-2 border-yellow-300 rounded-xl bg-white text-gray-900 font-semibold focus:border-amber-500 focus:outline-none transition-colors duration-300"
          >
            <option value="today">Today</option>
            <option value="this_week">This Week</option>
            <option value="this_month">This Month</option>
            <option value="all">All Time</option>
          </select>
        </div>

        <div className="min-w-[200px]">
          <label className="block text-sm font-bold text-gray-700 mb-2">Status Filter</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-3 border-2 border-yellow-300 rounded-xl bg-white text-gray-900 font-semibold focus:border-amber-500 focus:outline-none transition-colors duration-300"
          >
            <option value="all">All</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>
      </div>

      {invoices.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border-2 border-gray-300">
          <div className="text-6xl mb-4">📄</div>
          <p className="text-xl text-gray-500 font-semibold">No invoices found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 p-6">
          {invoices.map((invoice, index) => {
            const isPaid = (invoice.outstanding_amount || 0) <= 0;
            return (
              <div
                key={invoice.name}
                className={`group relative rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-105 cursor-pointer overflow-hidden animate-fade-in min-h-[400px] flex flex-col justify-between ${
                  isPaid
                    ? 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-4 border-green-400 hover:border-green-500'
                    : 'bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 border-4 border-yellow-400 hover:border-amber-500'
                }`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  background: isPaid
                    ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(251, 191, 36, 0.05))'
                    : 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.05))'
                }}
              >
                {/* Animated border effect */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${
                  isPaid ? 'from-green-400 via-emerald-500 to-teal-500' : 'from-yellow-400 via-amber-500 to-orange-500'
                } opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>

                {/* Hover glow effect */}
                <div className={`absolute inset-0 rounded-3xl shadow-[0_0_60px_${
                  isPaid ? 'rgba(34,197,94,0.3)' : 'rgba(251,191,36,0.3)'
                }] opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                {/* Header */}
                <div className="relative z-10 flex items-center justify-between mb-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 ${
                    isPaid ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 'bg-gradient-to-br from-yellow-400 to-amber-500'
                  }`}>
                    💰
                  </div>
                  <div className={`px-4 py-2 rounded-xl font-bold text-sm ${
                    isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {isPaid ? 'PAID' : 'UNPAID'}
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex-1 space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">Invoice #</p>
                    <p className="text-xl font-bold text-gray-900 group-hover:text-yellow-600 transition-colors duration-300">
                      {invoice.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">Date</p>
                    <p className="text-lg text-gray-800 font-semibold">
                      {format(new Date(invoice.posting_date), 'MMM dd, yyyy')}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">Customer</p>
                    <p className="text-lg text-gray-800 font-semibold">{invoice.customer}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 font-medium mb-1">Total</p>
                      <p className="text-lg font-bold text-green-600">
                        {formatCurrency(invoice.grand_total, invoice.currency)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium mb-1">Outstanding</p>
                      <p className={`text-lg font-bold ${isPaid ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(invoice.outstanding_amount || 0, invoice.currency)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="relative z-10 mt-6 flex gap-3">
                  {(invoice.outstanding_amount || 0) > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPay?.(invoice);
                      }}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-bold transition-all duration-300 hover:from-blue-600 hover:to-purple-700 hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <Payment className="w-5 h-5" />
                      Pay
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`/api/resource/Sales Invoice/${invoice.name}`, '_blank');
                    }}
                    className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 px-4 rounded-xl font-bold transition-all duration-300 hover:from-gray-600 hover:to-gray-700 hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <Print className="w-5 h-5" />
                    Print
                  </button>
                </div>

                {/* Floating particles effect */}
                <div className={`absolute top-4 right-4 w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-ping ${
                  isPaid ? 'bg-green-400' : 'bg-yellow-400'
                }`}></div>
                <div className={`absolute bottom-4 left-4 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse ${
                  isPaid ? 'bg-emerald-500' : 'bg-amber-500'
                }`} style={{ animationDelay: '0.3s' }}></div>
                <div className={`absolute top-1/2 left-6 w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-bounce ${
                  isPaid ? 'bg-teal-400' : 'bg-orange-400'
                }`} style={{ animationDelay: '0.6s' }}></div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
