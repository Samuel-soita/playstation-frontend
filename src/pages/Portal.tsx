import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { SportsEsports, Security } from '@mui/icons-material';
import * as styles from './Portal.styles';

export const Portal = () => {
  const navigate = useNavigate();

  const handleGamesClick = () => {
    navigate('/dashboard');
  };

  const handleCyberClick = () => {
    // For now, show alert. Later this can navigate to cyber frontend
    alert('Cyber S-Web frontend coming soon!');
    // When cyber frontend is ready, uncomment:
    // window.location.href = 'http://localhost:3001'; // or your cyber frontend URL
  };

  return (
    <Box sx={styles.container}>
      {/* Background with animated image */}
      <Box sx={styles.backgroundContainer} />
      <Box sx={styles.overlay} />

      {/* Main Portal Card */}
      <Box sx={styles.loginWrapper}>
        <Typography variant="h1" sx={styles.title}>
          Select Portal
        </Typography>
        <Typography variant="body1" sx={styles.subtitle}>
          Access restricted. Choose your destination.
        </Typography>

        <Box sx={styles.optionsContainer}>
          {/* Games E-Web Portal */}
          <Box
            sx={styles.portalCard as any}
            className="games-portal"
            onClick={handleGamesClick}
          >
            <SportsEsports sx={styles.portalIcon as any} style={{ color: '#bd00ff' }} />
            <Typography variant="h2" sx={styles.portalTitle}>
              GAMES E-WEB
            </Typography>
            <Typography variant="body2" sx={styles.portalDescription}>
              Access User Dashboards, Asset Store, and Gaming Profiles.
            </Typography>
            <Button sx={styles.loginBtn as any} className="games-btn">
              Enter Zone
            </Button>
          </Box>

          {/* Cyber S-Web Portal */}
          <Box
            sx={styles.portalCard as any}
            className="cyber-portal"
            onClick={handleCyberClick}
          >
            <Security sx={styles.portalIcon as any} style={{ color: '#00fff2' }} />
            <Typography variant="h2" sx={styles.portalTitle}>
              CYBER S-WEB
            </Typography>
            <Typography variant="body2" sx={styles.portalDescription}>
              Access Admin Controls, Security Protocols, and System Logs.
            </Typography>
            <Button sx={styles.loginBtn as any} className="cyber-btn">
              Secure Login
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
