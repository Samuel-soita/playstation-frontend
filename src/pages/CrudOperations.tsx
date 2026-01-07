import React, { useState, useEffect, memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import { PlayArrow, Stop, Payment, Games, SpaceDashboard, Receipt, LocalCafe, Settings, ArrowForward, ArrowBack } from '@mui/icons-material';
import { apiService } from '@/services/api';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ImageBackground } from '@/components/ImageBackground';
import { useRealtime } from '@/hooks/useRealtime';
import {
  Game,
  GameSession,
  SalesInvoice,
  PaymentEntry,
  Customer,
  Company,
  Account,
  Item,
  MpesaTransaction,
  CaffeSettings,
  Caffe
} from '@/types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`crud-tabpanel-${index}`}
      aria-labelledby={`crud-tab-${index}`}
      aria-hidden={value !== index}
      {...other}
      className={`p-6 animate-fade-in ${value === index ? 'block' : 'hidden'}`}
    >
      {children}
    </div>
  );
}

export const CrudOperations = memo(() => {
  const navigate = useNavigate();
  const { gameSpaces, activeSessions, connectionStatus, initializeData, notifications } = useRealtime();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Game Session State
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGameSpace, setSelectedGameSpace] = useState('');
  const [selectedGame, setSelectedGame] = useState('');

  // Payment State
  const [salesInvoices, setSalesInvoices] = useState<SalesInvoice[]>([]);
  const [paymentDialog, setPaymentDialog] = useState<{
    open: boolean;
    invoice?: SalesInvoice;
    mode: 'cash' | 'mpesa' | 'bank';
  }>({ open: false, mode: 'cash' });
  const [paymentData, setPaymentData] = useState({
    amount: '',
    phoneNumber: '',
    bankName: '',
  });

  // Caffe State
  const [caffe, setCaffe] = useState<Caffe | null>(null);
  const [actionMessage, setActionMessage] = useState('');

  // Caffe Settings State
  const [caffeSettings, setCaffeSettings] = useState<CaffeSettings | null>(null);
  const [isAutomaticClosureEnabled, setIsAutomaticClosureEnabled] = useState(false);
  const [isBusinessClosed, setIsBusinessClosed] = useState(false);

  // M-Pesa State
  const [mpesaTransactions, setMpesaTransactions] = useState<MpesaTransaction[]>([]);
  const [transactionAccountNo, setTransactionAccountNo] = useState('');

  // Additional Doctypes State
  const [paymentEntries, setPaymentEntries] = useState<PaymentEntry[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [allGameSessions, setAllGameSessions] = useState<GameSession[]>([]);

  // Report State
  const [reportData, setReportData] = useState<any>(null);
  const [reportFilters, setReportFilters] = useState<Record<string, any>>({});


  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Navigation functions for interconnected tabs
  const navigateToTab = useCallback((tabIndex: number) => {
    setTabValue(tabIndex);
  }, []);

  const navigateToRelatedTabs = useCallback((currentTab: number) => {
    const relatedTabs: Record<number, number[]> = {
      0: [1, 2, 13], // Game Spaces -> Games, Sessions, All Sessions
      1: [0, 2], // Games -> Game Spaces, Sessions
      2: [0, 1, 3], // Sessions -> Game Spaces, Games, Invoices
      3: [4, 7, 8], // Invoices -> Payments, M-Pesa, Payment Entries
      4: [3, 7, 8], // Payments -> Invoices, M-Pesa, Payment Entries
      7: [3, 4, 8], // M-Pesa -> Invoices, Payments, Payment Entries
      8: [3, 4, 7], // Payment Entries -> Invoices, Payments, M-Pesa
      5: [6], // Caffe -> Caffe Settings
      6: [5], // Caffe Settings -> Caffe
      9: [10, 11, 12], // Customers -> Companies, Accounts, Items
      10: [9, 11, 12], // Companies -> Customers, Accounts, Items
      11: [9, 10, 12], // Accounts -> Customers, Companies, Items
      12: [9, 10, 11], // Items -> Customers, Companies, Accounts
      13: [0, 1, 2], // All Sessions -> Game Spaces, Games, Sessions
      14: [3, 4, 5], // Reports -> Invoices, Payments, Caffe
    };
    return relatedTabs[currentTab] || [];
  }, []);

  // Keyboard navigation for tabs
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const tabs = document.querySelectorAll('[role="tab"]');
    const currentIndex = Array.from(tabs).findIndex(tab => tab.getAttribute('aria-selected') === 'true');

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      const nextIndex = (currentIndex + 1) % tabs.length;
      const nextTab = tabs[nextIndex] as HTMLElement;
      nextTab.click();
      nextTab.focus();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      const prevIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
      const prevTab = tabs[prevIndex] as HTMLElement;
      prevTab.click();
      prevTab.focus();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [
        gameSpacesData,
        gamesData,
        sessionsData,
        invoicesData,
        caffeData,
        caffeSettingsData,
        automaticClosureData,
        businessClosedData,
        mpesaData,
        paymentEntriesData,
        customersData,
        companiesData,
        accountsData,
        itemsData,
        allSessionsData
      ] = await Promise.all([
        apiService.getGameSpaces(),
        apiService.getGames(),
        apiService.getActiveSessions(),
        apiService.getSalesInvoices(),
        apiService.getCaffe(),
        apiService.getCaffeSettings(),
        apiService.isAutomaticClosureEnabled(),
        apiService.isBusinessClosed(),
        apiService.getMpesaTransactions(),
        apiService.getPaymentEntries(),
        apiService.getCustomers(),
        apiService.getCompanies(),
        apiService.getAccounts(),
        apiService.getItems(),
        apiService.getAllGameSessions(),
      ]);

      setGames(gamesData);
      setSalesInvoices(invoicesData);
      setCaffe(caffeData);
      setCaffeSettings(caffeSettingsData);
      setIsAutomaticClosureEnabled(automaticClosureData);
      setIsBusinessClosed(businessClosedData);
      setMpesaTransactions(mpesaData);
      setPaymentEntries(paymentEntriesData);
      setCustomers(customersData);
      setCompanies(companiesData);
      setAccounts(accountsData);
      setItems(itemsData);
      setAllGameSessions(allSessionsData);

      // Initialize real-time data
      initializeData(gameSpacesData, sessionsData);
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Game Session Operations
  const handleCreateGameSession = async () => {
    if (!selectedGameSpace || !selectedGame) {
      showSnackbar('Please select both game space and game', 'error');
      return;
    }

    try {
      setLoading(true);
      const result = await apiService.createGameSession(selectedGameSpace, selectedGame);
      showSnackbar(`Game session created: ${result.game_session_name}`, 'success');
      loadInitialData(); // Refresh data
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to create game session', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTerminateGameSession = async (gameSpaceId: string) => {
    try {
      setLoading(true);
      const invoiceName = await apiService.terminateGameSession(gameSpaceId);
      showSnackbar(`Game session terminated. Invoice: ${invoiceName}`, 'success');
      loadInitialData(); // Refresh data
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to terminate game session', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Payment Operations
  const handlePayment = async () => {
    if (!paymentDialog.invoice) return;

    try {
      setLoading(true);
      let result;

      switch (paymentDialog.mode) {
        case 'cash':
          result = await apiService.createCashPayment({
            sales_invoice: paymentDialog.invoice.name,
            amount: parseFloat(paymentData.amount),
            game_space_id: '', // Could be extracted from invoice if needed
          });
          break;
        case 'mpesa':
          result = await apiService.createMpesaPayment({
            sales_invoice: paymentDialog.invoice.name,
            phone_number: paymentData.phoneNumber,
            amount: parseFloat(paymentData.amount),
            game_space_id: '',
          });
          break;
        case 'bank':
          result = await apiService.createBankPayment({
            sales_invoice: paymentDialog.invoice.name,
            bank_name: paymentData.bankName,
            amount: parseFloat(paymentData.amount),
            game_space_id: '',
          });
          break;
      }

      showSnackbar(`Payment created: ${result}`, 'success');
      setPaymentDialog({ open: false, mode: 'cash' });
      setPaymentData({ amount: '', phoneNumber: '', bankName: '' });
      loadInitialData();
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to process payment', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Caffe Operations
  const handleLogAction = async () => {
    if (!actionMessage) {
      showSnackbar('Please enter an action message', 'error');
      return;
    }

    try {
      setLoading(true);
      await apiService.logCaffeAction(actionMessage);
      showSnackbar('Action logged successfully', 'success');
      setActionMessage('');
      loadInitialData();
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to log action', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <ImageBackground variant="gaming" className="flex-1">
        <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 bg-clip-text text-transparent mb-4 animate-pulse-glow">
            ⚡ CRUD Operations Demo
          </h1>
          <p className="text-yellow-800 text-lg font-medium bg-yellow-50 px-6 py-3 rounded-2xl border-2 border-yellow-300 inline-block">
            Test all available backend operations for the PlayStation Digital System
          </p>

          {/* Real-time Status & Navigation */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            {/* Real-time Connection Status */}
            <div className="flex items-center gap-2 bg-white/90 px-4 py-2 rounded-xl border border-yellow-200">
              <div className={`w-3 h-3 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' :
                connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' :
                'bg-red-500'
              }`}></div>
              <span className="text-sm font-medium text-gray-700">
                Real-time: {connectionStatus}
              </span>
            </div>

            {/* Tab Navigation Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 hover:scale-105"
              >
                <ArrowBack className="w-4 h-4" />
                Dashboard
              </button>

              <button
                onClick={() => navigate('/caffe')}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg transition-all duration-200 hover:scale-105"
              >
                Caffe
                <ArrowForward className="w-4 h-4" />
              </button>
            </div>

            {/* Related Tabs Navigation */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Related:</span>
              {navigateToRelatedTabs(tabValue).slice(0, 3).map((relatedTabIndex) => {
                const tabLabels = [
                  "Game Spaces", "Games", "Sessions", "Invoices", "Payments",
                  "Caffe", "Caffe Settings", "M-Pesa", "Payment Entries", "Customers",
                  "Companies", "Accounts", "Items", "All Sessions", "Reports"
                ];
                return (
                  <button
                    key={relatedTabIndex}
                    onClick={() => navigateToTab(relatedTabIndex)}
                    className="px-3 py-1 text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-md transition-colors duration-200"
                  >
                    {tabLabels[relatedTabIndex]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Real-time Notifications */}
          {(notifications.payments.length > 0 || notifications.caffeActions.length > 0 || notifications.sessionEvents.length > 0) && (
            <div className="mt-4 p-4 bg-white/95 rounded-xl border border-yellow-200 max-w-4xl mx-auto">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Recent Activity:</h3>
              <div className="flex flex-wrap gap-2">
                {notifications.sessionEvents.slice(-2).map((event, idx) => (
                  <span key={idx} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    {event.type === 'created' ? '🎮' : '🏁'} Session {event.type}
                  </span>
                ))}
                {notifications.payments.slice(-2).map((payment, idx) => (
                  <span key={idx} className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    💰 {payment.method.toUpperCase()} Payment
                  </span>
                ))}
                {notifications.caffeActions.slice(-2).map((_, idx) => (
                  <span key={idx} className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                    ☕ Action logged
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Organized Tabs */}
        <div
          className="bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50 border-4 border-yellow-300 rounded-3xl shadow-2xl overflow-hidden mb-8"
          role="tablist"
          aria-label="CRUD Operations Navigation"
        >
          {/* Gaming Operations */}
          <div className="p-6 border-b-4 border-yellow-300 bg-gradient-to-r from-yellow-100 to-amber-100">
            <h3 className="text-lg font-bold text-yellow-800 uppercase tracking-wide mb-4 flex items-center gap-2">
              🎮 Gaming Operations
            </h3>
            <div className="flex overflow-x-auto scrollbar-hide gap-3">
              {[
                { icon: <SpaceDashboard className="w-5 h-5" />, label: "Game Spaces", value: 0, desc: "Stations" },
                { icon: <Games className="w-5 h-5" />, label: "Games", value: 1, desc: "Library" },
                { icon: <PlayArrow className="w-5 h-5" />, label: "Sessions", value: 2, desc: "Active" },
                { icon: <PlayArrow className="w-5 h-5" />, label: "All Sessions", value: 13, desc: "History" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setTabValue(tab.value)}
                  role="tab"
                  aria-selected={tabValue === tab.value}
                  aria-controls={`crud-tabpanel-${tab.value}`}
                  id={`crud-tab-${tab.value}`}
                  tabIndex={tabValue === tab.value ? 0 : -1}
                  className={`flex flex-col items-center gap-2 px-4 py-4 text-sm font-bold transition-all duration-300 rounded-2xl hover:scale-105 hover:shadow-lg min-w-max focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 ${
                    tabValue === tab.value
                      ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-yellow-300/50 border-2 border-yellow-300'
                      : 'bg-white/90 hover:bg-yellow-100 text-gray-700 hover:text-yellow-800 border-2 border-transparent hover:border-yellow-300'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    tabValue === tab.value ? 'bg-white/20 scale-110' : 'bg-gradient-to-br from-yellow-200 to-amber-200'
                  }`}>
                    {tab.icon}
                  </div>
                  <span>{tab.label}</span>
                  <span className="text-xs opacity-80">{tab.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Financial Operations */}
          <div className="p-6 border-b-4 border-yellow-300 bg-gradient-to-r from-yellow-100 to-amber-100">
            <h3 className="text-lg font-bold text-yellow-800 uppercase tracking-wide mb-4 flex items-center gap-2">
              💰 Financial Operations
            </h3>
            <div className="flex overflow-x-auto scrollbar-hide gap-3">
              {[
                { icon: <Receipt className="w-5 h-5" />, label: "Invoices", value: 3, desc: "Sales" },
                { icon: <Payment className="w-5 h-5" />, label: "Payments", value: 4, desc: "Entries" },
                { icon: <Receipt className="w-5 h-5" />, label: "Payment Entries", value: 8, desc: "Records" },
                { icon: <Payment className="w-5 h-5" />, label: "M-Pesa", value: 7, desc: "Mobile" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setTabValue(tab.value)}
                  role="tab"
                  aria-selected={tabValue === tab.value}
                  aria-controls={`crud-tabpanel-${tab.value}`}
                  id={`crud-tab-${tab.value}`}
                  tabIndex={tabValue === tab.value ? 0 : -1}
                  className={`flex flex-col items-center gap-2 px-4 py-4 text-sm font-bold transition-all duration-300 rounded-2xl hover:scale-105 hover:shadow-lg min-w-max focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 ${
                    tabValue === tab.value
                      ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-yellow-300/50 border-2 border-yellow-300'
                      : 'bg-white/90 hover:bg-yellow-100 text-gray-700 hover:text-yellow-800 border-2 border-transparent hover:border-yellow-300'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    tabValue === tab.value ? 'bg-white/20 scale-110' : 'bg-gradient-to-br from-yellow-200 to-amber-200'
                  }`}>
                    {tab.icon}
                  </div>
                  <span>{tab.label}</span>
                  <span className="text-xs opacity-80">{tab.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Business Management */}
          <div className="p-6 border-b-4 border-yellow-300 bg-gradient-to-r from-yellow-100 to-amber-100">
            <h3 className="text-lg font-bold text-yellow-800 uppercase tracking-wide mb-4 flex items-center gap-2">
              📊 Business Management
            </h3>
            <div className="flex overflow-x-auto scrollbar-hide gap-3">
              {[
                { icon: <Games className="w-5 h-5" />, label: "Customers", value: 9, desc: "Clients" },
                { icon: <Settings className="w-5 h-5" />, label: "Companies", value: 10, desc: "Business" },
                { icon: <Payment className="w-5 h-5" />, label: "Accounts", value: 11, desc: "Chart" },
                { icon: <Games className="w-5 h-5" />, label: "Items", value: 12, desc: "Products" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setTabValue(tab.value)}
                  role="tab"
                  aria-selected={tabValue === tab.value}
                  aria-controls={`crud-tabpanel-${tab.value}`}
                  id={`crud-tab-${tab.value}`}
                  tabIndex={tabValue === tab.value ? 0 : -1}
                  className={`flex flex-col items-center gap-2 px-4 py-4 text-sm font-bold transition-all duration-300 rounded-2xl hover:scale-105 hover:shadow-lg min-w-max focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 ${
                    tabValue === tab.value
                      ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-yellow-300/50 border-2 border-yellow-300'
                      : 'bg-white/90 hover:bg-yellow-100 text-gray-700 hover:text-yellow-800 border-2 border-transparent hover:border-yellow-300'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    tabValue === tab.value ? 'bg-white/20 scale-110' : 'bg-gradient-to-br from-yellow-200 to-amber-200'
                  }`}>
                    {tab.icon}
                  </div>
                  <span>{tab.label}</span>
                  <span className="text-xs opacity-80">{tab.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* System & Caffe */}
          <div className="p-6">
            <h3 className="text-lg font-bold text-yellow-800 uppercase tracking-wide mb-4 flex items-center gap-2">
              ⚙️ System & Caffe
            </h3>
            <div className="flex overflow-x-auto scrollbar-hide gap-3">
              {[
                { icon: <LocalCafe className="w-5 h-5" />, label: "Caffe", value: 5, desc: "Actions" },
                { icon: <Settings className="w-5 h-5" />, label: "Caffe Settings", value: 6, desc: "Config" },
                { icon: <Receipt className="w-5 h-5" />, label: "Reports", value: 14, desc: "Analytics" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setTabValue(tab.value)}
                  role="tab"
                  aria-selected={tabValue === tab.value}
                  aria-controls={`crud-tabpanel-${tab.value}`}
                  id={`crud-tab-${tab.value}`}
                  tabIndex={tabValue === tab.value ? 0 : -1}
                  className={`flex flex-col items-center gap-2 px-4 py-4 text-sm font-bold transition-all duration-300 rounded-2xl hover:scale-105 hover:shadow-lg min-w-max focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 ${
                    tabValue === tab.value
                      ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-yellow-300/50 border-2 border-yellow-300'
                      : 'bg-white/90 hover:bg-yellow-100 text-gray-700 hover:text-yellow-800 border-2 border-transparent hover:border-yellow-300'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    tabValue === tab.value ? 'bg-white/20 scale-110' : 'bg-gradient-to-br from-yellow-200 to-amber-200'
                  }`}>
                    {tab.icon}
                  </div>
                  <span>{tab.label}</span>
                  <span className="text-xs opacity-80">{tab.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

      {/* Game Spaces Tab */}
      <TabPanel value={tabValue} index={0}>
        <Typography variant="h5" gutterBottom>Game Spaces Operations</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Read operations for Game Spaces. These are typically created in the backend.
        </Typography>

        <Grid container spacing={4}>
          {gameSpaces.map((space) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={space.name}>
              <div className="card-hover bg-card border border-border rounded-xl p-6 shadow-elegant hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-3 text-foreground">{space.game_space_id}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-sm font-medium">Type:</span>
                      <span className="text-sm font-semibold">{space.playstation_type || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-sm font-medium">TV:</span>
                      <span className="text-sm font-semibold">{space.tv_type || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full ${
                    space.occupied === 'Occupied'
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : 'bg-green-100 text-green-800 border border-green-200'
                  }`}>
                    {space.occupied}
                  </span>
                </div>
              </div>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Games Tab */}
      <TabPanel value={tabValue} index={1}>
        <Typography variant="h5" gutterBottom>Games Operations</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Read operations for Games. These are typically created in the backend.
        </Typography>

        <Grid container spacing={4}>
          {games.map((game) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={game.name}>
              <div className="card-hover bg-card border border-border rounded-xl p-6 shadow-elegant hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-3 text-foreground">{game.name_of_the_game}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-sm font-medium">Pricing:</span>
                      <span className="text-sm font-semibold">{game.pricing_rate}</span>
                    </div>
                    {game.game_pricing && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-sm font-medium">Price:</span>
                        <span className="text-sm font-semibold text-green-600">{game.game_pricing} KES</span>
                      </div>
                    )}
                    {game.rate_per_hour && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-sm font-medium">Rate/Hour:</span>
                        <span className="text-sm font-semibold text-blue-600">{game.rate_per_hour} KES</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Game Sessions Tab */}
      <TabPanel value={tabValue} index={2}>
        <Typography variant="h5" gutterBottom>Game Sessions Operations</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Create and terminate game sessions, view active sessions.
        </Typography>

        {/* Quick Actions */}
        <div className="card-hover bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-6 shadow-elegant hover:shadow-lg transition-all duration-300">
          <h2 className="text-xl font-bold mb-4 text-foreground">🚀 Quick Start Gaming</h2>
          <p className="text-muted-foreground mb-4">
            Experience the complete gaming workflow with our guided session manager
          </p>
          <button
            onClick={() => navigate('/game-session-workflow')}
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg"
          >
            <span className="text-xl">🎯</span>
            Start Guided Gaming Session
          </button>
        </div>

        {/* Create Session Section */}
        <div className="card-hover bg-card border border-border rounded-xl p-6 mb-6 shadow-elegant hover:shadow-lg transition-all duration-300">
          <h2 className="text-xl font-bold mb-4 text-foreground">🎮 Create New Game Session (Advanced)</h2>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Game Space</InputLabel>
                <Select
                  value={selectedGameSpace}
                  onChange={(e) => setSelectedGameSpace(e.target.value)}
                  label="Game Space"
                >
                  {gameSpaces
                    .filter(space => space.occupied === 'Not Occupied')
                    .map((space) => (
                      <MenuItem key={space.name} value={space.game_space_id}>
                        {space.game_space_id} ({space.playstation_type})
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Game</InputLabel>
                <Select
                  value={selectedGame}
                  onChange={(e) => setSelectedGame(e.target.value)}
                  label="Game"
                >
                  {games.map((game) => (
                    <MenuItem key={game.name} value={game.name}>
                      {game.name_of_the_game}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Button
            variant="contained"
            onClick={handleCreateGameSession}
            disabled={loading}
            startIcon={<PlayArrow />}
          >
            Start Game Session
          </Button>
        </div>

        {/* Active Sessions Section */}
        <div className="card-hover bg-card border border-border rounded-xl p-6 shadow-elegant hover:shadow-lg transition-all duration-300">
          <h2 className="text-xl font-bold mb-4 text-foreground">⏰ Active Game Sessions</h2>
          {activeSessions.length === 0 ? (
            <Typography color="text.secondary">No active sessions</Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Game Space</TableCell>
                    <TableCell>Game</TableCell>
                    <TableCell>Started At</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activeSessions.map((session) => (
                    <TableRow key={session.name}>
                      <TableCell>{session.game_space_selected}</TableCell>
                      <TableCell>{session.game_played}</TableCell>
                      <TableCell>{new Date(session.session_started_at).toLocaleString()}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => {
                            const space = gameSpaces.find(s => s.name === session.game_space_selected);
                            if (space) handleTerminateGameSession(space.game_space_id);
                          }}
                          startIcon={<Stop />}
                        >
                          End Session
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      </TabPanel>

      {/* Sales Invoices Tab */}
      <TabPanel value={tabValue} index={3}>
        <Typography variant="h5" gutterBottom>Sales Invoices Operations</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Read operations for sales invoices created from terminated sessions.
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Invoice #</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {salesInvoices.map((invoice) => (
                <TableRow key={invoice.name}>
                  <TableCell>{invoice.name}</TableCell>
                  <TableCell>{invoice.customer}</TableCell>
                  <TableCell>{new Date(invoice.posting_date).toLocaleDateString()}</TableCell>
                  <TableCell>{invoice.grand_total} {invoice.currency}</TableCell>
                  <TableCell>
                    <Chip
                      label={invoice.status}
                      color={(invoice.outstanding_amount || 0) === 0 ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {(invoice.outstanding_amount || 0) > 0 && (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setPaymentDialog({ open: true, invoice, mode: 'cash' })}
                        startIcon={<Payment />}
                      >
                        Pay
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Payments Tab */}
      <TabPanel value={tabValue} index={4}>
        <Typography variant="h5" gutterBottom>Payment Operations</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Create payments for outstanding invoices (Cash, M-Pesa, Bank).
        </Typography>

        <Grid container spacing={4}>
          {salesInvoices
            .filter(invoice => (invoice.outstanding_amount || 0) > 0)
            .map((invoice) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={invoice.name}>
                <div className="card-hover bg-card border border-border rounded-xl p-6 shadow-elegant hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-3 text-foreground">Invoice {invoice.name}</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-sm font-medium">Outstanding:</span>
                        <span className="text-sm font-bold text-red-600">{invoice.outstanding_amount || 0} {invoice.currency}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-sm font-medium">Customer:</span>
                        <span className="text-sm font-semibold">{invoice.customer}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="flex-1 px-3 py-2 text-xs font-bold bg-green-100 hover:bg-green-200 text-green-800 rounded-lg transition-colors duration-200"
                      onClick={() => setPaymentDialog({ open: true, invoice, mode: 'cash' })}
                    >
                      💵 Cash
                    </button>
                    <button
                      className="flex-1 px-3 py-2 text-xs font-bold bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg transition-colors duration-200"
                      onClick={() => setPaymentDialog({ open: true, invoice, mode: 'mpesa' })}
                    >
                      📱 M-Pesa
                    </button>
                    <button
                      className="flex-1 px-3 py-2 text-xs font-bold bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-lg transition-colors duration-200"
                      onClick={() => setPaymentDialog({ open: true, invoice, mode: 'bank' })}
                    >
                      🏦 Bank
                    </button>
                  </div>
                </div>
              </Grid>
            ))}
        </Grid>
      </TabPanel>

      {/* Caffe Tab */}
      <TabPanel value={tabValue} index={5}>
        <Typography variant="h5" gutterBottom>Caffe Operations</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Read Caffe document and log actions.
        </Typography>

        {caffe && (
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <div className="card-hover bg-card border border-border rounded-xl p-6 shadow-elegant hover:shadow-lg transition-all duration-300">
                <h3 className="text-lg font-bold mb-4 text-foreground">☕ Caffe Settings</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm font-medium">Register Open:</span>
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                      caffe.custom_register_open
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {caffe.custom_register_open ? 'Yes' : 'No'}
                    </span>
                  </div>
                  {caffe.custom_custom_logs && (
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-2">Recent Logs:</h4>
                      <div className="max-h-40 overflow-auto bg-gray-50 p-3 rounded-lg border font-mono text-xs text-gray-700">
                        {caffe.custom_custom_logs.split('\n').slice(-5).map((log: string, index: number) => (
                          <div key={index} className="mb-1">{log}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Grid>

            <Grid item xs={12} md={6}>
              <div className="card-hover bg-card border border-border rounded-xl p-6 shadow-elegant hover:shadow-lg transition-all duration-300">
                <h3 className="text-lg font-bold mb-4 text-foreground">📝 Log Action</h3>
                <div className="space-y-4">
                  <textarea
                    className="w-full p-3 border border-border rounded-lg resize-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors"
                    rows={4}
                    placeholder="Enter action message..."
                    value={actionMessage}
                    onChange={(e) => setActionMessage(e.target.value)}
                  />
                  <button
                    className="w-full px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white font-bold rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleLogAction}
                    disabled={loading || !actionMessage}
                  >
                    {loading ? 'Logging...' : 'Log Action'}
                  </button>
                </div>
              </div>
            </Grid>
          </Grid>
        )}
      </TabPanel>

      {/* Caffe Settings Tab */}
      <TabPanel value={tabValue} index={6}>
        <Typography variant="h5" gutterBottom>Caffe Settings Operations</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Read Caffe Settings and check business status.
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <div className="card-hover bg-card border border-border rounded-xl p-6 shadow-elegant hover:shadow-lg transition-all duration-300">
              <h3 className="text-lg font-bold mb-4 text-foreground">🏪 Business Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm font-medium">Automatic Closure:</span>
                  <div className={`px-3 py-1 text-xs font-bold rounded-full ${
                    isAutomaticClosureEnabled
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {isAutomaticClosureEnabled ? 'Enabled' : 'Disabled'}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm font-medium">Business Status:</span>
                  <div className={`px-3 py-1 text-xs font-bold rounded-full ${
                    isBusinessClosed
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {isBusinessClosed ? 'Closed' : 'Open'}
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <span className="text-sm font-medium">Current Status:</span>
                  {isBusinessClosed ? (
                    <div className="flex items-center gap-2 text-red-600">
                      <span className="text-lg">❌</span>
                      <span className="font-semibold">Closed</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-green-600">
                      <span className="text-lg">✅</span>
                      <span className="font-semibold">Open</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Grid>

          {caffeSettings && (
            <Grid item xs={12} md={6}>
              <div className="card-hover bg-card border border-border rounded-xl p-6 shadow-elegant hover:shadow-lg transition-all duration-300">
                <h3 className="text-lg font-bold mb-4 text-foreground">⚙️ Settings Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm font-medium">Start Time:</span>
                    <span className="text-sm font-semibold">{caffeSettings.start_time || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm font-medium">End Time:</span>
                    <span className="text-sm font-semibold">{caffeSettings.end_time || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm font-medium">Auto Email Sales:</span>
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                      caffeSettings.auto_email_daily_sales_reports
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {caffeSettings.auto_email_daily_sales_reports ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm font-medium">Auto Email Logs:</span>
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                      caffeSettings.auto_email_daily_session_logs_reports
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {caffeSettings.auto_email_daily_session_logs_reports ? 'Yes' : 'No'}
                    </span>
                  </div>
                  {caffeSettings.specific_emails && (
                    <div className="pt-3 border-t border-border">
                      <div className="text-xs text-muted-foreground font-medium mb-1">Sales Recipients:</div>
                      <div className="text-sm font-semibold break-all">{caffeSettings.specific_emails}</div>
                    </div>
                  )}
                  {caffeSettings.specific_addresses && (
                    <div className="pt-3 border-t border-border">
                      <div className="text-xs text-muted-foreground font-medium mb-1">Log Recipients:</div>
                      <div className="text-sm font-semibold break-all">{caffeSettings.specific_addresses}</div>
                    </div>
                  )}
                </div>
              </div>
            </Grid>
          )}
        </Grid>
      </TabPanel>

      {/* M-Pesa Tab */}
      <TabPanel value={tabValue} index={7}>
        <Typography variant="h5" gutterBottom>M-Pesa Operations</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          View M-Pesa transactions and check transaction status.
        </Typography>

        {/* Check Transaction Status */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Check Transaction Status</Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Account Number (Invoice ID)"
                value={transactionAccountNo}
                onChange={(e) => setTransactionAccountNo(e.target.value)}
              />
            </Grid>
          </Grid>
          <Button
            variant="outlined"
            onClick={async () => {
              if (!transactionAccountNo) {
                showSnackbar('Please enter account number', 'error');
                return;
              }
              try {
                setLoading(true);
                await apiService.getMpesaTransactionStatus(transactionAccountNo);
                showSnackbar(`Status checked for ${transactionAccountNo}`, 'info');
                loadInitialData(); // Refresh transactions
              } catch (error: any) {
                showSnackbar(error.message || 'Failed to check status', 'error');
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
          >
            Check Status
          </Button>
        </Paper>

        {/* Transactions List */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>M-Pesa Transactions</Typography>
          {mpesaTransactions.length === 0 ? (
            <Typography color="text.secondary">No M-Pesa transactions found</Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Transaction ID</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Receipt</TableCell>
                    <TableCell>Created At</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mpesaTransactions.map((txn) => (
                    <TableRow key={txn.name}>
                      <TableCell>{txn.transaction_id}</TableCell>
                      <TableCell>{txn.amount}</TableCell>
                      <TableCell>{txn.msisdn}</TableCell>
                      <TableCell>
                        <Chip
                          label={txn.is_complete ? 'Complete' : 'Pending'}
                          color={txn.is_complete ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{txn.mpesa_receipt || 'N/A'}</TableCell>
                      <TableCell>{new Date(txn.created_at).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </TabPanel>

      {/* Payment Entries Tab */}
      <TabPanel value={tabValue} index={8}>
        <Typography variant="h5" gutterBottom>Payment Entries Operations</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Read operations for Payment Entries created from payments.
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Entry #</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Mode</TableCell>
                <TableCell>Party</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Reference</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paymentEntries.map((entry) => (
                <TableRow key={entry.name}>
                  <TableCell>{entry.name}</TableCell>
                  <TableCell>{entry.payment_type}</TableCell>
                  <TableCell>{entry.mode_of_payment}</TableCell>
                  <TableCell>{entry.party}</TableCell>
                  <TableCell>{entry.received_amount}</TableCell>
                  <TableCell>{entry.reference_name}</TableCell>
                  <TableCell>{new Date(entry.posting_date).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Customers Tab */}
      <TabPanel value={tabValue} index={9}>
        <Typography variant="h5" gutterBottom>Customers Operations</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Read operations for Customers.
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Customer Name</TableCell>
                <TableCell>Group</TableCell>
                <TableCell>Territory</TableCell>
                <TableCell>Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.name}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.customer_name}</TableCell>
                  <TableCell>{customer.customer_group}</TableCell>
                  <TableCell>{customer.territory}</TableCell>
                  <TableCell>{customer.customer_type}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Companies Tab */}
      <TabPanel value={tabValue} index={10}>
        <Typography variant="h5" gutterBottom>Companies Operations</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Read operations for Companies.
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Company Name</TableCell>
                <TableCell>Abbr</TableCell>
                <TableCell>Currency</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company.name}>
                  <TableCell>{company.name}</TableCell>
                  <TableCell>{company.company_name}</TableCell>
                  <TableCell>{company.abbr}</TableCell>
                  <TableCell>{company.default_currency}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Accounts Tab */}
      <TabPanel value={tabValue} index={11}>
        <Typography variant="h5" gutterBottom>Accounts Operations</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Read operations for Accounts.
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Account Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Group</TableCell>
                <TableCell>Company</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.name}>
                  <TableCell>{account.name}</TableCell>
                  <TableCell>{account.account_name}</TableCell>
                  <TableCell>{account.account_type}</TableCell>
                  <TableCell>{account.is_group ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{account.company}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Items Tab */}
      <TabPanel value={tabValue} index={12}>
        <Typography variant="h5" gutterBottom>Items Operations</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Read operations for Items (auto-created for sessions).
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Item Name</TableCell>
                <TableCell>Group</TableCell>
                <TableCell>UOM</TableCell>
                <TableCell>Stock Item</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.name}>
                  <TableCell>{item.item_code}</TableCell>
                  <TableCell>{item.item_name}</TableCell>
                  <TableCell>{item.item_group}</TableCell>
                  <TableCell>{item.stock_uom}</TableCell>
                  <TableCell>{item.is_stock_item ? 'Yes' : 'No'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* All Game Sessions Tab */}
      <TabPanel value={tabValue} index={13}>
        <Typography variant="h5" gutterBottom>All Game Sessions Operations</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Read operations for all Game Sessions (active and completed).
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Session #</TableCell>
                <TableCell>Game Space</TableCell>
                <TableCell>Game</TableCell>
                <TableCell>Started</TableCell>
                <TableCell>Ended</TableCell>
                <TableCell>Duration (min)</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allGameSessions.map((session) => (
                <TableRow key={session.name}>
                  <TableCell>{session.name}</TableCell>
                  <TableCell>{session.game_space_selected}</TableCell>
                  <TableCell>{session.game_played}</TableCell>
                  <TableCell>{new Date(session.session_started_at).toLocaleString()}</TableCell>
                  <TableCell>{session.session_ended_at ? new Date(session.session_ended_at).toLocaleString() : 'Active'}</TableCell>
                  <TableCell>{session.duration ? Math.round(session.duration / 60) : '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={session.docstatus === 0 ? 'Draft' : session.docstatus === 1 ? 'Submitted' : 'Cancelled'}
                      color={session.docstatus === 0 ? 'warning' : session.docstatus === 1 ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Reports Tab */}
      <TabPanel value={tabValue} index={14}>
        <Typography variant="h5" gutterBottom>Reports Operations</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Run reports and generate PDF reports.
        </Typography>

        {/* Today's Invoices Summary */}
        <div className="card-hover bg-card border border-border rounded-xl p-6 mb-6 shadow-elegant hover:shadow-lg transition-all duration-300">
          <h2 className="text-xl font-bold mb-4 text-foreground">📊 Today's Invoices Summary</h2>
          <Button
            variant="outlined"
            onClick={async () => {
              try {
                setLoading(true);
                const result = await apiService.getTodaysInvoicesSummary();
                setReportData(result);
                showSnackbar('Report generated successfully', 'success');
              } catch (error: any) {
                showSnackbar(error.message || 'Failed to generate report', 'error');
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
            sx={{ mb: 2 }}
          >
            Generate Today's Summary
          </Button>

          {reportData && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Summary:</Typography>
              <Typography>Total Unpaid: {reportData.total_unpaid}</Typography>
              <Typography>Total Paid: {reportData.total_paid}</Typography>
              <Typography>Total Expected: {reportData.total_expected}</Typography>

              <Typography variant="subtitle1" sx={{ mt: 2 }}>Invoices:</Typography>
              <TableContainer component={Paper} sx={{ mt: 1 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Invoice</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportData.invoices?.map((inv: any) => (
                      <TableRow key={inv.name}>
                        <TableCell>{inv.name}</TableCell>
                        <TableCell>{inv.status}</TableCell>
                        <TableCell>{inv.grand_total}</TableCell>
                        <TableCell>{inv.posting_date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </div>

        {/* Send PDF Report */}
        <div className="card-hover bg-card border border-border rounded-xl p-6 shadow-elegant hover:shadow-lg transition-all duration-300">
          <h2 className="text-xl font-bold mb-4 text-foreground">📧 Send PDF Report</h2>
          <TextField
            fullWidth
            label="Email Address"
            value={reportFilters.email || ''}
            onChange={(e) => setReportFilters({ ...reportFilters, email: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Report Title"
            value={reportFilters.title || ''}
            onChange={(e) => setReportFilters({ ...reportFilters, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            onClick={async () => {
              if (!reportFilters.email || !reportFilters.title) {
                showSnackbar('Please enter email and title', 'error');
                return;
              }

              const htmlContent = `
                <html>
                <body>
                  <h2>${reportFilters.title}</h2>
                  <p>Report generated on ${new Date().toLocaleDateString()}</p>
                  ${reportData ? `
                  <h3>Summary</h3>
                  <ul>
                    <li>Total Unpaid: ${reportData.total_unpaid}</li>
                    <li>Total Paid: ${reportData.total_paid}</li>
                    <li>Total Expected: ${reportData.total_expected}</li>
                  </ul>
                  ` : '<p>No report data available</p>'}
                </body>
                </html>
              `;

              try {
                setLoading(true);
                await apiService.sendTransactionReport(
                  reportFilters.email,
                  htmlContent,
                  reportFilters.title
                );
                showSnackbar('PDF report sent successfully', 'success');
              } catch (error: any) {
                showSnackbar(error.message || 'Failed to send report', 'error');
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
          >
            Send PDF Report
          </Button>
        </div>
      </TabPanel>

      {/* Payment Dialog */}
      <Dialog open={paymentDialog.open} onClose={() => setPaymentDialog({ open: false, mode: 'cash' })}>
        <DialogTitle>
          Process Payment - {paymentDialog.mode?.toUpperCase()}
        </DialogTitle>
        <DialogContent>
          {paymentDialog.invoice && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1">
                Invoice: {paymentDialog.invoice.name}
              </Typography>
              <Typography>
                    Outstanding: {paymentDialog.invoice.outstanding_amount || 0} {paymentDialog.invoice.currency}
              </Typography>
            </Box>
          )}

          <TextField
            fullWidth
            label="Amount"
            type="number"
            value={paymentData.amount}
            onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
            sx={{ mb: 2 }}
          />

          {paymentDialog.mode === 'mpesa' && (
            <TextField
              fullWidth
              label="Phone Number"
              value={paymentData.phoneNumber}
              onChange={(e) => setPaymentData({ ...paymentData, phoneNumber: e.target.value })}
              sx={{ mb: 2 }}
            />
          )}

          {paymentDialog.mode === 'bank' && (
            <TextField
              fullWidth
              label="Bank Name"
              value={paymentData.bankName}
              onChange={(e) => setPaymentData({ ...paymentData, bankName: e.target.value })}
              sx={{ mb: 2 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialog({ open: false, mode: 'cash' })}>
            Cancel
          </Button>
          <Button
            onClick={handlePayment}
            variant="contained"
            disabled={loading}
          >
            Process Payment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Loading Dialog */}
      {loading && (
        <Dialog open={loading}>
          <DialogContent>
            <Box display="flex" alignItems="center" gap={2}>
              <CircularProgress />
              <Typography>Processing...</Typography>
            </Box>
          </DialogContent>
        </Dialog>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Footer />
      </main>
    </ImageBackground>
    </div>
  );
});