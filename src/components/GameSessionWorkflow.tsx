import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Box,
  Grid,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Snackbar,
  Paper,
} from '@mui/material';
import {
  PlayArrow,
  Stop,
  Payment,
  AccessTime,
  LocationOn,
  VideogameAsset,
  ArrowBack,
} from '@mui/icons-material';
import { apiService } from '@/services/api';
import { useRealtime } from '@/hooks/useRealtime';
import { GameSpace, Game, GameSession } from '@/types';

interface GameSessionWorkflowProps {
  onComplete?: () => void;
  onBack?: () => void;
}

type WorkflowStep = 'select_space' | 'select_game' | 'start_session' | 'monitor_session' | 'end_session' | 'process_payment';

interface WorkflowState {
  currentStep: WorkflowStep;
  selectedSpace: GameSpace | null;
  selectedGame: Game | null;
  activeSession: GameSession | null;
  paymentProcessed: boolean;
  totalAmount: number;
}

const STEPS = [
  { key: 'select_space', label: 'Select Game Space', icon: <LocationOn /> },
  { key: 'select_game', label: 'Choose Game', icon: <VideogameAsset /> },
  { key: 'start_session', label: 'Start Session', icon: <PlayArrow /> },
  { key: 'monitor_session', label: 'Play Game', icon: <AccessTime /> },
  { key: 'end_session', label: 'End Session', icon: <Stop /> },
  { key: 'process_payment', label: 'Process Payment', icon: <Payment /> },
];

