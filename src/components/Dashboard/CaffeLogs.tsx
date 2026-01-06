import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import { apiService } from '@/services/api';
import * as styles from './CaffeLogs.styles';

interface CaffeLogsProps {
  refreshTrigger?: number;
}

export const CaffeLogs = ({ refreshTrigger }: CaffeLogsProps) => {
  const [logs, setLogs] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      // Caffe is a single doctype, so we can get it directly
      const caffe = await apiService.getCaffe();
      setLogs(caffe.custom_custom_logs || 'No logs available');
    } catch (err: any) {
      setError(err.message || 'Failed to load logs');
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [refreshTrigger]);

  // Auto-refresh every 15 seconds
  useEffect(() => {
    const interval = setInterval(fetchLogs, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
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
    <Paper sx={styles.container}>
      <Typography variant="h6" gutterBottom>
        Action Logs
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={12}
        value={logs}
        InputProps={{
          readOnly: true,
          sx: styles.logInput,
        }}
        variant="outlined"
        placeholder="No logs available"
      />
    </Paper>
  );
};
