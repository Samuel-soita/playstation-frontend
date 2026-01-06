import { SxProps, Theme } from '@mui/material';

export const title: SxProps<Theme> = {
  fontWeight: 700,
  marginBottom: 1,
};

export const subtitle: SxProps<Theme> = {
  marginBottom: 3,
};

export const revenuePaper: SxProps<Theme> = {
  padding: 3,
  marginTop: 3,
};

export const revenueHeader: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 2,
};

export const revenueDisplay: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
};

export const actionButtons: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: 3,
};
