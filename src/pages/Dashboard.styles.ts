import { SxProps, Theme } from '@mui/material';
import { keyframes } from '@emotion/react';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const pageContainer: SxProps<Theme> = {
  minHeight: '100vh',
  backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#121212' : '#f5f7fa',
  background: (theme) => theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
    : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
};

export const appBar: SxProps<Theme> = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  boxShadow: 4,
  position: 'sticky',
  top: 0,
  zIndex: 1100,
};

export const caffeButton: SxProps<Theme> = {
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  marginRight: 1,
};

export const container: SxProps<Theme> = {
  py: 4,
  animation: `${fadeIn} 0.6s ease-out`,
};

export const welcomeSection: SxProps<Theme> = {
  textAlign: 'center',
  mb: 4,
  py: 3,
};

export const welcomeTitle: SxProps<Theme> = {
  fontWeight: 700,
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  mb: 1,
};

export const welcomeSubtitle: SxProps<Theme> = {
  fontSize: '1.1rem',
  opacity: 0.8,
};

export const tabsPaper: SxProps<Theme> = {
  borderRadius: 3,
  overflow: 'hidden',
  boxShadow: 6,
  backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1e1e1e' : '#ffffff',
};

export const tabs: SxProps<Theme> = {
  borderBottom: (theme) => `2px solid ${theme.palette.divider}`,
  backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#2d2d2d' : '#f8f9fa',
  '& .MuiTab-root': {
    minHeight: 72,
    textTransform: 'none',
    fontSize: '1rem',
    fontWeight: 600,
    color: (theme) => theme.palette.text.secondary,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    borderRadius: '8px 8px 0 0',
    margin: '0 4px',
    padding: '12px 24px',
    '&:hover': {
      color: '#667eea',
      backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(102, 126, 234, 0.15)' : 'rgba(102, 126, 234, 0.08)',
      transform: 'translateY(-2px)',
      boxShadow: 2,
    },
    '&.Mui-selected': {
      color: '#667eea',
      fontWeight: 700,
      backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.1)',
    },
  },
  '& .MuiTabs-indicator': {
    height: 4,
    borderRadius: '2px 2px 0 0',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.4)',
  },
};

export const tab: SxProps<Theme> = {
  minHeight: 72,
  '&:hover': {
    transform: 'translateY(-2px)',
  },
};

export const tabIcon: SxProps<Theme> = {
  fontSize: '1.5rem',
  marginRight: 1,
};

export const tabContent: SxProps<Theme> = {
  padding: 4,
  minHeight: 500,
  animation: `${fadeIn} 0.4s ease-out`,
};

export const sectionHeader: SxProps<Theme> = {
  mb: 4,
  pb: 2,
  borderBottom: (theme) => `2px solid ${theme.palette.divider}`,
};

export const sectionTitle: SxProps<Theme> = {
  fontWeight: 700,
  mb: 1,
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};
