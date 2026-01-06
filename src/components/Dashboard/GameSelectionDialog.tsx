import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  CircularProgress,
  TextField,
  InputAdornment,
  Chip,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { apiService } from '@/services/api';
import { Game } from '@/types';
import * as styles from './GameSelectionDialog.styles';

interface GameSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (game: Game) => void;
}

export const GameSelectionDialog = ({ open, onClose, onSelect }: GameSelectionDialogProps) => {
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (open) {
      fetchGames();
    }
  }, [open]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = games.filter((game) =>
        game.name_of_the_game.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredGames(filtered);
    } else {
      setFilteredGames(games);
    }
  }, [searchTerm, games]);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const data = await apiService.getGames();
      setGames(data);
      setFilteredGames(data);
    } catch (err) {
      console.error('Error fetching games:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (game: Game) => {
    onSelect(game);
    onClose();
  };

  const formatPrice = (game: Game): string => {
    if (game.pricing_rate === 'Pay Per Game Minutes') {
      return `KES ${game.game_pricing || 0} per 15 min`;
    } else if (game.pricing_rate === 'Pay Per Hour') {
      return `KES ${game.rate_per_hour || 0}/hr`;
    } else if (game.pricing_rate === 'Pay Per 15 Minutes') {
      return `KES ${game.rate_per_hour || 0} per 15 min`;
    } else if (game.pricing_rate === 'Custom Pricing') {
      return `KES ${game.game_pricing || 0} per ${game.custom_duration || 'custom'}`;
    }
    return 'Price not set';
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Select a Game</DialogTitle>
      <DialogContent>
        <Box sx={styles.searchBox}>
          <TextField
            fullWidth
            placeholder="Search games..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2} sx={styles.grid}>
            {filteredGames.map((game) => (
              <Grid item xs={12} sm={6} md={4} key={game.name}>
                <Card sx={styles.gameCard} onClick={() => handleSelect(game)}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={game.image_qmdy || game.attach_image || '/placeholder-game.jpg'}
                    alt={game.name_of_the_game}
                    sx={styles.gameImage}
                  />
                  <CardContent>
                    <Typography variant="h6" component="div" sx={styles.gameName}>
                      {game.name_of_the_game}
                    </Typography>
                    <Box sx={styles.gameInfo}>
                      <Chip
                        label={game.pricing_rate}
                        size="small"
                        color="primary"
                        sx={styles.pricingChip}
                      />
                      <Typography variant="body2" color="text.secondary" sx={styles.price}>
                        {formatPrice(game)}
                      </Typography>
                    </Box>
                    <Button
                      fullWidth
                      variant="contained"
                      sx={styles.selectButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(game);
                      }}
                    >
                      Select
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {!loading && filteredGames.length === 0 && (
          <Box textAlign="center" py={4}>
            <Typography variant="body1" color="text.secondary">
              No games found
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};
