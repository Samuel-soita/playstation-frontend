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
  backgroundImage: 'url(/assets/images/backgrounds/dashboard-bg.jpg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  animation: `${panImage} 25s infinite alternate linear`,
  // Enhanced fallback gradient for gaming theme
  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
  // Add subtle pattern overlay
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      radial-gradient(circle at 20% 80%, rgba(251, 191, 36, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(217, 119, 6, 0.08) 0%, transparent 50%)
    `,
    backgroundSize: '100% 100%, 100% 100%, 100% 100%',
    backgroundPosition: '0% 0%, 100% 100%, 50% 50%',
    animation: `${panImage} 30s infinite alternate linear`,
  },
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
  minWidth: 320,
  background: 'rgba(255, 255, 255, 0.05)',
  border: '2px solid rgba(255, 255, 255, 0.15)',
  padding: { xs: 4, sm: 6 },
  borderRadius: 4,
  cursor: 'pointer',
  transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  position: 'relative',
  overflow: 'hidden',
  borderBottom: '4px solid transparent',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
    transition: 'left 0.6s ease',
  },
  '&:hover::before': {
    left: '100%',
  },
};

export const gamesPortal: SxProps<Theme> = {
  '&:hover': {
    transform: 'translateY(-15px) scale(1.02)',
    background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(245, 158, 11, 0.1))',
    borderColor: '#fbbf24',
    borderBottomColor: '#fbbf24',
    boxShadow: '0 20px 60px rgba(251, 191, 36, 0.3), 0 0 100px rgba(245, 158, 11, 0.2)',
    animation: 'pulse 2s infinite',
  },
};

export const cyberPortal: SxProps<Theme> = {
  '&:hover': {
    transform: 'translateY(-15px) scale(1.02)',
    background: 'linear-gradient(135deg, rgba(0, 255, 242, 0.15), rgba(0, 191, 255, 0.1))',
    borderColor: '#00fff2',
    borderBottomColor: '#00fff2',
    boxShadow: '0 20px 60px rgba(0, 255, 242, 0.3), 0 0 100px rgba(0, 191, 255, 0.2)',
    animation: 'pulse 2s infinite',
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
  padding: '16px 40px',
  borderRadius: 2,
  fontFamily: '"Rajdhani", sans-serif',
  fontWeight: 800,
  fontSize: '1.2rem',
  textTransform: 'uppercase',
  letterSpacing: 1,
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  minWidth: 180,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
    transition: 'left 0.6s ease',
  },
  '&:hover::before': {
    left: '100%',
  },
};

export const gamesBtn: SxProps<Theme> = {
  background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.05))',
  border: '2px solid #fbbf24',
  color: '#fbbf24',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  '&:hover': {
    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
    color: '#000',
    boxShadow: '0 0 30px rgba(251, 191, 36, 0.6), 0 0 60px rgba(245, 158, 11, 0.4)',
    transform: 'translateY(-2px)',
    borderColor: '#f59e0b',
  },
};

export const cyberBtn: SxProps<Theme> = {
  background: 'linear-gradient(135deg, rgba(0, 255, 242, 0.1), rgba(0, 191, 255, 0.05))',
  border: '2px solid #00fff2',
  color: '#00fff2',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  '&:hover': {
    background: 'linear-gradient(135deg, #00fff2, #00bfff)',
    color: '#000',
    boxShadow: '0 0 30px rgba(0, 255, 242, 0.6), 0 0 60px rgba(0, 191, 255, 0.4)',
    transform: 'translateY(-2px)',
    borderColor: '#00bfff',
  },
};
