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

const slideUpAndFade = keyframes`
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const slideInFromRight = keyframes`
  0% {
    opacity: 0;
    transform: translateX(100px) translateY(20px) scale(0.9);
  }
  60% {
    opacity: 0.8;
    transform: translateX(-5px) translateY(-2px) scale(1.02);
  }
  100% {
    opacity: 1;
    transform: translateX(0) translateY(0) scale(1);
  }
`;

const successPulse = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const ripple = keyframes`
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
`;

const glowPulse = keyframes`
  0%, 100% {
    boxShadow: 0 0 5px rgba(251, 191, 36, 0.5);
  }
  50% {
    boxShadow: 0 0 20px rgba(251, 191, 36, 0.8), 0 0 30px rgba(251, 191, 36, 0.4);
  }
`;

export const container = (theme: Theme): SxProps<Theme> => ({
  position: 'relative',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  backgroundColor: theme.palette.mode === 'dark' ? '#000' : '#f5f5f5',
  fontFamily: '"Rajdhani", "Roboto", sans-serif',
  padding: 2,
});

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

export const loginWrapper = (theme: Theme, shake: boolean = false, success: boolean = false): SxProps<Theme> => ({
  background: theme.palette.mode === 'dark' 
    ? 'rgba(20, 20, 20, 0.85)' 
    : 'rgba(255, 255, 255, 0.95)',
  border: success
    ? '2px solid rgba(245, 158, 11, 0.6)'
    : theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(15px)',
  WebkitBackdropFilter: 'blur(15px)',
  padding: { xs: 2, sm: 2.5 },
  borderRadius: 3,
  boxShadow: success
    ? '0 0 30px rgba(245, 158, 11, 0.4), 0 0 60px rgba(245, 158, 11, 0.2)'
    : theme.palette.mode === 'dark'
    ? '0 0 50px rgba(0,0,0,0.8)'
    : '0 0 50px rgba(0,0,0,0.2)',
  textAlign: 'center',
  width: '85%',
  maxWidth: 420,
  animation: shake 
    ? `${shake} 0.5s ease-in-out`
    : success
    ? `${successPulse} 0.6s ease-out`
    : `${slideUpAndFade} 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)`,
  position: 'relative',
  zIndex: 10,
  transformOrigin: 'center',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  cursor: 'default',
  willChange: 'transform, box-shadow, border',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-12px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 25px 70px rgba(0,0,0,0.95), 0 0 50px rgba(245, 158, 11, 0.4), 0 0 100px rgba(245, 158, 11, 0.2)'
      : '0 25px 70px rgba(0,0,0,0.4), 0 0 50px rgba(245, 158, 11, 0.3), 0 0 100px rgba(245, 158, 11, 0.15)',
    border: theme.palette.mode === 'dark'
      ? '1px solid rgba(245, 158, 11, 0.5)'
      : '1px solid rgba(245, 158, 11, 0.4)',
    background: theme.palette.mode === 'dark'
      ? 'rgba(20, 20, 20, 0.92)'
      : 'rgba(255, 255, 255, 0.99)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
  },
  '&:active': {
    transform: 'translateY(-8px)',
    transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
  },
});

export const header: SxProps<Theme> = {
  textAlign: 'center',
  marginBottom: 2,
  animation: `${scaleIn} 0.6s ease-out 0.2s both`,
};

export const title = (theme: Theme): SxProps<Theme> => ({
  color: theme.palette.mode === 'dark' ? 'white' : '#333',
  fontSize: { xs: '1.75rem', sm: '2rem' },
  marginBottom: 0.5,
  letterSpacing: 2,
  textTransform: 'uppercase',
  textShadow: theme.palette.mode === 'dark' 
    ? '0 0 10px rgba(255,255,255,0.5)' 
    : '0 0 10px rgba(102, 126, 234, 0.3)',
  fontWeight: 700,
  fontFamily: '"Rajdhani", sans-serif',
  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
});

export const subtitle = (theme: Theme): SxProps<Theme> => ({
  color: theme.palette.mode === 'dark' ? '#ccc' : '#666',
  marginTop: 0.5,
  fontSize: { xs: '0.9rem', sm: '1rem' },
  fontFamily: '"Rajdhani", sans-serif',
});

export const alert: SxProps<Theme> = {
  marginBottom: 2,
  borderRadius: 2,
};

export const form: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1.5,
};

export const animatedField = (isVisible: boolean, delay: number = 0): SxProps<Theme> => ({
  opacity: isVisible ? 1 : 0,
  transform: isVisible ? 'translateX(0) translateY(0)' : 'translateX(100px) translateY(20px)',
  animation: isVisible ? `${slideInFromRight} 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s both` : 'none',
  transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
  overflow: 'visible',
  willChange: 'transform, opacity',
});

export const textField = (theme: Theme, hasError: boolean = false): SxProps<Theme> => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    transition: 'all 0.3s ease',
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.05)' 
      : 'rgba(0, 0, 0, 0.02)',
    color: theme.palette.mode === 'dark' ? 'white' : theme.palette.text.primary,
    '& fieldset': {
      borderColor: hasError
        ? 'rgba(244, 67, 54, 0.6)'
        : theme.palette.mode === 'dark' 
        ? 'rgba(255, 255, 255, 0.2)' 
        : 'rgba(0, 0, 0, 0.23)',
    },
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' 
        ? 'rgba(255, 255, 255, 0.08)' 
        : 'rgba(0, 0, 0, 0.04)',
      transform: 'translateY(-2px)',
      boxShadow: hasError
        ? '0 4px 12px rgba(244, 67, 54, 0.2)'
        : theme.palette.mode === 'dark'
        ? '0 4px 12px rgba(0, 0, 0, 0.2)'
        : '0 4px 12px rgba(102, 126, 234, 0.1)',
      '& fieldset': {
        borderColor: hasError
          ? 'rgba(244, 67, 54, 0.8)'
          : 'rgba(102, 126, 234, 0.5)',
      },
    },
    '&.Mui-focused': {
      backgroundColor: theme.palette.mode === 'dark' 
        ? 'rgba(255, 255, 255, 0.1)' 
        : 'rgba(102, 126, 234, 0.05)',
      transform: 'translateY(-2px)',
      boxShadow: hasError
        ? '0 4px 12px rgba(244, 67, 54, 0.3)'
        : '0 4px 12px rgba(102, 126, 234, 0.3)',
      animation: `${glowPulse} 2s ease-in-out infinite`,
      '& fieldset': {
        borderColor: hasError ? '#f44336' : '#f59e0b',
        borderWidth: hasError ? '2px' : '1px',
      },
    },
  },
  '& .MuiInputLabel-root': {
    color: hasError
      ? '#f44336'
      : theme.palette.mode === 'dark' ? '#aaa' : '#666',
    fontFamily: '"Rajdhani", sans-serif',
    transition: 'all 0.3s ease',
    '&.Mui-focused': {
      color: hasError ? '#f44336' : '#f59e0b',
      transform: 'scale(1.05)',
    },
  },
  '& .MuiInputBase-input': {
    color: theme.palette.mode === 'dark' ? 'white' : theme.palette.text.primary,
    fontFamily: '"Rajdhani", sans-serif',
    '&::placeholder': {
      color: theme.palette.mode === 'dark' ? '#888' : '#999',
      opacity: 1,
    },
  },
  '& .MuiFormHelperText-root': {
    fontFamily: '"Rajdhani", sans-serif',
    marginTop: 0.5,
  },
});

export const input: SxProps<Theme> = {
  fontSize: '1rem',
};

export const passwordField = (theme: Theme, hasError: boolean = false): SxProps<Theme> => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    transition: 'all 0.3s ease',
    backgroundColor: theme.palette.mode === 'dark'
      ? 'rgba(251, 191, 36, 0.05)'
      : 'rgba(251, 191, 36, 0.03)',
    color: theme.palette.mode === 'dark' ? 'white' : theme.palette.text.primary,
    border: `1px solid ${hasError ? '#f44336' : 'rgba(251, 191, 36, 0.3)'}`,
    '& fieldset': {
      borderColor: hasError
        ? 'rgba(244, 67, 54, 0.6)'
        : 'rgba(251, 191, 36, 0.5)',
      borderWidth: '2px',
    },
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark'
        ? 'rgba(251, 191, 36, 0.08)'
        : 'rgba(251, 191, 36, 0.05)',
      transform: 'translateY(-2px)',
      boxShadow: hasError
        ? '0 4px 12px rgba(244, 67, 54, 0.2)'
        : '0 6px 16px rgba(251, 191, 36, 0.3), 0 0 20px rgba(245, 158, 11, 0.2)',
      '& fieldset': {
        borderColor: hasError
          ? 'rgba(244, 67, 54, 0.8)'
          : 'rgba(251, 191, 36, 0.8)',
        borderWidth: '2px',
      },
    },
    '&.Mui-focused': {
      backgroundColor: theme.palette.mode === 'dark'
        ? 'rgba(251, 191, 36, 0.1)'
        : 'rgba(251, 191, 36, 0.08)',
      transform: 'translateY(-3px)',
      boxShadow: hasError
        ? '0 6px 20px rgba(244, 67, 54, 0.4)'
        : '0 8px 24px rgba(251, 191, 36, 0.5), 0 0 32px rgba(245, 158, 11, 0.3), 0 0 48px rgba(217, 119, 6, 0.2)',
      animation: `${glowPulse} 2s ease-in-out infinite`,
      '& fieldset': {
        borderColor: hasError ? '#f44336' : '#f59e0b',
        borderWidth: '3px',
        boxShadow: hasError ? 'none' : '0 0 8px rgba(245, 158, 11, 0.6)',
      },
    },
  },
  '& .MuiInputLabel-root': {
    color: hasError
      ? '#f44336'
      : '#d97706',
    fontFamily: '"Rajdhani", sans-serif',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    '&.Mui-focused': {
      color: hasError ? '#f44336' : '#f59e0b',
      transform: 'scale(1.05)',
      textShadow: hasError ? 'none' : '0 0 8px rgba(245, 158, 11, 0.6)',
    },
  },
  '& .MuiInputBase-input': {
    color: theme.palette.mode === 'dark' ? 'white' : theme.palette.text.primary,
    fontFamily: '"Rajdhani", sans-serif',
    fontWeight: '500',
    '&::placeholder': {
      color: '#d97706',
      opacity: 0.8,
      fontWeight: '400',
    },
  },
  '& .MuiFormHelperText-root': {
    fontFamily: '"Rajdhani", sans-serif',
    color: hasError ? '#f44336' : '#d97706',
    fontWeight: '500',
    marginTop: 0.5,
  },
});

export const submitButton: SxProps<Theme> = {
  marginTop: 1,
  padding: 1.25,
  fontSize: '0.95rem',
  fontWeight: 600,
  borderRadius: 2,
  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  textTransform: 'uppercase',
  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
  fontFamily: '"Rajdhani", sans-serif',
  letterSpacing: 1,
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
    boxShadow: '0 6px 16px rgba(245, 158, 11, 0.5)',
    transform: 'translateY(-2px) scale(1.02)',
  },
  '&:active': {
    transform: 'translateY(0) scale(0.98)',
  },
  '&:disabled': {
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    opacity: 0.6,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 0,
    height: 0,
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.3)',
    transform: 'translate(-50%, -50%)',
    transition: 'width 0.6s, height 0.6s',
  },
  '&:active::after': {
    width: '300px',
    height: '300px',
    animation: `${ripple} 0.6s ease-out`,
  },
};

export const rememberMe: SxProps<Theme> = {
  marginTop: 1,
  '& .MuiFormControlLabel-label': {
    fontFamily: '"Rajdhani", sans-serif',
    fontSize: '0.875rem',
  },
  '& .MuiCheckbox-root': {
    color: 'rgba(102, 126, 234, 0.7)',
    '&.Mui-checked': {
      color: '#f59e0b',
    },
  },
};

export const forgotPassword: SxProps<Theme> = {
  marginTop: 1,
  textAlign: 'right',
  '& a': {
    fontFamily: '"Rajdhani", sans-serif',
    fontSize: '0.875rem',
    color: '#667eea',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    '&:hover': {
      color: '#764ba2',
      textDecoration: 'underline',
    },
  },
};

export const successIcon: SxProps<Theme> = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  fontSize: '4rem',
  color: '#4caf50',
  animation: `${successPulse} 0.6s ease-out`,
  zIndex: 1000,
};

export const loadingSpinner: SxProps<Theme> = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 1000,
};
