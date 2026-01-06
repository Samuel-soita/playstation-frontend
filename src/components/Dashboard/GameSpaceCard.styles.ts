import { SxProps, Theme } from '@mui/material';

export const card = (isOccupied: boolean): SxProps<Theme> => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  border: isOccupied ? '2px solid #f44336' : '2px solid #4caf50',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: 6,
  },
});

export const cardContent: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  gap: 1.5,
};

export const header: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

export const title: SxProps<Theme> = {
  fontWeight: 600,
  fontSize: '1.1rem',
};

export const statusChip: SxProps<Theme> = {
  fontWeight: 600,
};

export const details: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 0.5,
  flexGrow: 1,
};

export const detailItem: SxProps<Theme> = {
  fontSize: '0.875rem',
};

export const actions: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'center',
  marginTop: 'auto',
};

export const actionButton: SxProps<Theme> = {
  '&:hover': {
    transform: 'scale(1.1)',
  },
};
