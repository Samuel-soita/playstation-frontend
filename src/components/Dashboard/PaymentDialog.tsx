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
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'mpesa'>('cash');
  const [phoneNumber, setPhoneNumber] = useState('');
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

    if (paymentMethod === 'mpesa' && !phoneNumber) {
      setError('Phone number is required for M-Pesa payment');
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

        await apiService.payViaTinyPesa(formattedPhone, amount, invoice.name);
      } else {
        // Cash payment
        await apiService.createCashPayment({
          sales_invoice: invoice.name,
          amount: amount,
          game_space_id: '', // Not needed for cash payment
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
    setAmount(invoice?.outstanding_amount || invoice?.grand_total || 0);
    setPaymentMethod('cash');
    onClose();
  };

  if (!invoice) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Process Payment</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Invoice: {invoice.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Outstanding: KES {invoice.outstanding_amount || invoice.grand_total}
          </Typography>
        </Box>

        <Tabs
          value={paymentMethod}
          onChange={(_, newValue) => setPaymentMethod(newValue)}
          sx={{ mb: 3 }}
        >
          <Tab label="Cash" value="cash" />
          <Tab label="M-Pesa" value="mpesa" />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {paymentMethod === 'mpesa' && (
            <TextField
              fullWidth
              label="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="0712345678"
              required
            />
          )}

          <TextField
            fullWidth
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            inputProps={{ min: 0, max: invoice.outstanding_amount || invoice.grand_total }}
            required
          />
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
