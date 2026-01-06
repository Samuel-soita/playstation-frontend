import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  Link,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff, CheckCircle } from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { AnimatedGamingPads } from './AnimatedGamingPads';
import { Animated3DScene } from './Animated3DScene';
import { BackgroundToggle } from './BackgroundToggle';
import * as styles from './Login.styles';

export const Login = () => {
  const [usr, setUsr] = useState(() => {
    // Load saved username from localStorage
    return localStorage.getItem('rememberedUsername') || '';
  });
  const [pwd, setPwd] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showUsernameField, setShowUsernameField] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem('rememberMe') === 'true';
  });
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { login } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Video URL for 3D background
  const videoUrl = '/assets/videos/3d-gaming-scene.mp4';

  // Show username field after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowUsernameField(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Show password field when username has content
  useEffect(() => {
    if (usr.trim().length > 0 && !showPasswordField) {
      const timer = setTimeout(() => {
        setShowPasswordField(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [usr, showPasswordField]);

  // Real-time validation
  useEffect(() => {
    if (usr.trim().length > 0 && usr.trim().length < 3) {
      setUsernameError('Username must be at least 3 characters');
    } else {
      setUsernameError('');
    }
  }, [usr]);

  useEffect(() => {
    if (pwd.length > 0 && pwd.length < 6) {
      setPasswordError('Password must be at least 6 characters');
    } else {
      setPasswordError('');
    }
  }, [pwd]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !loading && usr && pwd) {
        const form = document.querySelector('form');
        if (form) {
          form.requestSubmit();
        }
      }
      if (e.key === 'Escape') {
        setUsr('');
        setPwd('');
        setError('');
        setUsernameError('');
        setPasswordError('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [loading, usr, pwd]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setUsernameError('');
    setPasswordError('');
    setShake(false);
    setSuccess(false);

    // Validation
    if (!usr.trim()) {
      setUsernameError('Username is required');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    if (!pwd) {
      setPasswordError('Password is required');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setLoading(true);

    try {
      await login(usr, pwd);
      
      // Save credentials if remember me is checked
      if (rememberMe) {
        localStorage.setItem('rememberedUsername', usr);
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberedUsername');
        localStorage.setItem('rememberMe', 'false');
      }

      // Show success animation
      setSuccess(true);
      
      // Navigate after short delay to show success animation
      setTimeout(() => {
        navigate('/dashboard');
      }, 800);
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || 'Invalid username or password'
      );
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setLoading(false);
    }
  };

  return (
    <Box sx={styles.container(theme)}>
      {/* Dark/Light Mode Toggle */}
      <BackgroundToggle />

      {/* Video Background */}
      <Animated3DScene isVideo={true} videoUrl={videoUrl} />

      {/* Main Login Card */}
      <Box sx={styles.loginWrapper(theme, shake, success)}>
        {/* Success Icon Overlay */}
        {success && (
          <Box sx={styles.successIcon}>
            <CheckCircle fontSize="inherit" />
          </Box>
        )}
        
        {/* Loading Spinner Overlay */}
        {loading && !success && (
          <Box sx={styles.loadingSpinner}>
            <CircularProgress size={60} thickness={4} sx={{ color: '#667eea' }} />
          </Box>
        )}
        <Box sx={styles.header}>
          <AnimatedGamingPads />
          <Typography variant="h1" sx={styles.title(theme)}>
            PlayStation Digital System
          </Typography>
          <Typography variant="body1" sx={styles.subtitle(theme)}>
            Games Service - Sign in to your account
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={styles.alert}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={styles.form}>
          <Box sx={styles.animatedField(showUsernameField, 0)}>
            <TextField
              fullWidth
              label="Username"
              value={usr}
              onChange={(e) => setUsr(e.target.value)}
              required
              autoFocus
              autoComplete="username"
              error={!!usernameError}
              helperText={usernameError}
              sx={styles.textField(theme, !!usernameError)}
              InputProps={{
                sx: styles.input,
              }}
              aria-label="Username input field"
              aria-describedby={usernameError ? 'username-error' : undefined}
            />
          </Box>

          {showPasswordField && (
            <Box sx={styles.animatedField(true, 0.1)}>
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                required
                autoComplete="current-password"
                error={!!passwordError}
                helperText={passwordError || 'Minimum 6 characters'}
                sx={styles.textField(theme, !!passwordError)}
                InputProps={{
                  sx: styles.input,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        aria-label="toggle password visibility"
                        tabIndex={-1}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                aria-label="Password input field"
                aria-describedby={passwordError ? 'password-error' : 'password-helper'}
              />
            </Box>
          )}

          {showPasswordField && (
            <>
              <Box sx={styles.animatedField(true, 0.2)}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      sx={styles.rememberMe}
                    />
                  }
                  label="Remember me"
                  sx={styles.rememberMe}
                />
              </Box>
              
              <Box sx={styles.animatedField(true, 0.25)}>
                <Box sx={styles.forgotPassword}>
                  <Link
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      // TODO: Navigate to forgot password page
                      alert('Forgot password feature coming soon!');
                    }}
                    aria-label="Forgot password link"
                  >
                    Forgot password?
                  </Link>
                </Box>
              </Box>

              <Box sx={styles.animatedField(true, 0.3)}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading || success}
                  sx={styles.submitButton}
                  aria-label="Sign in button"
                >
                  {loading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={20} sx={{ color: 'white' }} />
                      Signing in...
                    </Box>
                  ) : success ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircle sx={{ fontSize: 20 }} />
                      Success!
                    </Box>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};
