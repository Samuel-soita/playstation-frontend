import { useState, useEffect } from 'react';
import { CircularProgress, Alert } from '@mui/material';
import { Add, PlayArrow, Stop } from '@mui/icons-material';
import { apiService } from '@/services/api';
import { GameSpace } from '@/types';

interface CaffeFloorPlanProps {
  onStartSession: (gameSpace: GameSpace) => void;
  onEndSession: (gameSpace: GameSpace) => void;
  refreshTrigger?: number;
}

export const CaffeFloorPlan = ({ onStartSession, onEndSession, refreshTrigger }: CaffeFloorPlanProps) => {
  const [gameSpaces, setGameSpaces] = useState<GameSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGameSpaces = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getGameSpaces();
      setGameSpaces(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load game spaces');
      console.error('Error fetching game spaces:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGameSpaces();
  }, [refreshTrigger]);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(fetchGameSpaces, 10000);
    return () => clearInterval(interval);
  }, []);

  const getPlaystationIcon = (type?: string): string => {
    switch (type) {
      case 'PS5':
        return '🎮';
      case 'PS4':
        return '🎯';
      case 'PS3':
        return '🎲';
      default:
        return '🎮';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50 p-6 rounded-3xl border-4 border-yellow-300 shadow-2xl">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 bg-clip-text text-transparent mb-2 animate-pulse-glow">
            Café Floor Plan
          </h2>
          <p className="text-gray-700 font-medium">Manage your gaming stations and monitor occupancy</p>
        </div>
        <button
          onClick={() => {
            // TODO: Implement add game space dialog
            alert('Add Game Space feature coming soon!');
          }}
          className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white p-4 rounded-2xl hover:from-yellow-500 hover:to-amber-600 transition-all duration-300 hover:scale-110 hover:shadow-xl"
        >
          <Add className="w-6 h-6" />
        </button>
      </div>

      {gameSpaces.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border-2 border-gray-300">
          <div className="text-6xl mb-4">🎮</div>
          <p className="text-xl text-gray-500 font-semibold">No game spaces are set up yet.</p>
          <p className="text-gray-400 mt-2">Click the + button to add your first gaming station</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-6">
          {gameSpaces.map((space, index) => {
            const isOccupied = space.occupied === 'Occupied';
            return (
              <div
                key={space.name}
                className={`group relative rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-110 cursor-pointer overflow-hidden animate-fade-in min-h-[320px] flex flex-col justify-between ${
                  isOccupied
                    ? 'bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 border-4 border-red-400 hover:border-red-500'
                    : 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-4 border-green-400 hover:border-green-500'
                }`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  background: isOccupied
                    ? 'linear-gradient(135deg, rgba(248, 113, 113, 0.1), rgba(251, 191, 36, 0.05))'
                    : 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(251, 191, 36, 0.05))'
                }}
                onClick={() => {
                  if (isOccupied) {
                    onEndSession(space);
                  } else {
                    onStartSession(space);
                  }
                }}
              >
                {/* Animated border effect */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${
                  isOccupied ? 'from-red-400 via-pink-500 to-purple-500' : 'from-green-400 via-emerald-500 to-teal-500'
                } opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>

                {/* Hover glow effect */}
                <div className={`absolute inset-0 rounded-3xl shadow-[0_0_60px_${
                  isOccupied ? 'rgba(248,113,113,0.3)' : 'rgba(34,197,94,0.3)'
                }] opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                {/* Content */}
                <div className="relative z-10 text-center">
                  {/* Icon */}
                  <div className="mb-6 flex justify-center">
                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-xl transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 ${
                      isOccupied ? 'bg-gradient-to-br from-red-400 to-pink-500' : 'bg-gradient-to-br from-green-400 to-emerald-500'
                    }`}>
                      {getPlaystationIcon(space.playstation_type)}
                    </div>
                  </div>

                  {/* Station Info */}
                  <div className="space-y-3 mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-yellow-600 transition-colors duration-300">
                      Station {space.game_space_id}
                    </h3>

                    {space.playstation_type && (
                      <p className="text-lg font-semibold text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                        {space.playstation_type}
                      </p>
                    )}

                    {space.tv_type && (
                      <p className="text-base text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                        TV: {space.tv_type}
                      </p>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className={`inline-flex items-center px-6 py-3 rounded-2xl font-bold text-lg shadow-lg ${
                    isOccupied
                      ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                  }`}>
                    {isOccupied ? 'OCCUPIED' : 'AVAILABLE'}
                  </div>
                </div>

                {/* Action Button */}
                <div className="relative z-10 mt-6">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isOccupied) {
                        onEndSession(space);
                      } else {
                        onStartSession(space);
                      }
                    }}
                    className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center gap-3 ${
                      isOccupied
                        ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700'
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                    }`}
                  >
                    {isOccupied ? (
                      <>
                        <Stop className="w-6 h-6" />
                        End Session
                      </>
                    ) : (
                      <>
                        <PlayArrow className="w-6 h-6" />
                        Start Session
                      </>
                    )}
                  </button>
                </div>

                {/* Floating particles effect */}
                <div className={`absolute top-4 right-4 w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-ping ${
                  isOccupied ? 'bg-red-400' : 'bg-green-400'
                }`}></div>
                <div className={`absolute bottom-4 left-4 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse ${
                  isOccupied ? 'bg-pink-500' : 'bg-emerald-500'
                }`} style={{ animationDelay: '0.3s' }}></div>
                <div className={`absolute top-1/2 left-6 w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-bounce ${
                  isOccupied ? 'bg-purple-400' : 'bg-teal-400'
                }`} style={{ animationDelay: '0.6s' }}></div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
