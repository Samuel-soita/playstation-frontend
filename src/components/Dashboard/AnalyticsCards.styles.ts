import { SxProps, Theme } from '@mui/material';

export const card = (): SxProps<Theme> => ({
  height: '100%',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: 6,
  },
});

export const header: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 2,
};

export const iconContainer = (color: string, bgColor: string): SxProps<Theme> => ({
  width: 56,
  height: 56,
  borderRadius: 2,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: bgColor,
  color: color,
  fontSize: 28,
});

export const value: SxProps<Theme> = {
  fontWeight: 700,
  marginBottom: 1,
  fontSize: { xs: '1.75rem', sm: '2rem' },
};

export const title: SxProps<Theme> = {
  fontSize: '0.875rem',
  textTransform: 'uppercase',
  letterSpacing: 1,
  fontWeight: 500,
};
