import { useState } from 'react';
import { useTheme, useMediaQuery, Snackbar, Alert, Dialog, DialogContent, CircularProgress, Box, Typography } from '@mui/material';
import { Payment, Receipt, Assessment, Close, SpaceDashboard, Settings } from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { CaffeFloorPlan } from '@/components/Dashboard/CaffeFloorPlan';
import { CaffeLogs } from '@/components/Dashboard/CaffeLogs';
import { CaffePayments } from '@/components/Caffe/CaffePayments';
import { CaffeTransactions } from '@/components/Caffe/CaffeTransactions';
import { CaffeCloseRegister } from '@/components/Caffe/CaffeCloseRegister';
import { CaffeWeeklyAnalysis } from '@/components/Caffe/CaffeWeeklyAnalysis';
import { GameSelectionDialog } from '@/components/Dashboard/GameSelectionDialog';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { VideoBackground } from '@/components/VideoBackground';
import { apiService } from '@/services/api';
import { GameSpace, Game, GameSession } from '@/types';

type CaffeSection = 'floor-plan' | 'payments' | 'transactions' | 'close-register' | 'weekly-analysis' | 'logs';

export const Caffe = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [activeSection, setActiveSection] = useState<CaffeSection>('floor-plan');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [gameSelectionOpen, setGameSelectionOpen] = useState(false);
  const [selectedGameSpace, setSelectedGameSpace] = useState<GameSpace | null>(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

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
      await apiService.updateGameSpaceOccupancy(selectedGameSpace.game_space_id, 'Occupied');
      const sessionData = await apiService.createGameSession(selectedGameSpace.game_space_id, game.name);
      
      await apiService.logCaffeAction(`Game Space ${sessionData.game_space} Occupied.`);
      
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
      gameSpaceId = gameSpaceOrSession.game_space_id;
    } else {
      try {
        const gameSpace = await apiService.getDoc('Game Space', gameSpaceOrSession.game_space_selected);
        gameSpaceId = gameSpace.game_space_id;
      } catch (err) {
        gameSpaceId = gameSpaceOrSession.game_space_selected;
      }
    }

    try {
      setLoading(true);
      const invoiceName = await apiService.terminateGameSession(gameSpaceId);
      
      await apiService.logCaffeAction(`Sales Invoice ${invoiceName} created.`);
      await apiService.logCaffeAction(`Game Space ${gameSpaceId} Not Occupied.`);
      
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


  const menuItems = [
    { id: 'floor-plan' as CaffeSection, label: 'Floor Plan', icon: <SpaceDashboard />, color: '#667eea' },
    { id: 'payments' as CaffeSection, label: 'Payments', icon: <Payment />, color: '#4caf50' },
    { id: 'transactions' as CaffeSection, label: 'Transactions', icon: <Receipt />, color: '#ff9800' },
    { id: 'close-register' as CaffeSection, label: 'Close Register', icon: <Close />, color: '#f44336' },
    { id: 'weekly-analysis' as CaffeSection, label: 'Weekly Analysis', icon: <Assessment />, color: '#9c27b0' },
    { id: 'logs' as CaffeSection, label: 'Action Logs', icon: <Settings />, color: '#2196f3' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'floor-plan':
        return (
          <CaffeFloorPlan
            onStartSession={handleStartSession}
            onEndSession={handleEndSession}
            refreshTrigger={refreshTrigger}
          />
        );
      case 'payments':
        return <CaffePayments refreshTrigger={refreshTrigger} onSuccess={() => setRefreshTrigger((prev) => prev + 1)} />;
      case 'transactions':
        return <CaffeTransactions refreshTrigger={refreshTrigger} />;
      case 'close-register':
        return <CaffeCloseRegister refreshTrigger={refreshTrigger} onSuccess={() => setRefreshTrigger((prev) => prev + 1)} />;
      case 'weekly-analysis':
        return <CaffeWeeklyAnalysis />;
      case 'logs':
        return <CaffeLogs refreshTrigger={refreshTrigger} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-background flex-col">
      {/* Navigation */}
      <Navigation />

      {/* Sidebar */}
      <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-70 bg-gradient-to-b from-yellow-50 via-amber-50 to-orange-50 border-r-4 border-yellow-300 shadow-2xl transition-transform duration-300 z-40 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } ${isMobile ? 'md:translate-x-0' : ''}`}>
        <div className="p-6 border-b-4 border-yellow-300 bg-gradient-to-r from-yellow-100 to-amber-100">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 via-yellow-700 to-amber-700 bg-clip-text text-transparent mb-2 animate-pulse-glow">
            ☕ Caffe Management
          </h2>
          <p className="text-sm text-yellow-800 font-medium">Operations & Tools</p>
        </div>
        <nav className="flex flex-col gap-2 p-4">
          {/* Operations Section */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-yellow-800 uppercase tracking-wide mb-4 px-3 py-2 bg-gradient-to-r from-yellow-200 to-amber-200 rounded-xl border border-yellow-300">
              ⚡ Core Operations
            </h3>
            <div className="space-y-2">
              {menuItems.slice(0, 3).map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    if (isMobile) setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-4 text-sm font-semibold transition-all duration-300 rounded-2xl hover:scale-105 hover:shadow-lg ${
                    activeSection === item.id
                      ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-yellow-300/50 border-2 border-yellow-300'
                      : 'bg-white/90 hover:bg-yellow-100 text-gray-700 hover:text-yellow-800 border-2 border-transparent hover:border-yellow-300'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    activeSection === item.id ? 'bg-white/20 scale-110' : 'bg-gradient-to-br from-yellow-200 to-amber-200'
                  }`}>
                    {item.icon}
                  </div>
                  <span className="text-left font-bold">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Management Section */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-yellow-800 uppercase tracking-wide mb-4 px-3 py-2 bg-gradient-to-r from-yellow-200 to-amber-200 rounded-xl border border-yellow-300">
              📊 Management Tools
            </h3>
            <div className="space-y-2">
              {menuItems.slice(3).map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    if (isMobile) setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-4 text-sm font-semibold transition-all duration-300 rounded-2xl hover:scale-105 hover:shadow-lg ${
                    activeSection === item.id
                      ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-yellow-300/50 border-2 border-yellow-300'
                      : 'bg-white/90 hover:bg-yellow-100 text-gray-700 hover:text-yellow-800 border-2 border-transparent hover:border-yellow-300'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    activeSection === item.id ? 'bg-white/20 scale-110' : 'bg-gradient-to-br from-yellow-200 to-amber-200'
                  }`}>
                    {item.icon}
                  </div>
                  <span className="text-left font-bold">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content with Video Background */}
      <VideoBackground
        src="/assets/videos/caffe-management.mp4"
        className={`flex-1 transition-all duration-300 ${sidebarOpen && !isMobile ? 'ml-70' : 'ml-0'} pt-20 min-h-screen`}
        opacity={0.7}
        blur={0}
      >
        <div className="px-6 flex flex-col min-h-screen">
          <div className="max-w-7xl mx-auto flex-grow">
            {renderContent()}
          </div>

          {/* Footer */}
          <Footer />
        </div>
      </VideoBackground>

      <GameSelectionDialog
        open={gameSelectionOpen}
        onClose={() => {
          setGameSelectionOpen(false);
          setSelectedGameSpace(null);
        }}
        onSelect={handleGameSelect}
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
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};
