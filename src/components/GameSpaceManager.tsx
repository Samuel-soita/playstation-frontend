import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Grid,
  TextField,
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
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  LocationOn,
  Tv,
  VideogameAsset,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import { apiService } from '@/services/api';
import { GameSpace } from '@/types';

interface GameSpaceFormData {
  game_space_id: string;
  playstation_type: 'PS4' | 'PS5' | 'PS4 Pro' | 'PS5 Digital';
  tv_type: 'LED' | 'LCD' | 'OLED' | 'Plasma' | 'CRT' | 'Sony Bravia';
  occupied: 'Occupied' | 'Not Occupied';
}

const PLAYSTATION_TYPES = ['PS4', 'PS5', 'PS4 Pro', 'PS5 Digital'];
const TV_TYPES = ['LED', 'LCD', 'OLED', 'Plasma', 'CRT', 'Sony Bravia'];

export const GameSpaceManager: React.FC = () => {
  const [gameSpaces, setGameSpaces] = useState<GameSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSpace, setEditingSpace] = useState<GameSpace | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'success' });

  const [formData, setFormData] = useState<GameSpaceFormData>({
    game_space_id: '',
    playstation_type: 'PS4',
    tv_type: 'LED',
    occupied: 'Not Occupied',
  });

  // Load game spaces data
  const loadGameSpaces = useCallback(async () => {
    try {
      setLoading(true);
      const spacesData = await apiService.getGameSpaces();
      setGameSpaces(spacesData);
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to load game spaces', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGameSpaces();
  }, [loadGameSpaces]);

  const showSnackbar = useCallback((message: string, severity: 'success' | 'error' | 'info' = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const generateGameSpaceId = () => {
    const existingIds = gameSpaces.map(space => {
      const match = space.game_space_id.match(/PS(\d+)-(\d+)/);
      return match ? parseInt(match[2]) : 0;
    });
    const nextId = Math.max(0, ...existingIds) + 1;
    const psType = formData.playstation_type.startsWith('PS5') ? '5' : '4';
    return `PS${psType}-${nextId.toString().padStart(2, '0')}`;
  };

  const handleOpenDialog = (space?: GameSpace) => {
    if (space) {
      setEditingSpace(space);
      setFormData({
        game_space_id: space.game_space_id,
        playstation_type: space.playstation_type as any || 'PS4',
        tv_type: space.tv_type as any || 'LED',
        occupied: space.occupied,
      });
    } else {
      setEditingSpace(null);
      const newId = generateGameSpaceId();
      setFormData({
        game_space_id: newId,
        playstation_type: 'PS4',
        tv_type: 'LED',
        occupied: 'Not Occupied',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingSpace(null);
    setFormData({
      game_space_id: '',
      playstation_type: 'PS4',
      tv_type: 'LED',
      occupied: 'Not Occupied',
    });
  };

  const handleSaveGameSpace = async () => {
    if (!formData.game_space_id.trim()) {
      showSnackbar('Game Space ID is required', 'error');
      return;
    }

    // Check for duplicate game space ID
    const isDuplicate = gameSpaces.some(space =>
      space.game_space_id === formData.game_space_id &&
      (!editingSpace || space.name !== editingSpace.name)
    );

    if (isDuplicate) {
      showSnackbar('Game Space ID already exists', 'error');
      return;
    }

    try {
      setLoading(true);

      if (editingSpace) {
        // Update existing game space
        await apiService.saveDoc('Game Space', {
          ...editingSpace,
          ...formData,
        });
        showSnackbar('Game space updated successfully', 'success');
      } else {
        // Create new game space
        await apiService.saveDoc('Game Space', {
          doctype: 'Game Space',
          ...formData,
        });
        showSnackbar('Game space added successfully', 'success');
      }

      handleCloseDialog();
      loadGameSpaces();
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to save game space', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGameSpace = async (space: GameSpace) => {
    if (!window.confirm(`Are you sure you want to delete "${space.game_space_id}"?`)) {
      return;
    }

    try {
      setLoading(true);
      await apiService.deleteDoc('Game Space', space.name);
      showSnackbar('Game space deleted successfully', 'success');
      loadGameSpaces();
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to delete game space', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleOccupancy = async (space: GameSpace) => {
    const newStatus = space.occupied === 'Occupied' ? 'Not Occupied' : 'Occupied';

    try {
      setLoading(true);
      await apiService.updateGameSpaceOccupancy(space.game_space_id, newStatus);
      showSnackbar(`Game space ${newStatus.toLowerCase()}`, 'success');
      loadGameSpaces();
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to update occupancy', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (occupied: string) => {
    return occupied === 'Occupied' ? 'error' : 'success';
  };

  const getStatusIcon = (occupied: string) => {
    return occupied === 'Occupied' ? <Cancel /> : <CheckCircle />;
  };

  if (loading && gameSpaces.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress size={60} sx={{ color: '#f59e0b' }} />
      </Box>
    );
  }

  const occupiedCount = gameSpaces.filter(space => space.occupied === 'Occupied').length;
  const availableCount = gameSpaces.filter(space => space.occupied === 'Not Occupied').length;

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
            🎯 Game Space Manager
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Configure and manage your gaming stations and equipment
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
          Add Game Space
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{
            p: 3,
            background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
            border: '2px solid #3b82f6'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <VideogameAsset sx={{ fontSize: 40, color: '#1d4ed8' }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1d4ed8' }}>
                  {gameSpaces.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Game Spaces
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{
            p: 3,
            background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
            border: '2px solid #16a34a'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CheckCircle sx={{ fontSize: 40, color: '#15803d' }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#15803d' }}>
                  {availableCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Available Spaces
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{
            p: 3,
            background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
            border: '2px solid #dc2626'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Cancel sx={{ fontSize: 40, color: '#b91c1c' }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#b91c1c' }}>
                  {occupiedCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Occupied Spaces
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Game Spaces Grid */}
      <Grid container spacing={3}>
        {gameSpaces.map((space) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={space.name}>
            <Card sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6,
                borderColor: getStatusColor(space.occupied) === 'success' ? '#16a34a' : '#dc2626',
              },
              border: `2px solid ${getStatusColor(space.occupied) === 'success' ? '#16a34a' : '#dc2626'}`,
            }}>
              <CardHeader
                title={
                  <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn />
                    {space.game_space_id}
                  </Typography>
                }
                subheader={
                  <Chip
                    icon={getStatusIcon(space.occupied)}
                    label={space.occupied}
                    color={getStatusColor(space.occupied) as any}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                }
                action={
                  <Box>
                    <Tooltip title="Edit Space">
                      <IconButton onClick={() => handleOpenDialog(space)} size="small">
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Space">
                      <IconButton
                        onClick={() => handleDeleteGameSpace(space)}
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
                    <VideogameAsset fontSize="small" />
                    Console: <strong>{space.playstation_type || 'N/A'}</strong>
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tv fontSize="small" />
                    TV: <strong>{space.tv_type || 'N/A'}</strong>
                  </Typography>
                </Box>

                {/* Occupancy Toggle */}
                <Box sx={{
                  mt: 2,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: space.occupied === 'Occupied' ? '#fee2e2' : '#dcfce7',
                  border: `1px solid ${space.occupied === 'Occupied' ? '#dc2626' : '#16a34a'}`,
                }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={space.occupied === 'Occupied'}
                        onChange={() => handleToggleOccupancy(space)}
                        disabled={loading}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#dc2626',
                            '&:hover': {
                              backgroundColor: 'rgba(220, 38, 38, 0.08)',
                            },
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#dc2626',
                          },
                        }}
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {space.occupied === 'Occupied' ? 'Mark as Available' : 'Mark as Occupied'}
                      </Typography>
                    }
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {gameSpaces.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <LocationOn sx={{ fontSize: 80, color: '#ddd', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No game spaces configured
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Add your first gaming station to get started!
          </Typography>
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
            Add First Game Space
          </Button>
        </Box>
      )}

      {/* Game Space Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: 'white'
        }}>
          {editingSpace ? 'Edit Game Space' : 'Add New Game Space'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Game Space ID"
                value={formData.game_space_id}
                onChange={(e) => setFormData(prev => ({ ...prev, game_space_id: e.target.value }))}
                required
                helperText="Unique identifier for the game space (e.g., PS4-01)"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>PlayStation Type</InputLabel>
                <Select
                  value={formData.playstation_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, playstation_type: e.target.value as any }))}
                  label="PlayStation Type"
                >
                  {PLAYSTATION_TYPES.map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>TV Type</InputLabel>
                <Select
                  value={formData.tv_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, tv_type: e.target.value as any }))}
                  label="TV Type"
                >
                  {TV_TYPES.map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Initial Status</InputLabel>
                <Select
                  value={formData.occupied}
                  onChange={(e) => setFormData(prev => ({ ...prev, occupied: e.target.value as any }))}
                  label="Initial Status"
                >
                  <MenuItem value="Not Occupied">Available</MenuItem>
                  <MenuItem value="Occupied">Occupied</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Alert severity="info" sx={{ mt: 3 }}>
            💡 <strong>Tip:</strong> You can change the occupancy status later using the toggle switch on each game space card.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveGameSpace}
            variant="contained"
            disabled={loading || !formData.game_space_id.trim()}
            sx={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
              }
            }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : (editingSpace ? 'Update Game Space' : 'Add Game Space')}
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