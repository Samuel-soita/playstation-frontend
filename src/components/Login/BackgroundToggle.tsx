import { Box, FormControlLabel, Switch, Typography } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';
import { useTheme } from '@/contexts/ThemeContext';
import * as styles from './BackgroundToggle.styles';

export const BackgroundToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Box sx={styles.toggleContainer}>
      <FormControlLabel
        control={
          <Switch
            checked={isDarkMode}
            onChange={toggleTheme}
            sx={styles.switchStyles}
          />
        }
        label={
          <Box sx={styles.labelContainer}>
            {isDarkMode ? (
              <>
                <DarkMode sx={styles.icon} />
                <Typography variant="body2" sx={styles.labelText}>
                  Dark Mode
                </Typography>
              </>
            ) : (
              <>
                <LightMode sx={styles.icon} />
                <Typography variant="body2" sx={styles.labelText}>
                  Light Mode
                </Typography>
              </>
            )}
          </Box>
        }
        sx={styles.formControl}
      />
    </Box>
  );
};
