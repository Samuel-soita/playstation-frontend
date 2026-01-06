import { SxProps, Theme } from '@mui/material';

export const searchBox: SxProps<Theme> = {
  marginBottom: 3,
};

export const grid: SxProps<Theme> = {
  marginTop: 1,
};

export const gameCard: SxProps<Theme> = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: 6,
  },
};

export const gameImage: SxProps<Theme> = {
  objectFit: 'cover',
  backgroundColor: '#f5f5f5',
};

export const gameName: SxProps<Theme> = {
  fontWeight: 600,
  marginBottom: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

export const gameInfo: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
  marginBottom: 2,
};

export const pricingChip: SxProps<Theme> = {
  alignSelf: 'flex-start',
};

export const price: SxProps<Theme> = {
  fontWeight: 500,
};

export const selectButton: SxProps<Theme> = {
  marginTop: 'auto',
};
