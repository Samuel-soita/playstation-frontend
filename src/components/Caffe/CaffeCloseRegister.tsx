import { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import { Edit, Save } from '@mui/icons-material';
import { apiService } from '@/services/api';
import { TodaysInvoicesSummary } from '@/types';

interface CaffeCloseRegisterProps {
  refreshTrigger?: number;
  onSuccess?: () => void;
}

export const CaffeCloseRegister = ({ refreshTrigger, onSuccess }: CaffeCloseRegisterProps) => {
  const [summary, setSummary] = useState<TodaysInvoicesSummary | null>(null);
  const [revenue, setRevenue] = useState({ cash: 0, bank: 0, mpesa: 0 });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    fetchSummary();
  }, [refreshTrigger]);

  const fetchSummary = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const data = await apiService.getTodaysInvoicesSummary(today);
      setSummary(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load summary');
    }
  };

  const totalRevenue = revenue.cash + revenue.bank + revenue.mpesa;
  const totalExpected = summary ? summary.total_expected_revenue : 0;

  const handleCloseRegister = async () => {
    if (totalRevenue <= 0) {
      setError('Please input payment amounts before closing the register');
      return;
    }

    setConfirmOpen(true);
  };

  const confirmClose = async () => {
    setLoading(true);
    setError(null);
    setConfirmOpen(false);

    try {
      // TODO: Implement register closure payment processing
      // await apiService.closeRegister({ cash: revenue.cash, bank: revenue.bank, mpesa: revenue.mpesa });
      
      onSuccess?.();
      setEditing(false);
      setRevenue({ cash: 0, bank: 0, mpesa: 0 });
    } catch (err: any) {
      setError(err.message || 'Failed to close register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Close Register</h1>
        <p className="text-muted-foreground">Review today's revenue and close the register</p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-destructive hover:text-destructive/80">×</button>
        </div>
      )}

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg p-4 shadow-elegant">
            <h3 className="text-sm text-muted-foreground mb-2">Total Unpaid</h3>
            <p className="text-2xl font-bold text-yellow-600">KES {summary.total_unpaid.toFixed(2)}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 shadow-elegant">
            <h3 className="text-sm text-muted-foreground mb-2">Total Paid</h3>
            <p className="text-2xl font-bold text-green-600">KES {summary.total_paid.toFixed(2)}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 shadow-elegant">
            <h3 className="text-sm text-muted-foreground mb-2">Total Expected</h3>
            <p className="text-2xl font-bold text-accent">KES {totalExpected.toFixed(2)}</p>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-lg p-6 shadow-elegant">
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Revenue Received</h2>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-accent">KES {totalRevenue.toFixed(2)}</span>
            <button
              onClick={() => setEditing(!editing)}
              className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
            >
              {editing ? <Save className="w-5 h-5" /> : <Edit className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {editing && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Cash Amount</label>
              <input
                type="number"
                value={revenue.cash}
                onChange={(e) => setRevenue({ ...revenue, cash: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Bank Amount</label>
              <input
                type="number"
                value={revenue.bank}
                onChange={(e) => setRevenue({ ...revenue, bank: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">M-Pesa Amount</label>
              <input
                type="number"
                value={revenue.mpesa}
                onChange={(e) => setRevenue({ ...revenue, mpesa: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={handleCloseRegister}
            disabled={loading || totalRevenue <= 0}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && <CircularProgress size={16} className="text-white" />}
            {loading ? 'Closing...' : 'Close Register'}
          </button>
        </div>
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Confirm Register Closure</h3>
              <p className="text-muted-foreground mb-4">
                Are you sure you want to close the register with the following amounts?
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span>Cash:</span>
                  <span>KES {revenue.cash.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bank:</span>
                  <span>KES {revenue.bank.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>M-Pesa:</span>
                  <span>KES {revenue.mpesa.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border font-semibold">
                  <span>Total:</span>
                  <span>KES {totalRevenue.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setConfirmOpen(false)}
                  className="px-4 py-2 border border-border rounded-md text-foreground hover:bg-accent/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmClose}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
