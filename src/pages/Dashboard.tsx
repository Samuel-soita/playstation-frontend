import { useState } from 'react';
import {
  Snackbar,
  Alert,
  Dialog,
  DialogContent,
  CircularProgress,
  Box,
  Typography,
} from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import { Analytics, Games, PlayArrow, Receipt, LocationOn } from '@mui/icons-material';
import { apiService } from '@/services/api';
import { GameSpace, Game, GameSession } from '@/types';
import { GameSpaceGrid } from '@/components/Dashboard/GameSpaceGrid';
import { GameSelectionDialog } from '@/components/Dashboard/GameSelectionDialog';
import { ActiveSessionsList } from '@/components/Dashboard/ActiveSessionsList';
import { SalesInvoiceList } from '@/components/Dashboard/SalesInvoiceList';
import { AnalyticsCards } from '@/components/Dashboard/AnalyticsCards';
import { PaymentDialog } from '@/components/Dashboard/PaymentDialog';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { VideoBackground } from '@/components/VideoBackground';
import { ImageBackground } from '@/components/ImageBackground';
import { GameLibrary } from '@/components/GameLibrary';
import { GameSpaceManager } from '@/components/GameSpaceManager';
import { SalesInvoice } from '@/types';


export const Dashboard = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [gameSelectionOpen, setGameSelectionOpen] = useState(false);
  const [selectedGameSpace, setSelectedGameSpace] = useState<GameSpace | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<SalesInvoice | null>(null);

  const handleStartSession = (gameSpace: GameSpace) => {
    if (gameSpace.occupied === 'Occupied') {
      setSnackbar({
        open: true,
        message: 'This game space is already occupied',
        severity: 'error',
      });
      return;
    }
    setSelectedGameSpace(gameSpace);
    setGameSelectionOpen(true);
  };

  const handleGameSelect = async (game: Game) => {
    if (!selectedGameSpace) return;

    try {
      setLoading(true);
      
      // Follow exact backend flow: Update Game Space to "Occupied" FIRST
      await apiService.updateGameSpaceOccupancy(selectedGameSpace.game_space_id, 'Occupied');
      
      // THEN create the game session
      const sessionData = await apiService.createGameSession(selectedGameSpace.game_space_id, game.name);
      
      // Log the action (matching backend flow)
      try {
        await apiService.logCaffeAction(`Game Space ${sessionData.game_space} Occupied.`);
      } catch (err) {
        console.error('Failed to log action:', err);
      }
      
      setSnackbar({
        open: true,
        message: `Session started for ${sessionData.game_played} on ${sessionData.game_space}`,
        severity: 'success',
      });
      setRefreshTrigger((prev) => prev + 1);
      setGameSelectionOpen(false);
      setSelectedGameSpace(null);
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to start session',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEndSession = async (gameSpaceOrSession: GameSpace | GameSession) => {
    let gameSpaceId: string;
    
    if ('game_space_id' in gameSpaceOrSession) {
      // It's a GameSpace
      gameSpaceId = gameSpaceOrSession.game_space_id;
    } else {
      // It's a GameSession - game_space_selected is the Game Space document name
      // We need to fetch the Game Space to get game_space_id
      try {
        const gameSpace = await apiService.getDoc('Game Space', gameSpaceOrSession.game_space_selected);
        gameSpaceId = gameSpace.game_space_id;
      } catch (err) {
        // Fallback: try using the name directly if it's already the game_space_id
        gameSpaceId = gameSpaceOrSession.game_space_selected;
      }
    }

    try {
      setLoading(true);
      const invoiceName = await apiService.terminateGameSession(gameSpaceId);
      
      // Log the actions (matching backend flow)
      try {
        await apiService.logCaffeAction(`Sales Invoice ${invoiceName} created.`);
        await apiService.logCaffeAction(`Game Space ${gameSpaceId} Not Occupied.`);
      } catch (err) {
        console.error('Failed to log actions:', err);
      }
      
      setSnackbar({
        open: true,
        message: `Session ended. Invoice created: ${invoiceName}`,
        severity: 'success',
      });
      setRefreshTrigger((prev) => prev + 1);
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to end session',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col">
      {/* Navigation */}
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 bg-clip-text text-transparent mb-4 animate-pulse-glow">
            Welcome back, {user}!
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your gaming sessions, monitor active spaces, and track revenue
          </p>
        </div>

        {/* Tabs Section - Grouped by Categories */}
        <div className="bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50 border-4 border-yellow-300 rounded-3xl shadow-2xl overflow-hidden mb-8">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Gaming Operations */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-yellow-800 flex items-center gap-2">
                  🎮 Gaming Operations
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setTabValue(0)}
                    className={`w-full p-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                      tabValue === 0
                        ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-yellow-300/50'
                        : 'bg-white/80 hover:bg-yellow-100 text-gray-700 hover:text-yellow-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Analytics className="w-6 h-6" />
                      <div className="text-left">
                        <div className="font-bold">Overview</div>
                        <div className="text-xs opacity-80">Dashboard & Analytics</div>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => setTabValue(1)}
                    className={`w-full p-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                      tabValue === 1
                        ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-yellow-300/50'
                        : 'bg-white/80 hover:bg-yellow-100 text-gray-700 hover:text-yellow-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Games className="w-6 h-6" />
                      <div className="text-left">
                        <div className="font-bold">Game Spaces</div>
                        <div className="text-xs opacity-80">Manage Stations</div>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => setTabValue(2)}
                    className={`w-full p-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                      tabValue === 2
                        ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-yellow-300/50'
                        : 'bg-white/80 hover:bg-yellow-100 text-gray-700 hover:text-yellow-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <PlayArrow className="w-6 h-6" />
                      <div className="text-left">
                        <div className="font-bold">Active Sessions</div>
                        <div className="text-xs opacity-80">Live Sessions</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Financial Operations */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-yellow-800 flex items-center gap-2">
                  💰 Financial Operations
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setTabValue(3)}
                    className={`w-full p-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                      tabValue === 3
                        ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-yellow-300/50'
                        : 'bg-white/80 hover:bg-yellow-100 text-gray-700 hover:text-yellow-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Receipt className="w-6 h-6" />
                      <div className="text-left">
                        <div className="font-bold">Sales Invoices</div>
                        <div className="text-xs opacity-80">Payments & Billing</div>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => setTabValue(4)}
                    className={`w-full p-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                      tabValue === 4
                        ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-yellow-300/50'
                        : 'bg-white/80 hover:bg-yellow-100 text-gray-700 hover:text-yellow-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Receipt className="w-6 h-6" />
                      <div className="text-left">
                        <div className="font-bold">Payment History</div>
                        <div className="text-xs opacity-80">Transaction Logs</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Business Operations */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-yellow-800 flex items-center gap-2">
                  📊 Business Operations
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setTabValue(5)}
                    className={`w-full p-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                      tabValue === 5
                        ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-yellow-300/50'
                        : 'bg-white/80 hover:bg-yellow-100 text-gray-700 hover:text-yellow-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Analytics className="w-6 h-6" />
                      <div className="text-left">
                        <div className="font-bold">Reports</div>
                        <div className="text-xs opacity-80">Business Analytics</div>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => setTabValue(6)}
                    className={`w-full p-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                      tabValue === 6
                        ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-yellow-300/50'
                        : 'bg-white/80 hover:bg-yellow-100 text-gray-700 hover:text-yellow-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Games className="w-6 h-6" />
                      <div className="text-left">
                        <div className="font-bold">Game Library</div>
                        <div className="text-xs opacity-80">Available Games</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* System & Caffe Operations */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-yellow-800 flex items-center gap-2">
                  ⚙️ System & Caffe
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setTabValue(7)}
                    className={`w-full p-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                      tabValue === 7
                        ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-yellow-300/50'
                        : 'bg-white/80 hover:bg-yellow-100 text-gray-700 hover:text-yellow-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Analytics className="w-6 h-6" />
                      <div className="text-left">
                        <div className="font-bold">Caffe Dashboard</div>
                        <div className="text-xs opacity-80">Food & Beverage</div>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => setTabValue(8)}
                    className={`w-full p-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                      tabValue === 8
                        ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-yellow-300/50'
                        : 'bg-white/80 hover:bg-yellow-100 text-gray-700 hover:text-yellow-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Receipt className="w-6 h-6" />
                      <div className="text-left">
                        <div className="font-bold">System Settings</div>
                        <div className="text-xs opacity-80">Configuration</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Game Management */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-yellow-800 flex items-center gap-2">
                  🎯 Game Management
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setTabValue(9)}
                    className={`w-full p-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                      tabValue === 9
                        ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-yellow-300/50'
                        : 'bg-white/80 hover:bg-yellow-100 text-gray-700 hover:text-yellow-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <LocationOn className="w-6 h-6" />
                      <div className="text-left">
                        <div className="font-bold">Space Manager</div>
                        <div className="text-xs opacity-80">Station Config</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content with Hybrid Background System */}
        <ImageBackground
          variant="gaming"
          className="rounded-lg overflow-hidden"
          imageSrc="/assets/images/backgrounds/dashboard-bg.jpg"
        >
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 min-h-[600px]">
            {tabValue === 0 && (
              <VideoBackground
                src="/assets/videos/3d-gaming-scene.mp4"
                className="min-h-[500px] rounded-2xl overflow-hidden mb-6"
                opacity={0.7}
                blur={0}
              >
                <div className="p-6">
                  <div className="mb-4 pb-3 border-b border-white/20">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Today's Summary
                    </h2>
                    <p className="text-white/80 text-base">
                      Real-time analytics and revenue tracking
                    </p>
                  </div>
                  <AnalyticsCards refreshTrigger={refreshTrigger} />
                </div>
              </VideoBackground>
          )}

            {tabValue === 1 && (
              <VideoBackground
                src="/assets/videos/dashboard-background.mp4"
                className="min-h-[500px] rounded-2xl overflow-hidden mb-6"
                opacity={0.7}
                blur={0}
              >
                <div className="p-6">
                  <div className="mb-4 pb-3 border-b border-white/20">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Game Spaces
                    </h2>
                    <p className="text-white/80 text-base">
                      Manage and monitor all gaming stations
                    </p>
                  </div>
                  <GameSpaceGrid
                    onStartSession={handleStartSession}
                    onEndSession={handleEndSession}
                    refreshTrigger={refreshTrigger}
                  />
                </div>
              </VideoBackground>
          )}

            {tabValue === 2 && (
              <VideoBackground
                src="/assets/videos/3d-gaming-scene.mp4"
                className="min-h-[500px] rounded-2xl overflow-hidden mb-6"
                opacity={0.7}
                blur={0}
              >
                <div className="p-6">
                  <div className="mb-4 pb-3 border-b border-white/20">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Active Sessions
                    </h2>
                    <p className="text-white/80 text-base">
                      Monitor ongoing gaming sessions with live timers
                    </p>
                  </div>
                  <ActiveSessionsList
                    onEndSession={handleEndSession}
                    refreshTrigger={refreshTrigger}
                  />
                </div>
              </VideoBackground>
          )}

            {tabValue === 3 && (
              <VideoBackground
                src="/assets/videos/dashboard-background.mp4"
                className="min-h-[500px] rounded-2xl overflow-hidden mb-6"
                opacity={0.7}
                blur={0}
              >
                <div className="p-6">
                  <div className="mb-4 pb-3 border-b border-white/20">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Sales Invoices
                    </h2>
                    <p className="text-white/80 text-base">
                      View and process payments for completed sessions
                    </p>
                  </div>
                  <SalesInvoiceList
                    onPay={(invoice) => {
                      setSelectedInvoice(invoice);
                      setPaymentDialogOpen(true);
                    }}
                    refreshTrigger={refreshTrigger}
                  />
                </div>
              </VideoBackground>
          )}

            {tabValue === 4 && (
              <VideoBackground
                src="/assets/videos/caffe-management.mp4"
                className="min-h-[500px] rounded-2xl overflow-hidden mb-6"
                opacity={0.7}
                blur={0}
              >
                <div className="p-6">
                  <div className="mb-4 pb-3 border-b border-white/20">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Payment History
                    </h2>
                    <p className="text-white/80 text-base">
                      View and manage all payment transactions and history
                    </p>
                  </div>
                  <div className="text-center py-12">
                    <div className="text-5xl mb-4">💳</div>
                    <p className="text-white text-lg font-bold">Payment History Coming Soon</p>
                    <p className="text-white/70 mt-2">Detailed transaction logs and payment management</p>
                  </div>
                </div>
              </VideoBackground>
          )}

            {tabValue === 5 && (
              <VideoBackground
                src="/assets/videos/dashboard-background.mp4"
                className="min-h-[500px] rounded-2xl overflow-hidden mb-6"
                opacity={0.7}
                blur={0}
              >
                <div className="p-6">
                  <div className="mb-4 pb-3 border-b border-white/20">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Business Reports
                    </h2>
                    <p className="text-white/80 text-base">
                      Comprehensive analytics and business intelligence reports
                    </p>
                  </div>
                  <div className="text-center py-12">
                    <div className="text-5xl mb-4">📊</div>
                    <p className="text-white text-lg font-bold">Business Reports Coming Soon</p>
                    <p className="text-white/70 mt-2">Advanced analytics and reporting tools</p>
                  </div>
                </div>
              </VideoBackground>
          )}

            {tabValue === 6 && (
              <div className="bg-white/95 backdrop-blur-sm rounded-lg overflow-hidden">
                <GameLibrary />
              </div>
          )}

            {tabValue === 7 && (
              <VideoBackground
                src="/assets/videos/caffe-management.mp4"
                className="min-h-[500px] rounded-2xl overflow-hidden mb-6"
                opacity={0.7}
                blur={0}
              >
                <div className="p-6">
                  <div className="mb-4 pb-3 border-b border-white/20">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Caffe Dashboard
                    </h2>
                    <p className="text-white/80 text-base">
                      Manage food & beverage operations and sales
                    </p>
                  </div>
                  <div className="text-center py-12">
                    <div className="text-5xl mb-4">☕</div>
                    <p className="text-white text-lg font-bold">Caffe Management System</p>
                    <p className="text-white/70 mt-2">Food & beverage operations dashboard</p>
                  </div>
                </div>
              </VideoBackground>
          )}

            {tabValue === 8 && (
              <VideoBackground
                src="/assets/videos/dashboard-background.mp4"
                className="min-h-[500px] rounded-2xl overflow-hidden mb-6"
                opacity={0.7}
                blur={0}
              >
                <div className="p-6">
                  <div className="mb-4 pb-3 border-b border-white/20">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      System Settings
                    </h2>
                    <p className="text-white/80 text-base">
                      Configure system preferences and administrative settings
                    </p>
                  </div>
                  <div className="text-center py-12">
                    <div className="text-5xl mb-4">⚙️</div>
                    <p className="text-white text-lg font-bold">System Configuration</p>
                    <p className="text-white/70 mt-2">System settings and administration</p>
                  </div>
                </div>
              </VideoBackground>
            )}

            {tabValue === 9 && (
              <div className="bg-white/95 backdrop-blur-sm rounded-lg overflow-hidden">
                <GameSpaceManager />
              </div>
            )}
          </div>
        </ImageBackground>
      </main>

        {/* Dialogs */}
        <GameSelectionDialog
        open={gameSelectionOpen}
        onClose={() => {
          setGameSelectionOpen(false);
          setSelectedGameSpace(null);
        }}
        onSelect={handleGameSelect}
      />

      <PaymentDialog
        open={paymentDialogOpen}
        invoice={selectedInvoice}
        onClose={() => {
          setPaymentDialogOpen(false);
          setSelectedInvoice(null);
        }}
        onSuccess={() => {
          setRefreshTrigger((prev) => prev + 1);
          setSnackbar({
            open: true,
            message: 'Payment processed successfully',
            severity: 'success',
          });
        }}
      />

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

      {/* Footer */}
      <Footer />
    </div>
  );
};
