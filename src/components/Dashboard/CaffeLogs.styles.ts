import { SxProps, Theme } from '@mui/material';

export const container: SxProps<Theme> = {
  padding: 3,
};

export const logInput: SxProps<Theme> = {
  fontFamily: 'monospace',
  fontSize: '0.875rem',
  backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.02)',
};
