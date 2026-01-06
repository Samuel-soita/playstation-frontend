import { Box, Card, CardContent, Typography, Chip, IconButton } from '@mui/material';
import { PlayArrow, Stop } from '@mui/icons-material';
import { GameSpace } from '@/types';
import * as styles from './GameSpaceCard.styles';

interface GameSpaceCardProps {
  gameSpace: GameSpace;
  onStartSession?: (gameSpace: GameSpace) => void;
  onEndSession?: (gameSpace: GameSpace) => void;
}

export const GameSpaceCard = ({ gameSpace, onStartSession, onEndSession }: GameSpaceCardProps) => {
  const isOccupied = gameSpace.occupied === 'Occupied';
  const playstationIcon = getPlaystationIcon(gameSpace.playstation_type);

  return (
    <Card sx={styles.card(isOccupied)}>
      <CardContent sx={styles.cardContent}>
        <Box sx={styles.header}>
          <Typography variant="h6" sx={styles.title}>
            {gameSpace.game_space_id}
          </Typography>
          <Chip
            label={gameSpace.occupied}
            color={isOccupied ? 'error' : 'success'}
            size="small"
            sx={styles.statusChip}
          />
        </Box>

        <Box sx={styles.details}>
          <Typography variant="body2" color="text.secondary" sx={styles.detailItem}>
            <strong>Type:</strong> {playstationIcon} {gameSpace.playstation_type || 'N/A'}
          </Typography>
          {gameSpace.tv_type && (
            <Typography variant="body2" color="text.secondary" sx={styles.detailItem}>
              <strong>TV:</strong> {gameSpace.tv_type}
            </Typography>
          )}
        </Box>

        <Box sx={styles.actions}>
          {!isOccupied ? (
            <IconButton
              color="primary"
              onClick={() => onStartSession?.(gameSpace)}
              sx={styles.actionButton}
              aria-label="Start session"
            >
              <PlayArrow />
            </IconButton>
          ) : (
            <IconButton
              color="error"
              onClick={() => onEndSession?.(gameSpace)}
              sx={styles.actionButton}
              aria-label="End session"
            >
              <Stop />
            </IconButton>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

function getPlaystationIcon(type?: string): string {
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
}
