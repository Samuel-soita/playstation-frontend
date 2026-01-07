import { Box } from '@mui/material';
import { keyframes } from '@emotion/react';

const float = keyframes`
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
`;

const floatReverse = keyframes`
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(-5deg);
  }
`;

const glow = keyframes`
  0%, 100% {
    opacity: 0.8;
    filter: drop-shadow(0 0 10px rgba(102, 126, 234, 0.6));
  }
  50% {
    opacity: 1;
    filter: drop-shadow(0 0 20px rgba(102, 126, 234, 0.9));
  }
`;

export const AnimatedGamingPads = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: 150, sm: 200 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 3,
        overflow: 'hidden',
      }}
    >
      {/* Left Gaming Pad */}
      <Box
        sx={{
          position: 'absolute',
          left: { xs: '5%', sm: '10%' },
          animation: `${float} 3s ease-in-out infinite`,
          animationDelay: '0s',
        }}
      >
        <Box
          component="svg"
          viewBox="0 0 120 120"
          sx={{
            width: { xs: 90, sm: 120 },
            height: { xs: 90, sm: 120 },
            filter: 'drop-shadow(0 0 15px rgba(102, 126, 234, 0.6))',
            animation: `${glow} 2s ease-in-out infinite`,
          }}
        >
          {/* Main body */}
          <ellipse
            cx="60"
            cy="60"
            rx="50"
            ry="35"
            fill="url(#gradient1)"
            stroke="#f59e0b"
            strokeWidth="2"
          />
          {/* Left stick */}
          <circle
            cx="40"
            cy="50"
            r="8"
            fill="#d97706"
            opacity="0.9"
          >
            <animate
              attributeName="r"
              values="8;10;8"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
          {/* Right stick */}
          <circle
            cx="80"
            cy="50"
            r="8"
            fill="#d97706"
            opacity="0.9"
          >
            <animate
              attributeName="r"
              values="8;10;8"
              dur="1.5s"
              repeatCount="indefinite"
              begin="0.5s"
            />
          </circle>
          {/* Buttons */}
          <circle cx="50" cy="75" r="4" fill="#fff" opacity="0.8">
            <animate
              attributeName="opacity"
              values="0.8;1;0.8"
              dur="1s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="70" cy="75" r="4" fill="#fff" opacity="0.8">
            <animate
              attributeName="opacity"
              values="0.8;1;0.8"
              dur="1s"
              repeatCount="indefinite"
              begin="0.3s"
            />
          </circle>
          {/* D-pad */}
          <rect x="35" y="65" width="12" height="12" fill="#fff" opacity="0.7" rx="2" />
          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.9" />
            </linearGradient>
          </defs>
        </Box>
      </Box>

      {/* Right Gaming Pad */}
      <Box
        sx={{
          position: 'absolute',
          right: { xs: '5%', sm: '10%' },
          animation: `${floatReverse} 3s ease-in-out infinite`,
          animationDelay: '1s',
        }}
      >
        <Box
          component="svg"
          viewBox="0 0 120 120"
          sx={{
            width: { xs: 90, sm: 120 },
            height: { xs: 90, sm: 120 },
            filter: 'drop-shadow(0 0 15px rgba(118, 75, 162, 0.6))',
            animation: `${glow} 2s ease-in-out infinite`,
            animationDelay: '1s',
          }}
        >
          {/* Main body */}
          <ellipse
            cx="60"
            cy="60"
            rx="50"
            ry="35"
            fill="url(#gradient2)"
            stroke="#d97706"
            strokeWidth="2"
          />
          {/* Left stick */}
          <circle
            cx="40"
            cy="50"
            r="8"
            fill="#f59e0b"
            opacity="0.9"
          >
            <animate
              attributeName="r"
              values="8;10;8"
              dur="1.5s"
              repeatCount="indefinite"
              begin="0.7s"
            />
          </circle>
          {/* Right stick */}
          <circle
            cx="80"
            cy="50"
            r="8"
            fill="#f59e0b"
            opacity="0.9"
          >
            <animate
              attributeName="r"
              values="8;10;8"
              dur="1.5s"
              repeatCount="indefinite"
              begin="1.2s"
            />
          </circle>
          {/* Buttons */}
          <circle cx="50" cy="75" r="4" fill="#fff" opacity="0.8">
            <animate
              attributeName="opacity"
              values="0.8;1;0.8"
              dur="1s"
              repeatCount="indefinite"
              begin="0.5s"
            />
          </circle>
          <circle cx="70" cy="75" r="4" fill="#fff" opacity="0.8">
            <animate
              attributeName="opacity"
              values="0.8;1;0.8"
              dur="1s"
              repeatCount="indefinite"
              begin="0.8s"
            />
          </circle>
          {/* D-pad */}
          <rect x="35" y="65" width="12" height="12" fill="#fff" opacity="0.7" rx="2" />
          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d97706" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.9" />
            </linearGradient>
          </defs>
        </Box>
      </Box>

      {/* Connecting line/effect */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '40%',
          height: 2,
          background: 'linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.5), transparent)',
          zIndex: 0,
          '&::before': {
            content: '""',
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(118, 75, 162, 0.5), transparent)',
            animation: `${glow} 2s ease-in-out infinite`,
          },
        }}
      />
    </Box>
  );
};
