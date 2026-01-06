import { useState, useEffect } from 'react';
import { Box, Grid, Typography, CircularProgress, Alert } from '@mui/material';
import { apiService } from '@/services/api';
import { GameSpace } from '@/types';
import { GameSpaceCard } from './GameSpaceCard';

interface GameSpaceGridProps {
  onStartSession: (gameSpace: GameSpace) => void;
  onEndSession: (gameSpace: GameSpace) => void;
  refreshTrigger?: number;
}

export const GameSpaceGrid = ({ onStartSession, onEndSession, refreshTrigger }: GameSpaceGridProps) => {
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

  // Auto-refresh every 15 seconds
  useEffect(() => {
    const interval = setInterval(fetchGameSpaces, 15000);
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

  if (gameSpaces.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="body1" color="text.secondary">
          No game spaces found
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {gameSpaces.map((space) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={space.name}>
          <GameSpaceCard
            gameSpace={space}
            onStartSession={onStartSession}
            onEndSession={onEndSession}
          />
        </Grid>
      ))}
    </Grid>
  );
};