export const GameSessionWorkflow: React.FC<GameSessionWorkflowProps> = ({ onComplete, onBack }) => {
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'success' });

  const showSnackbar = useCallback((message: string, severity: 'success' | 'error' | 'info' = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const { gameSpaces, activeSessions, connectionStatus, notifications } = useRealtime();

  const [workflow, setWorkflow] = useState<WorkflowState>({
    currentStep: 'select_space',
    selectedSpace: null,
    selectedGame: null,
    activeSession: null,
    paymentProcessed: false,
    totalAmount: 0,
  });

  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);

  const [paymentDialog, setPaymentDialog] = useState({
    open: false,
    method: 'cash' as 'cash' | 'mpesa' | 'bank',
    amount: 0,
    phoneNumber: '',
    bankName: '',
    accountNumber: '',
  });


  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [gamesData, spacesData, activeSessionsData] = await Promise.all([
          apiService.getGames(),
          apiService.getGameSpaces(),
          apiService.getActiveSessions(),
        ]);
        setGames(gamesData);

        // Recover state if there's an active session
        if (activeSessionsData.length > 0) {
          // For now, take the first active session as the "recovered" session
          const session = activeSessionsData[0];
          const space = spacesData.find((s: any) => s.game_space_id === session.game_space_selected || s.name === session.game_space_selected);
          const game = gamesData.find((g: any) => g.name_of_the_game === session.game_played || g.name === session.game_played);

          if (session) {
            setWorkflow(prev => ({
              ...prev,
              activeSession: session,
              selectedSpace: space || null,
              selectedGame: game || null,
              currentStep: 'monitor_session'
            }));
            showSnackbar('Active session restored!', 'info');
          }
        }
      } catch (error: any) {
        showSnackbar(error.message || 'Failed to load data', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [showSnackbar]);

  // Real-time session updates
  useEffect(() => {
    if (workflow.activeSession && activeSessions.length > 0) {
      const currentSession = activeSessions.find(s => s.name === workflow.activeSession?.name);
      if (currentSession) {
        setWorkflow(prev => ({ ...prev, activeSession: currentSession }));
      } else {
        // Session ended
        setWorkflow(prev => ({
          ...prev,
          currentStep: 'process_payment',
          activeSession: null
        }));
      }
    }
  }, [activeSessions, workflow.activeSession]);

  // Real-time notifications
  useEffect(() => {
    if (notifications.sessionEvents.length > 0) {
      const latestEvent = notifications.sessionEvents[notifications.sessionEvents.length - 1];
      if (latestEvent.type === 'terminated' && workflow.activeSession) {
        showSnackbar('Session ended successfully! Ready for payment.', 'success');
      }
    }
  }, [notifications.sessionEvents, workflow.activeSession]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Step handlers
  const handleSpaceSelect = (space: GameSpace) => {
    setWorkflow(prev => ({
      ...prev,
      selectedSpace: space,
      currentStep: 'select_game'
    }));
  };

  const handleGameSelect = (game: Game) => {
    setWorkflow(prev => ({
      ...prev,
      selectedGame: game,
      currentStep: 'start_session'
    }));
  };

  const handleStartSession = async () => {
    if (!workflow.selectedSpace || !workflow.selectedGame) return;

    try {
      setLoading(true);
      await apiService.createGameSession(
        workflow.selectedSpace.game_space_id,
        workflow.selectedGame.name
      );

      // Find the created session
      const updatedSessions = await apiService.getActiveSessions();
      const newSession = updatedSessions.find((s: any) =>
        s.game_space_selected === workflow.selectedSpace?.name &&
        s.game_played === workflow.selectedGame?.name_of_the_game
      );

      if (newSession) {
        setWorkflow(prev => ({
          ...prev,
          activeSession: newSession,
          currentStep: 'monitor_session'
        }));
        showSnackbar(`Session started successfully!`, 'success');
      }
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to start session', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEndSession = async () => {
    if (!workflow.activeSession || !workflow.selectedSpace) return;

    try {
      setLoading(true);
      const invoiceId = await apiService.terminateGameSession(workflow.selectedSpace.game_space_id);

      // Get invoice details to calculate amount
      const invoices = await apiService.getSalesInvoices({ name: invoiceId });
      if (invoices.length > 0) {
        const invoice = invoices[0];
        setWorkflow(prev => ({
          ...prev,
          totalAmount: invoice.grand_total,
          currentStep: 'process_payment'
        }));
        setPaymentDialog(prev => ({ ...prev, amount: invoice.grand_total }));
        showSnackbar(`Session ended! Invoice: ${invoiceId}`, 'success');
      }
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to end session', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!paymentDialog.amount) return;

    try {
      setLoading(true);

      if (paymentDialog.method === 'cash') {
        await apiService.createCashPayment({
          sales_invoice: '', // We'll get this from the session
          amount: paymentDialog.amount,
          game_space_id: workflow.selectedSpace?.game_space_id || '',
        });
      } else if (paymentDialog.method === 'mpesa') {
        await apiService.createMpesaPayment({
          sales_invoice: '',
          phone_number: paymentDialog.phoneNumber,
          amount: paymentDialog.amount,
          game_space_id: workflow.selectedSpace?.game_space_id || '',
        });
      } else if (paymentDialog.method === 'bank') {
        await apiService.createBankPayment({
          sales_invoice: '',
          bank_name: paymentDialog.bankName,
          amount: paymentDialog.amount,
          game_space_id: workflow.selectedSpace?.game_space_id || '',
        });
      }

      setWorkflow(prev => ({ ...prev, paymentProcessed: true }));
      setPaymentDialog(prev => ({ ...prev, open: false }));
      showSnackbar('Payment processed successfully!', 'success');

      // Complete workflow
      if (onComplete) {
        setTimeout(() => {
          onComplete();
        }, 2000);
      }
    } catch (error: any) {
      showSnackbar(error.message || 'Payment failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (step: WorkflowStep) => STEPS.findIndex(s => s.key === step);

  const renderStepContent = () => {
    switch (workflow.currentStep) {
      case 'select_space':
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOn color="primary" />
              Select Available Game Space
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Choose an available game space to start your gaming session.
            </Typography>

            <Grid container spacing={3}>
              {gameSpaces
                .filter(space => space.occupied === 'Not Occupied')
                .map((space) => (
                  <Grid item xs={12} sm={6} md={4} key={space.name}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 4,
                          borderColor: 'primary.main',
                        },
                      }}
                      onClick={() => handleSpaceSelect(space)}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <VideogameAsset color="primary" />
                          <Typography variant="h6">{space.game_space_id}</Typography>
                          <Chip
                            label="Available"
                            color="success"
                            size="small"
                            sx={{ ml: 'auto' }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Type: {space.playstation_type}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          TV: {space.tv_type}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>

            {gameSpaces.filter(space => space.occupied === 'Not Occupied').length === 0 && (
              <Alert severity="info" sx={{ mt: 3 }}>
                No game spaces are currently available. Please wait or check back later.
              </Alert>
            )}
          </Box>
        );

      case 'select_game':
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <VideogameAsset color="primary" />
              Choose Your Game
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Select the game you want to play on {workflow.selectedSpace?.game_space_id}.
            </Typography>

            <Grid container spacing={3}>
              {games.map((game) => (
                <Grid item xs={12} sm={6} md={4} key={game.name}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                        borderColor: 'primary.main',
                      },
                    }}
                    onClick={() => handleGameSelect(game)}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {game.name_of_the_game}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <Chip
                          label={`Rate: ${game.pricing_rate}`}
                          size="small"
                          color="primary"
                        />
                        {game.game_pricing && (
                          <Chip
                            label={`₭${game.game_pricing}`}
                            size="small"
                            color="secondary"
                          />
                        )}
                      </Box>
                      {game.rate_per_hour && (
                        <Typography variant="body2" color="text.secondary">
                          Hourly Rate: ₭{game.rate_per_hour}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      case 'start_session':
        return (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <PlayArrow color="primary" fontSize="large" />
              Ready to Start Your Session
            </Typography>

            <Paper sx={{ p: 4, mb: 3, background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white' }}>
              <Typography variant="h5" gutterBottom>
                Session Summary
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Game Space</Typography>
                  <Typography variant="h6">{workflow.selectedSpace?.game_space_id}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Game</Typography>
                  <Typography variant="h6">{workflow.selectedGame?.name_of_the_game}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Pricing</Typography>
                  <Typography variant="h6">{workflow.selectedGame?.pricing_rate}</Typography>
                </Grid>
              </Grid>
            </Paper>

            <Button
              variant="contained"
              size="large"
              onClick={handleStartSession}
              disabled={loading}
              sx={{
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Start Gaming Session'}
            </Button>
          </Box>
        );

      case 'monitor_session':
        const session = workflow.activeSession;
        if (!session) return null;

        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTime color="primary" />
              Session in Progress
            </Typography>

            <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' }}>
              <Typography variant="h5" gutterBottom>
                🎮 Gaming Session Active
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Game Space</Typography>
                  <Typography variant="h6">{session.game_space_selected}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Game</Typography>
                  <Typography variant="h6">{session.game_played}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Started At</Typography>
                  <Typography variant="h6">{new Date(session.session_started_at).toLocaleString()}</Typography>
                </Grid>
              </Grid>
            </Paper>

            <Alert severity="info" sx={{ mb: 3 }}>
              Your gaming session is active. The game space is now occupied and billing is in progress.
            </Alert>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="error"
                size="large"
                onClick={handleEndSession}
                disabled={loading}
                startIcon={<Stop />}
                sx={{ px: 4, py: 2 }}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : 'End Session & Process Payment'}
              </Button>
            </Box>
          </Box>
        );

      case 'process_payment':
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Payment color="primary" />
              Process Payment
            </Typography>

            <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white' }}>
              <Typography variant="h5" gutterBottom>
                💰 Payment Required
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', my: 2 }}>
                ₭{workflow.totalAmount.toFixed(2)}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, textAlign: 'center' }}>
                Total amount for your gaming session
              </Typography>
            </Paper>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              {[
                { method: 'cash', label: '💵 Cash', color: '#16a34a' },
                { method: 'mpesa', label: '📱 M-Pesa', color: '#2563eb' },
                { method: 'bank', label: '🏦 Bank', color: '#7c3aed' },
              ].map(({ method, label, color }) => (
                <Button
                  key={method}
                  variant="contained"
                  size="large"
                  onClick={() => setPaymentDialog(prev => ({ ...prev, open: true, method: method as any }))}
                  sx={{
                    backgroundColor: color,
                    '&:hover': { backgroundColor: color, opacity: 0.9 },
                    px: 3,
                    py: 2,
                  }}
                >
                  {label}
                </Button>
              ))}
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          {onBack && (
            <Button
              variant="outlined"
              onClick={onBack}
              startIcon={<ArrowBack />}
              sx={{ minWidth: 'auto' }}
            >
              Back
            </Button>
          )}
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom sx={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold'
            }}>
              🎮 Game Session Workflow
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Complete gaming experience from space allocation to payment processing
            </Typography>
          </Box>
        </Box>

        {/* Connection Status */}
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <Box sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: connectionStatus === 'connected' ? '#10b981' :
              connectionStatus === 'connecting' ? '#f59e0b' : '#ef4444'
          }} />
          <Typography variant="body2" color="text.secondary">
            Real-time: {connectionStatus}
          </Typography>
        </Box>
      </Box>

      {/* Stepper */}
      <Stepper activeStep={getStepIndex(workflow.currentStep)} sx={{ mb: 4 }}>
        {STEPS.map((step, index) => (
          <Step key={step.key} completed={getStepIndex(workflow.currentStep) > index}>
            <StepLabel
              StepIconComponent={() => (
                <Box sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: getStepIndex(workflow.currentStep) > index ? '#10b981' :
                    getStepIndex(workflow.currentStep) === index ? '#f59e0b' : '#e5e7eb',
                  color: 'white',
                }}>
                  {step.icon}
                </Box>
              )}
            >
              <Typography variant="body2" sx={{ mt: 1, fontWeight: 'medium' }}>
                {step.label}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Step Content */}
      <Card sx={{ minHeight: 400 }}>
        <CardContent sx={{ p: 4 }}>
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={paymentDialog.open} onClose={() => setPaymentDialog(prev => ({ ...prev, open: false }))}>
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: 'white'
        }}>
          💰 Process Payment - ₭{paymentDialog.amount.toFixed(2)}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {paymentDialog.method === 'mpesa' && (
            <TextField
              fullWidth
              label="Phone Number"
              value={paymentDialog.phoneNumber}
              onChange={(e) => setPaymentDialog(prev => ({ ...prev, phoneNumber: e.target.value }))}
              placeholder="0712345678"
              sx={{ mb: 2 }}
            />
          )}

          {paymentDialog.method === 'bank' && (
            <>
              <TextField
                fullWidth
                label="Bank Name"
                value={paymentDialog.bankName}
                onChange={(e) => setPaymentDialog(prev => ({ ...prev, bankName: e.target.value }))}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Account Number"
                value={paymentDialog.accountNumber}
                onChange={(e) => setPaymentDialog(prev => ({ ...prev, accountNumber: e.target.value }))}
                sx={{ mb: 2 }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialog(prev => ({ ...prev, open: false }))}>
            Cancel
          </Button>
          <Button
            onClick={handlePayment}
            variant="contained"
            disabled={loading}
            sx={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
              }
            }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : `Pay with ${paymentDialog.method.toUpperCase()}`}
          </Button>
        </DialogActions>
      </Dialog>

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
    </Box>
  );
};