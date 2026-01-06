import { SxProps, Theme } from '@mui/material';

export const title: SxProps<Theme> = {
  fontWeight: 700,
  marginBottom: 1,
};

export const subtitle: SxProps<Theme> = {
  marginBottom: 3,
};

export const methodCard: SxProps<Theme> = {
  height: '100%',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: 8,
  },
};

export const methodContent: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 2,
  padding: 4,
  textAlign: 'center',
};

export const methodIcon = (color: string): SxProps<Theme> => ({
  fontSize: 64,
  color: color,
});

export const methodLabel: SxProps<Theme> = {
  fontWeight: 600,
};

export const invoicePaper: SxProps<Theme> = {
  padding: 3,
  marginTop: 3,
};

export const invoiceHeader: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 3,
};

export const invoiceList: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  maxHeight: 400,
  overflowY: 'auto',
  marginBottom: 3,
};

export const invoiceCard = (isSelected: boolean): SxProps<Theme> => ({
  cursor: 'pointer',
  border: isSelected ? '3px solid #667eea' : '1px solid #e0e0e0',
  backgroundColor: isSelected ? 'rgba(102, 126, 234, 0.05)' : 'transparent',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateX(4px)',
    boxShadow: 4,
  },
});

export const invoiceInfo: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

export const detailsPaper: SxProps<Theme> = {
  padding: 3,
  marginTop: 3,
};

export const detailsForm: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  marginBottom: 3,
};

export const input: SxProps<Theme> = {
  marginBottom: 2,
};

export const actionButtons: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 2,
  marginTop: 3,
};
