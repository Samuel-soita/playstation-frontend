import { SxProps, Theme } from '@mui/material';

const drawerWidth = 280;

export const container: SxProps<Theme> = {
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#121212' : '#f5f5f5',
};

export const appBar = (open: boolean, isMobile: boolean): SxProps<Theme> => ({
  zIndex: (theme) => theme.zIndex.drawer + 1,
  backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1e1e1e' : '#667eea',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  boxShadow: 3,
  transition: (theme) =>
    theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  ...(open && !isMobile && {
    marginLeft: `${drawerWidth}px`,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: (theme) =>
      theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
  }),
});

export const menuButton: SxProps<Theme> = {
  marginRight: 2,
};

export const appTitle: SxProps<Theme> = {
  fontWeight: 700,
  letterSpacing: 1,
};

export const userName: SxProps<Theme> = {
  marginRight: 2,
  opacity: 0.9,
};

export const logoutButton: SxProps<Theme> = {
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
};

export const drawer = {
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
};

export const drawerPaper: SxProps<Theme> = {
  backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1e1e1e' : '#ffffff',
  borderRight: (theme) => `1px solid ${theme.palette.divider}`,
  background: (theme) => theme.palette.mode === 'dark' 
    ? 'linear-gradient(180deg, #1e1e1e 0%, #2d2d2d 100%)'
    : 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
};

export const sidebarHeader: SxProps<Theme> = {
  padding: 3,
  textAlign: 'center',
  borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
};

export const sidebarTitle: SxProps<Theme> = {
  fontWeight: 700,
  letterSpacing: 1,
};

export const menuList: SxProps<Theme> = {
  padding: 2,
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
};

export const menuItem = (isActive: boolean, color: string): SxProps<Theme> => ({
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  padding: 2,
  borderRadius: 2,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: isActive 
    ? (theme) => theme.palette.mode === 'dark' ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.1)'
    : 'transparent',
  borderLeft: isActive ? `4px solid ${color}` : '4px solid transparent',
  '&:hover': {
    backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
    transform: 'translateX(4px)',
  },
});

export const menuIcon: SxProps<Theme> = {
  fontSize: 24,
};

export const menuLabel: SxProps<Theme> = {
  fontWeight: 500,
};

export const mainContent = (open: boolean, isMobile: boolean): SxProps<Theme> => ({
  flexGrow: 1,
  transition: (theme) =>
    theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  marginLeft: open && !isMobile ? `${drawerWidth}px` : 0,
  minHeight: '100vh',
  backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#121212' : '#f5f5f5',
});

export const contentContainer: SxProps<Theme> = {
  py: 4,
};
