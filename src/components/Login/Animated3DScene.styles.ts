import { SxProps, Theme, keyframes } from '@mui/material';

const rotate3D = keyframes`
  0% {
    transform: perspective(1000px) rotateY(0deg) rotateX(5deg) translateZ(0px);
  }
  50% {
    transform: perspective(1000px) rotateY(10deg) rotateX(-5deg) translateZ(20px);
  }
  100% {
    transform: perspective(1000px) rotateY(0deg) rotateX(5deg) translateZ(0px);
  }
`;

const float3D = keyframes`
  0%, 100% {
    transform: translateY(0px) rotateZ(0deg);
  }
  50% {
    transform: translateY(-30px) rotateZ(5deg);
  }
`;

const float3DReverse = keyframes`
  0%, 100% {
    transform: translateY(0px) rotateZ(0deg);
  }
  50% {
    transform: translateY(-30px) rotateZ(-5deg);
  }
`;

const glow3D = keyframes`
  0%, 100% {
    filter: drop-shadow(0 0 20px rgba(102, 126, 234, 0.6));
    opacity: 0.9;
  }
  50% {
    filter: drop-shadow(0 0 40px rgba(102, 126, 234, 1));
    opacity: 1;
  }
`;

export const container: SxProps<Theme> = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 0,
  overflow: 'hidden',
  backgroundColor: '#000',
};

export const video: SxProps<Theme> = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: -2,
};

export const overlay: SxProps<Theme> = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(0px)',
  WebkitBackdropFilter: 'blur(0px)',
  zIndex: 1,
  pointerEvents: 'none',
};

export const placeholder3D: SxProps<Theme> = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 4,
  perspective: '1000px',
};

export const gamingPad3D: SxProps<Theme> = {
  width: { xs: 140, sm: 200 },
  height: { xs: 100, sm: 140 },
  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%)',
  borderRadius: 4,
  position: 'relative',
  animation: `${float3D} 4s ease-in-out infinite`,
  transformStyle: 'preserve-3d',
  boxShadow: '0 25px 70px rgba(102, 126, 234, 0.5), 0 0 30px rgba(102, 126, 234, 0.3)',
  border: '2px solid rgba(255, 255, 255, 0.2)',
  '&.pad-left': {
    animation: `${float3D} 4s ease-in-out infinite`,
    animationDelay: '0s',
  },
  '&.pad-right': {
    animation: `${float3DReverse} 4s ease-in-out infinite`,
    animationDelay: '1.5s',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '15%',
    left: '15%',
    width: '25%',
    height: '25%',
    background: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '50%',
    animation: `${glow3D} 2s ease-in-out infinite`,
    boxShadow: '0 0 20px rgba(102, 126, 234, 0.8)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '15%',
    right: '15%',
    width: '25%',
    height: '25%',
    background: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '50%',
    animation: `${glow3D} 2s ease-in-out infinite`,
    animationDelay: '0.5s',
    boxShadow: '0 0 20px rgba(102, 126, 234, 0.8)',
  },
};

export const laptop3D: SxProps<Theme> = {
  width: { xs: 240, sm: 360 },
  height: { xs: 160, sm: 240 },
  background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(40, 40, 40, 0.95) 100%)',
  borderRadius: 3,
  position: 'relative',
  animation: `${rotate3D} 5s ease-in-out infinite`,
  transformStyle: 'preserve-3d',
  boxShadow: '0 35px 90px rgba(0, 0, 0, 0.7), 0 0 50px rgba(102, 126, 234, 0.4)',
  border: '2px solid rgba(102, 126, 234, 0.3)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '8%',
    left: '4%',
    right: '4%',
    height: '75%',
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.4) 0%, rgba(118, 75, 162, 0.4) 100%)',
    borderRadius: 2,
    border: '2px solid rgba(102, 126, 234, 0.6)',
    animation: `${glow3D} 3s ease-in-out infinite`,
    animationDelay: '0.5s',
    boxShadow: 'inset 0 0 30px rgba(102, 126, 234, 0.3)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '85%',
    height: '10%',
    background: 'rgba(20, 20, 20, 0.9)',
    borderRadius: '0 0 6px 6px',
    borderTop: '1px solid rgba(102, 126, 234, 0.3)',
  },
};
