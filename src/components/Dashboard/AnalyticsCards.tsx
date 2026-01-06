import { useState, useEffect } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import { AttachMoney, CheckCircle, Cancel, TrendingUp } from '@mui/icons-material';
import { apiService } from '@/services/api';
import { TodaysInvoicesSummary } from '@/types';

interface AnalyticsCardsProps {
  refreshTrigger?: number;
}

export const AnalyticsCards = ({ refreshTrigger }: AnalyticsCardsProps) => {
  const [summary, setSummary] = useState<TodaysInvoicesSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      const today = new Date().toISOString().split('T')[0];
      const data = await apiService.getTodaysInvoicesSummary(today);
      setSummary(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load summary');
      console.error('Error fetching summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [refreshTrigger]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchSummary, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
    }).format(amount);
  };

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

  if (!summary) {
    return null;
  }

  const cards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(summary.total_expected_revenue || 0),
      icon: <AttachMoney />,
      color: '#4caf50',
      bgColor: 'rgba(76, 175, 80, 0.1)',
    },
    {
      title: 'Total Paid',
      value: formatCurrency(summary.total_paid || 0),
      icon: <CheckCircle />,
      color: '#2196f3',
      bgColor: 'rgba(33, 150, 243, 0.1)',
    },
    {
      title: 'Total Unpaid',
      value: formatCurrency(summary.total_unpaid || 0),
      icon: <Cancel />,
      color: '#ff9800',
      bgColor: 'rgba(255, 152, 0, 0.1)',
    },
    {
      title: 'Total Sessions',
      value: summary.invoices?.length || 0,
      icon: <TrendingUp />,
      color: '#9c27b0',
      bgColor: 'rgba(156, 39, 176, 0.1)',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 p-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="group relative bg-gradient-to-br from-white via-yellow-50 to-amber-50 border-4 border-yellow-300 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-110 hover:rotate-1 cursor-pointer overflow-hidden animate-fade-in min-h-[280px] flex flex-col justify-center items-center"
          style={{
            animationDelay: `${index * 0.2}s`,
            background: `linear-gradient(135deg, ${card.bgColor}, rgba(251, 191, 36, 0.1))`
          }}
        >
          {/* Animated border effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>

          {/* Hover glow effect */}
          <div className="absolute inset-0 rounded-3xl shadow-[0_0_60px_rgba(251,191,36,0.3)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Content */}
          <div className="relative z-10 text-center">
            <div className="mb-6 flex justify-center">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl shadow-xl transition-all duration-500 group-hover:scale-125 group-hover:rotate-12"
                style={{
                  background: `linear-gradient(135deg, ${card.color}, ${card.color}dd)`,
                  color: 'white'
                }}
              >
                {card.icon}
              </div>
            </div>

            <h3 className="text-3xl md:text-4xl font-bold text-black mb-2 group-hover:text-yellow-600 transition-colors duration-300">
              {card.value}
            </h3>

            <p className="text-gray-700 font-semibold text-lg group-hover:text-black transition-colors duration-300">
              {card.title}
            </p>
          </div>

          {/* Floating particles effect */}
          <div className="absolute top-4 right-4 w-3 h-3 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-ping"></div>
          <div className="absolute bottom-4 left-4 w-2 h-2 bg-amber-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
          <div className="absolute top-1/2 left-6 w-1 h-1 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-bounce" style={{ animationDelay: '0.6s' }}></div>
        </div>
      ))}
    </div>
  );
};
