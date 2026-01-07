import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import { SalesInvoice } from '@/types';
import { apiService } from '@/services/api';

interface PaymentDialogProps {
  open: boolean;
  invoice: SalesInvoice | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const PaymentDialog = ({ open, invoice, onClose, onSuccess }: PaymentDialogProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'mpesa' | 'bank'>('cash');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize amount when invoice changes
  useEffect(() => {
    if (invoice) {
      setAmount(invoice.outstanding_amount || invoice.grand_total);
    }
  }, [invoice]);

  const handleSubmit = async () => {
    if (!invoice) return;

    setError(null);

    // Validation
    if (paymentMethod === 'mpesa' && !phoneNumber) {
      setError('Phone number is required for M-Pesa payment');
      return;
    }

    if (paymentMethod === 'bank' && (!bankName || !accountNumber)) {
      setError('Bank name and account number are required for bank payment');
      return;
    }

    if (amount <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    try {
      setLoading(true);

      if (paymentMethod === 'mpesa') {
        // Format phone number (remove +254, add 0 if needed)
        let formattedPhone = phoneNumber.replace(/\+254/g, '');
        if (!formattedPhone.startsWith('0')) {
          formattedPhone = '0' + formattedPhone;
        }

        await apiService.createMpesaPayment({
          sales_invoice: invoice.name,
          phone_number: formattedPhone,
          amount: amount,
          game_space_id: '', // Can be extracted from invoice if needed
        });
      } else if (paymentMethod === 'bank') {
        await apiService.createBankPayment({
          sales_invoice: invoice.name,
          bank_name: bankName,
          amount: amount,
          game_space_id: '',
        });
      } else {
        // Cash payment
        await apiService.createCashPayment({
          sales_invoice: invoice.name,
          amount: amount,
          game_space_id: '',
        });
      }

      onSuccess();
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setPhoneNumber('');
    setBankName('');
    setAccountNumber('');
    setAmount(invoice?.outstanding_amount || invoice?.grand_total || 0);
    setPaymentMethod('cash');
    onClose();
  };

  if (!invoice) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{
        background: 'linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)',
        color: 'white',
        textAlign: 'center'
      }}>
        💰 Process Payment - {invoice.name}
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        {/* Invoice Summary */}
        <Box sx={{ mb: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2, border: '2px solid #fbbf24' }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#92400e', fontWeight: 'bold' }}>
            📄 Invoice Details
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">Invoice Number</Typography>
              <Typography variant="body1" fontWeight="bold">{invoice.name}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Outstanding Amount</Typography>
              <Typography variant="body1" fontWeight="bold" color="error">
                KES {invoice.outstanding_amount || invoice.grand_total}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Customer</Typography>
              <Typography variant="body1">{invoice.customer}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Date</Typography>
              <Typography variant="body1">{new Date(invoice.posting_date).toLocaleDateString()}</Typography>
            </Box>
          </Box>
        </Box>

        {/* Payment Method Selection */}
        <Tabs
          value={paymentMethod}
          onChange={(_, newValue: 'cash' | 'mpesa' | 'bank') => setPaymentMethod(newValue)}
          sx={{
            mb: 3,
            '& .MuiTab-root': {
              minHeight: 48,
              fontWeight: 'bold',
              textTransform: 'none',
            }
          }}
          variant="fullWidth"
        >
          <Tab
            icon="💵"
            label="Cash Payment"
            value="cash"
            sx={{ flexDirection: 'row', gap: 1 }}
          />
          <Tab
            icon="📱"
            label="M-Pesa STK Push"
            value="mpesa"
            sx={{ flexDirection: 'row', gap: 1 }}
          />
          <Tab
            icon="🏦"
            label="Bank Transfer"
            value="bank"
            sx={{ flexDirection: 'row', gap: 1 }}
          />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Payment Method Specific Fields */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, minHeight: 200 }}>
          {paymentMethod === 'cash' && (
            <Box sx={{ p: 3, bgcolor: 'green.50', borderRadius: 2, border: '2px solid #16a34a' }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#166534', display: 'flex', alignItems: 'center', gap: 1 }}>
                💵 Cash Payment
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Collect cash payment directly from the customer. Payment will be recorded instantly.
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                💡 Ensure you count the cash amount carefully before processing.
              </Alert>
            </Box>
          )}

          {paymentMethod === 'mpesa' && (
            <Box sx={{ p: 3, bgcolor: 'blue.50', borderRadius: 2, border: '2px solid #2563eb' }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#1e40af', display: 'flex', alignItems: 'center', gap: 1 }}>
                📱 M-Pesa STK Push Payment
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Send an STK push to the customer's phone. They will receive a prompt to enter their M-Pesa PIN.
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>M-Pesa Details:</Typography>
                <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 1, border: '1px solid #e5e7eb' }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Till Number:</strong> 123456 (Demo)
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Business Name:</strong> PlayStation Digital System
                  </Typography>
                  <Typography variant="body2">
                    <strong>Account Reference:</strong> {invoice.name}
                  </Typography>
                </Box>
              </Box>

              <TextField
                fullWidth
                label="Customer Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="0712345678 or +254712345678"
                required
                helperText="Enter the customer's registered M-Pesa phone number"
                sx={{ mb: 2 }}
              />
            </Box>
          )}

          {paymentMethod === 'bank' && (
            <Box sx={{ p: 3, bgcolor: 'purple.50', borderRadius: 2, border: '2px solid #7c3aed' }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#581c87', display: 'flex', alignItems: 'center', gap: 1 }}>
                🏦 Bank Transfer Payment
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Record a bank transfer or deposit payment. Customer must provide transaction details.
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Bank Details:</Typography>
                <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 1, border: '1px solid #e5e7eb' }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Bank Name:</strong> Demo Bank Ltd
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Account Name:</strong> PlayStation Digital System
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Account Number:</strong> 1234567890
                  </Typography>
                  <Typography variant="body2">
                    <strong>Branch:</strong> Main Branch
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  label="Bank Name"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Customer's bank"
                  required
                  helperText="Bank where transfer originated"
                />
                <TextField
                  fullWidth
                  label="Account Number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Customer's account"
                  required
                  helperText="Account that sent the money"
                />
              </Box>

              <Alert severity="warning" sx={{ mb: 2 }}>
                ⚠️ Verify bank details and transaction receipt before processing payment.
              </Alert>
            </Box>
          )}

          {/* Amount Field - Common to all methods */}
          <Box sx={{ mt: 2, p: 3, bgcolor: 'amber.50', borderRadius: 2, border: '2px solid #f59e0b' }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold', color: '#92400e' }}>
              💰 Payment Amount
            </Typography>
            <TextField
              fullWidth
              label="Amount (KES)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              inputProps={{
                min: 0,
                max: invoice.outstanding_amount || invoice.grand_total,
                step: 0.01
              }}
              required
              helperText={`Maximum: KES ${invoice.outstanding_amount || invoice.grand_total}`}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white',
                }
              }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Outstanding balance: KES {invoice.outstanding_amount || invoice.grand_total}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || amount <= 0}
        >
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} />
              Processing...
            </Box>
          ) : (
            'Process Payment'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
