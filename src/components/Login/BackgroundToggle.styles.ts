import { SxProps, Theme } from '@mui/material';

export const toggleContainer: SxProps<Theme> = {
  position: 'absolute',
  top: 16,
  right: 16,
  zIndex: 10,
  background: 'rgba(20, 20, 20, 0.7)',
  backdropFilter: 'blur(10px)',
  borderRadius: 2,
  padding: 1,
  border: '1px solid rgba(255, 255, 255, 0.1)',
};

export const formControl: SxProps<Theme> = {
  margin: 0,
};

export const switchStyles: SxProps<Theme> = {
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#f59e0b',
    '& + .MuiSwitch-track': {
      backgroundColor: '#f59e0b',
    },
  },
  '& .MuiSwitch-track': {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
};

export const labelContainer: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  color: 'white',
};

export const icon: SxProps<Theme> = {
  fontSize: 18,
};

export const labelText: SxProps<Theme> = {
  color: 'white',
  fontFamily: '"Rajdhani", sans-serif',
  fontWeight: 600,
  fontSize: '0.875rem',
};
