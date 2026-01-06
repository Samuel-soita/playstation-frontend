import { SxProps, Theme, keyframes } from '@mui/material';

const panImage = keyframes`
  0% {
    transform: scale(1.1);
    background-position: 0% 50%;
  }
  100% {
    transform: scale(1.2);
    background-position: 100% 50%;
  }
`;

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

export const container: SxProps<Theme> = {
  position: 'relative',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  backgroundColor: '#000',
  fontFamily: '"Rajdhani", "Roboto", sans-serif',
};

export const backgroundContainer: SxProps<Theme> = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: -1,
  backgroundImage: 'url(/assets/images/login-background.jpg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  animation: `${panImage} 20s infinite alternate linear`,
  // Fallback gradient if image doesn't load
  backgroundColor: '#000',
};

export const overlay: SxProps<Theme> = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(0, 0, 0, 0.7)',
  backdropFilter: 'blur(3px)',
  WebkitBackdropFilter: 'blur(3px)',
  zIndex: -1,
};

export const loginWrapper: SxProps<Theme> = {
  background: 'rgba(20, 20, 20, 0.6)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(15px)',
  WebkitBackdropFilter: 'blur(15px)',
  padding: { xs: 3, sm: 5 },
  borderRadius: 3,
  boxShadow: '0 0 50px rgba(0,0,0,0.8)',
  textAlign: 'center',
  width: '90%',
  maxWidth: 900,
  animation: `${fadeIn} 1s ease-out`,
};

export const title: SxProps<Theme> = {
  color: 'white',
  fontSize: { xs: '2rem', sm: '2.5rem' },
  marginBottom: 1,
  letterSpacing: 2,
  textTransform: 'uppercase',
  textShadow: '0 0 10px rgba(255,255,255,0.5)',
  fontWeight: 700,
  fontFamily: '"Rajdhani", sans-serif',
};

export const subtitle: SxProps<Theme> = {
  color: '#ccc',
  marginBottom: 5,
  fontSize: { xs: '1rem', sm: '1.1rem' },
  fontFamily: '"Rajdhani", sans-serif',
};

export const optionsContainer: SxProps<Theme> = {
  display: 'flex',
  gap: { xs: 2, sm: 4 },
  justifyContent: 'center',
  flexWrap: 'wrap',
};

export const portalCard: SxProps<Theme> = {
  flex: 1,
  minWidth: 280,
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  padding: { xs: 3, sm: 5 },
  borderRadius: 2,
  cursor: 'pointer',
  transition: 'all 0.4s ease',
  position: 'relative',
  overflow: 'hidden',
  borderBottom: '4px solid transparent',
};

export const gamesPortal: SxProps<Theme> = {
  '&:hover': {
    transform: 'translateY(-10px)',
    background: 'rgba(189, 0, 255, 0.15)',
    borderColor: '#bd00ff',
    boxShadow: '0 0 40px rgba(189, 0, 255, 0.3)',
  },
};

export const cyberPortal: SxProps<Theme> = {
  '&:hover': {
    transform: 'translateY(-10px)',
    background: 'rgba(0, 255, 242, 0.15)',
    borderColor: '#00fff2',
    boxShadow: '0 0 40px rgba(0, 255, 242, 0.3)',
  },
};

export const portalIcon: SxProps<Theme> = {
  fontSize: 48,
  marginBottom: 2,
  color: 'inherit',
};

export const portalTitle: SxProps<Theme> = {
  fontSize: { xs: '1.5rem', sm: '1.8rem' },
  marginBottom: 2,
  color: '#fff',
  fontFamily: '"Rajdhani", sans-serif',
  fontWeight: 700,
  textTransform: 'uppercase',
};

export const portalDescription: SxProps<Theme> = {
  color: '#aaa',
  fontSize: { xs: '0.85rem', sm: '0.9rem' },
  marginBottom: 3,
  fontFamily: '"Rajdhani", sans-serif',
};

export const loginBtn: SxProps<Theme> = {
  padding: '12px 30px',
  borderRadius: 1,
  fontFamily: '"Rajdhani", sans-serif',
  fontWeight: 700,
  fontSize: '1.1rem',
  textTransform: 'uppercase',
  transition: '0.3s',
  minWidth: 150,
};

export const gamesBtn: SxProps<Theme> = {
  background: 'transparent',
  border: '1px solid #bd00ff',
  color: '#bd00ff',
  '&:hover': {
    background: '#bd00ff',
    color: 'white',
    boxShadow: '0 0 20px #bd00ff',
  },
};

export const cyberBtn: SxProps<Theme> = {
  background: 'transparent',
  border: '1px solid #00fff2',
  color: '#00fff2',
  '&:hover': {
    background: '#00fff2',
    color: 'black',
    boxShadow: '0 0 20px #00fff2',
  },
};
