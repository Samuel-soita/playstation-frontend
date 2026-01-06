import { SxProps, Theme } from '@mui/material';

export const header: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 3,
};

export const title: SxProps<Theme> = {
  fontWeight: 700,
};

export const addButton: SxProps<Theme> = {
  backgroundColor: 'primary.main',
  color: 'white',
  '&:hover': {
    backgroundColor: 'primary.dark',
  },
};

export const floorGrid: SxProps<Theme> = {
  padding: 2,
};

export const stationCard = (isOccupied: boolean): SxProps<Theme> => ({
  padding: 3,
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  border: isOccupied ? '3px solid #f44336' : '3px solid #4caf50',
  backgroundColor: isOccupied ? 'rgba(244, 67, 54, 0.05)' : 'rgba(76, 175, 80, 0.05)',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: 8,
    borderWidth: '4px',
  },
});

export const stationContent: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 1,
  position: 'relative',
};

export const icon: SxProps<Theme> = {
  fontSize: '4rem',
  marginBottom: 1,
};

export const stationId: SxProps<Theme> = {
  fontWeight: 700,
  marginBottom: 0.5,
};

export const playstationType: SxProps<Theme> = {
  fontSize: '0.875rem',
};

export const tvType: SxProps<Theme> = {
  fontSize: '0.875rem',
};

export const statusChip: SxProps<Theme> = {
  marginTop: 1,
  fontWeight: 600,
};

export const actionIcon: SxProps<Theme> = {
  position: 'absolute',
  top: 8,
  right: 8,
  opacity: 0.7,
  '&:hover': {
    opacity: 1,
  },
};
