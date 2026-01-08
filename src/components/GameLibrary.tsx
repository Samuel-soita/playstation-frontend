import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Grid,
  TextField,
  InputAdornment,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  Snackbar,
  CircularProgress,
  Tooltip,
  IconButton,
  Paper,
} from '@mui/material';
import {
  Add,
  Search,
  Edit,
  Delete,
  Games,
  AttachMoney,
  AccessTime,
  Image,
  Clear,
} from '@mui/icons-material';
import { apiService } from '@/services/api';
import { Game } from '@/types';

interface GameFormData {
  name_of_the_game: string;
  pricing_rate: 'Pay Per Game Minutes' | 'Pay Per Hour' | 'Custom Pricing' | 'Pay Per 15 Minutes';
  game_pricing?: number;
  rate_per_hour?: number;
  custom_duration?: string;
  attach_image?: string;
  image_qmdy?: string;
}

const PRICING_OPTIONS = [
  'Pay Per Game Minutes',
  'Pay Per Hour',
  'Custom Pricing',
  'Pay Per 15 Minutes'
];

export const GameLibrary: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPricing, setFilterPricing] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'success' });

  const [formData, setFormData] = useState<GameFormData>({
    name_of_the_game: '',
    pricing_rate: 'Pay Per Hour',
    game_pricing: undefined,
    rate_per_hour: undefined,
    custom_duration: '',
    attach_image: '',
    image_qmdy: '',
  });

  // Load games data
  const loadGames = useCallback(async () => {
    try {
      setLoading(true);
      const gamesData = await apiService.getGames();
      setGames(gamesData);
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to load games', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGames();
  }, [loadGames]);

  const showSnackbar = useCallback((message: string, severity: 'success' | 'error' | 'info' = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  // Filter games based on search and pricing
  const filteredGames = games.filter(game => {
    const matchesSearch = game.name_of_the_game.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPricing = filterPricing === 'all' || game.pricing_rate === filterPricing;
    return matchesSearch && matchesPricing;
  });

  const handleOpenDialog = (game?: Game) => {
    if (game) {
      setEditingGame(game);
      setFormData({
        name_of_the_game: game.name_of_the_game,
        pricing_rate: game.pricing_rate,
        game_pricing: game.game_pricing,
        rate_per_hour: game.rate_per_hour,
        custom_duration: game.custom_duration || '',
        attach_image: game.attach_image || '',
        image_qmdy: game.image_qmdy || '',
      });
    } else {
      setEditingGame(null);
      setFormData({
        name_of_the_game: '',
        pricing_rate: 'Pay Per Hour',
        game_pricing: undefined,
        rate_per_hour: undefined,
        custom_duration: '',
        attach_image: '',
        image_qmdy: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingGame(null);
    setFormData({
      name_of_the_game: '',
      pricing_rate: 'Pay Per Hour',
      game_pricing: undefined,
      rate_per_hour: undefined,
      custom_duration: '',
      attach_image: '',
      image_qmdy: '',
    });
  };

  const handleSaveGame = async () => {
    if (!formData.name_of_the_game.trim()) {
      showSnackbar('Game name is required', 'error');
      return;
    }

    try {
      setLoading(true);

      if (editingGame) {
        // Update existing game
        await apiService.saveDoc('Games', {
          ...editingGame,
          ...formData,
        });
        showSnackbar('Game updated successfully', 'success');
      } else {
        // Create new game
        await apiService.saveDoc('Games', {
          doctype: 'Games',
          ...formData,
        });
        showSnackbar('Game added successfully', 'success');
      }

      handleCloseDialog();
      loadGames();
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to save game', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGame = async (game: Game) => {
    if (!window.confirm(`Are you sure you want to delete "${game.name_of_the_game}"?`)) {
      return;
    }

    try {
      setLoading(true);
      await apiService.deleteDoc('Games', game.name);
      showSnackbar('Game deleted successfully', 'success');
      loadGames();
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to delete game', 'error');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterPricing('all');
  };

  const getPricingDisplay = (game: Game) => {
    switch (game.pricing_rate) {
      case 'Pay Per Game Minutes':
        return game.game_pricing ? `₭${game.game_pricing}/15min` : 'N/A';
      case 'Pay Per Hour':
        return game.rate_per_hour ? `₭${game.rate_per_hour}/hour` : 'N/A';
      case 'Custom Pricing':
        return game.rate_per_hour ? `₭${game.rate_per_hour}/custom` : 'N/A';
      case 'Pay Per 15 Minutes':
        return game.rate_per_hour ? `₭${game.rate_per_hour}/15min` : 'N/A';
      default:
        return 'N/A';
    }
  };

  if (loading && games.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress size={60} sx={{ color: '#f59e0b' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}>
            🎮 Game Library Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your gaming collection with comprehensive pricing and configuration options
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
            }
          }}
        >
          Add New Game
        </Button>
      </Box>

      {/* Filters and Search */}
      <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
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
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Filter by Pricing</InputLabel>
              <Select
                value={filterPricing}
                onChange={(e) => setFilterPricing(e.target.value)}
                label="Filter by Pricing"
              >
                <MenuItem value="all">All Pricing Types</MenuItem>
                {PRICING_OPTIONS.map(option => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                icon={<Games />}
                label={`${filteredGames.length} Games`}
                color="primary"
                variant="outlined"
              />
              <Button
                startIcon={<Clear />}
                onClick={clearFilters}
                disabled={!searchTerm && filterPricing === 'all'}
              >
                Clear Filters
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Games Grid */}
      <Grid container spacing={3}>
        {filteredGames.map((game) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={game.name}>
            <Card sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6,
                borderColor: '#f59e0b',
              }
            }}>
              <CardHeader
                title={
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {game.name_of_the_game}
                  </Typography>
                }
                subheader={
                  <Chip
                    label={game.pricing_rate}
                    size="small"
                    color="secondary"
                    sx={{ mb: 1 }}
                  />
                }
                action={
                  <Box>
                    <Tooltip title="Edit Game">
                      <IconButton onClick={() => handleOpenDialog(game)} size="small">
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Game">
                      <IconButton
                        onClick={() => handleDeleteGame(game)}
                        size="small"
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
              />

              <CardContent sx={{ flex: 1 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <AttachMoney fontSize="small" />
                    Pricing: <strong>{getPricingDisplay(game)}</strong>
                  </Typography>

                  {game.custom_duration && (
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTime fontSize="small" />
                      Duration: {game.custom_duration}
                    </Typography>
                  )}
                </Box>

                {game.attach_image && (
                  <Box sx={{
                    mt: 2,
                    height: 120,
                    backgroundColor: '#f5f5f5',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px dashed #ddd'
                  }}>
                    <Image sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Game Image
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredGames.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Games sx={{ fontSize: 80, color: '#ddd', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {games.length === 0 ? 'No games in library' : 'No games match your filters'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {games.length === 0 ? 'Add your first game to get started!' : 'Try adjusting your search or filters.'}
          </Typography>
          {games.length === 0 && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
              sx={{
                mt: 3,
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                }
              }}
            >
              Add First Game
            </Button>
          )}
        </Box>
      )}

      {/* Game Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: 'white'
        }}>
          {editingGame ? 'Edit Game' : 'Add New Game'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Game Name"
                value={formData.name_of_the_game}
                onChange={(e) => setFormData(prev => ({ ...prev, name_of_the_game: e.target.value }))}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Pricing Rate</InputLabel>
                <Select
                  value={formData.pricing_rate}
                  onChange={(e) => setFormData(prev => ({ ...prev, pricing_rate: e.target.value as any }))}
                  label="Pricing Rate"
                >
                  {PRICING_OPTIONS.map(option => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {(formData.pricing_rate === 'Pay Per Game Minutes' || formData.pricing_rate === 'Pay Per Hour') && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={formData.pricing_rate === 'Pay Per Game Minutes' ? 'Price per 15 minutes' : 'Rate per hour'}
                  type="number"
                  value={formData.pricing_rate === 'Pay Per Game Minutes' ? formData.game_pricing || '' : formData.rate_per_hour || ''}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || undefined;
                    if (formData.pricing_rate === 'Pay Per Game Minutes') {
                      setFormData(prev => ({ ...prev, game_pricing: value }));
                    } else {
                      setFormData(prev => ({ ...prev, rate_per_hour: value }));
                    }
                  }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₭</InputAdornment>,
                  }}
                />
              </Grid>
            )}

            {formData.pricing_rate === 'Custom Pricing' && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Custom Duration"
                    value={formData.custom_duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, custom_duration: e.target.value }))}
                    placeholder="e.g., 30 Minutes, 1 Hour"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Rate per Custom Duration"
                    type="number"
                    value={formData.rate_per_hour || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, rate_per_hour: parseFloat(e.target.value) || undefined }))}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₭</InputAdornment>,
                    }}
                  />
                </Grid>
              </>
            )}

            {formData.pricing_rate === 'Pay Per 15 Minutes' && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Rate per 15 minutes"
                  type="number"
                  value={formData.rate_per_hour || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, rate_per_hour: parseFloat(e.target.value) || undefined }))}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₭</InputAdornment>,
                  }}
                />
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Image URL (Optional)"
                value={formData.attach_image}
                onChange={(e) => setFormData(prev => ({ ...prev, attach_image: e.target.value }))}
                placeholder="https://example.com/game-image.jpg"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Image Description (Optional)"
                value={formData.image_qmdy}
                onChange={(e) => setFormData(prev => ({ ...prev, image_qmdy: e.target.value }))}
                placeholder="Alt text for accessibility"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveGame}
            variant="contained"
            disabled={loading || !formData.name_of_the_game.trim()}
            sx={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
              }
            }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : (editingGame ? 'Update Game' : 'Add Game')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};