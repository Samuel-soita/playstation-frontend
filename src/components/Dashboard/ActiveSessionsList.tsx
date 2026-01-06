import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Stop } from '@mui/icons-material';
import { apiService } from '@/services/api';
import { GameSession } from '@/types';
import { SessionTimer } from './SessionTimer';

interface ActiveSessionsListProps {
  onEndSession: (session: GameSession) => void;
  refreshTrigger?: number;
}

export const ActiveSessionsList = ({ onEndSession, refreshTrigger }: ActiveSessionsListProps) => {
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getActiveSessions();
      setSessions(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load active sessions');
      console.error('Error fetching active sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveSessions();
  }, [refreshTrigger]);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(fetchActiveSessions, 5000);
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

  if (sessions.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="body1" color="text.secondary">
          No active sessions
        </Typography>
      </Box>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 p-6">
      {sessions.map((session, index) => (
        <div
          key={session.name}
          className="group relative bg-gradient-to-br from-white via-red-50 to-pink-50 border-4 border-red-400 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-105 hover:-rotate-1 cursor-pointer overflow-hidden animate-fade-in min-h-[320px] flex flex-col justify-between"
          style={{
            animationDelay: `${index * 0.1}s`,
            background: 'linear-gradient(135deg, rgba(248, 113, 113, 0.1), rgba(251, 191, 36, 0.05))'
          }}
        >
          {/* Animated border effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-red-400 via-pink-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>

          {/* Hover glow effect */}
          <div className="absolute inset-0 rounded-3xl shadow-[0_0_60px_rgba(248,113,113,0.3)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Content */}
          <div className="relative z-10 flex-1">
            <div className="flex items-center justify-between mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl flex items-center justify-center text-2xl shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                🎮
              </div>
              <div className="px-4 py-2 bg-red-100 text-red-800 rounded-xl font-bold text-sm animate-pulse">
                ACTIVE
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">Game Space</p>
                <p className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-300">
                  {session.game_space_selected}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">Game</p>
                <p className="text-lg font-semibold text-gray-800 group-hover:text-pink-600 transition-colors duration-300">
                  {session.game_played}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">Started At</p>
                <p className="text-base text-gray-700">
                  {new Date(session.session_started_at).toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">Duration</p>
                <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-xl font-bold text-lg shadow-lg">
                  <SessionTimer startTime={session.session_started_at} />
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">Created By</p>
                <p className="text-base text-gray-700">{session.created_by}</p>
              </div>
            </div>
          </div>

          {/* End Session Button */}
          <div className="relative z-10 mt-6">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEndSession(session);
              }}
              className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 hover:from-red-600 hover:to-pink-700 hover:shadow-xl hover:scale-105 flex items-center justify-center gap-3"
            >
              <Stop className="w-6 h-6" />
              End Session
            </button>
          </div>

          {/* Floating particles effect */}
          <div className="absolute top-4 right-4 w-3 h-3 bg-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-ping"></div>
          <div className="absolute bottom-4 left-4 w-2 h-2 bg-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
          <div className="absolute top-1/2 left-6 w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-bounce" style={{ animationDelay: '0.6s' }}></div>
        </div>
      ))}
    </div>
  );
};
