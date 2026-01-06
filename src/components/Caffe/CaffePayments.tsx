import { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
} from '@mui/material';
import { AttachMoney, PhoneAndroid, AccountBalance } from '@mui/icons-material';
import { apiService } from '@/services/api';
import { SalesInvoice } from '@/types';
import * as styles from './CaffePayments.styles';

interface CaffePaymentsProps {
  refreshTrigger?: number;
  onSuccess?: () => void;
}

type PaymentMethod = 'Cash' | 'Mpesa' | 'Bank';

export const CaffePayments = ({ onSuccess }: CaffePaymentsProps) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [invoices, setInvoices] = useState<SalesInvoice[]>([]);
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [paymentDetails, setPaymentDetails] = useState({
    amount: 0,
    phone: '',
    bank: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'method' | 'invoices' | 'details'>('method');

  const paymentMethods = [
    { id: 'Cash' as PaymentMethod, label: 'Cash', icon: <AttachMoney />, color: '#4caf50' },
    { id: 'Mpesa' as PaymentMethod, label: 'M-Pesa', icon: <PhoneAndroid />, color: '#ff9800' },
    { id: 'Bank' as PaymentMethod, label: 'Bank Transfer', icon: <AccountBalance />, color: '#2196f3' },
  ];

  const handleMethodSelect = async (method: PaymentMethod) => {
    setSelectedMethod(method);
    setError(null);
    setLoading(true);
    
    try {
      // Fetch unpaid invoices
      const data = await apiService.getSalesInvoices({
        docstatus: 1,
        status: ['!=', 'Paid'],
      });
      setInvoices(data);
      setStep('invoices');
    } catch (err: any) {
      setError(err.message || 'Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleInvoiceToggle = (invoiceName: string) => {
    setSelectedInvoices((prev) =>
      prev.includes(invoiceName)
        ? prev.filter((name) => name !== invoiceName)
        : [...prev, invoiceName]
    );
  };

  const handleNext = () => {
    if (step === 'invoices') {
      if (selectedInvoices.length === 0) {
        setError('Please select at least one invoice');
        return;
      }
      setStep('details');
    }
  };

  const handleProcessPayment = async () => {
    if (!selectedMethod) return;

    setError(null);
    setLoading(true);

    try {
      if (selectedMethod === 'Cash') {
        // Process cash payment for first invoice
        await apiService.createCashPayment({
          sales_invoice: selectedInvoices[0],
          amount: paymentDetails.amount,
          game_space_id: '',
        });
      } else if (selectedMethod === 'Mpesa') {
        if (!paymentDetails.phone) {
          setError('Phone number is required for M-Pesa payment');
          setLoading(false);
          return;
        }
        await apiService.payViaTinyPesa(
          paymentDetails.phone,
          paymentDetails.amount,
          selectedInvoices[0]
        );
      } else if (selectedMethod === 'Bank') {
        if (!paymentDetails.bank) {
          setError('Bank name is required');
          setLoading(false);
          return;
        }
        await apiService.createBankPayment({
          sales_invoice: selectedInvoices[0],
          amount: paymentDetails.amount,
          game_space_id: '',
          bank_name: paymentDetails.bank,
        });
      }

      onSuccess?.();
      handleReset();
    } catch (err: any) {
      setError(err.message || 'Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedMethod(null);
    setSelectedInvoices([]);
    setPaymentDetails({ amount: 0, phone: '', bank: '' });
    setStep('method');
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Initiate Payment</h1>
        <p className="text-muted-foreground">Select a payment method and process payments for unpaid invoices</p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg mb-4">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-destructive hover:text-destructive/80">×</button>
          </div>
        </div>
      )}

      {step === 'method' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => handleMethodSelect(method.id)}
              className="bg-card border border-border rounded-lg p-6 hover:bg-accent/10 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer group"
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  {method.icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground">{method.label}</h3>
              </div>
            </button>
          ))}
        </div>
      )}

      {step === 'invoices' && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-4 border-b border-border flex justify-between items-center">
            <h2 className="text-lg font-semibold text-foreground">Select Invoices</h2>
            <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
              {selectedInvoices.length} selected
            </span>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <CircularProgress />
            </div>
          ) : (
            <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
              {invoices.map((invoice) => (
                <button
                  key={invoice.name}
                  onClick={() => handleInvoiceToggle(invoice.name)}
                  className={`w-full p-4 border rounded-lg transition-all duration-300 hover:shadow-md ${
                    selectedInvoices.includes(invoice.name)
                      ? 'border-accent bg-accent/10 shadow-md'
                      : 'border-border hover:border-accent/50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="text-left">
                      <h3 className="font-semibold text-foreground">{invoice.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(invoice.posting_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-accent">
                        KES {invoice.grand_total}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          <Box sx={styles.actionButtons}>
            <Button onClick={handleReset} variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleNext} variant="contained" disabled={selectedInvoices.length === 0}>
              Next
            </Button>
          </Box>
        </div>
      )}

      {step === 'details' && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Payment Details</h2>

          <div className="space-y-4">
            {selectedMethod === 'Mpesa' && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={paymentDetails.phone}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, phone: e.target.value })}
                  placeholder="0712345678"
                  required
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            )}

            {selectedMethod === 'Bank' && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Bank Name</label>
                <select
                  value={paymentDetails.bank}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, bank: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="">Select Bank</option>
                  <option value="Equity Bank">Equity Bank</option>
                  <option value="Family Bank">Family Bank</option>
                  <option value="KCB">KCB</option>
                  <option value="Stan Chart">Stan Chart</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Amount</label>
              <input
                type="number"
                value={paymentDetails.amount}
                onChange={(e) => setPaymentDetails({ ...paymentDetails, amount: parseFloat(e.target.value) || 0 })}
                required
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          <div className="flex gap-4 justify-end mt-6">
            <button
              onClick={() => setStep('invoices')}
              className="px-4 py-2 border border-border rounded-md text-foreground hover:bg-accent/10 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleProcessPayment}
              disabled={loading || paymentDetails.amount <= 0}
              className="px-4 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && <CircularProgress size={16} />}
              {loading ? 'Processing...' : 'Process Payment'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
