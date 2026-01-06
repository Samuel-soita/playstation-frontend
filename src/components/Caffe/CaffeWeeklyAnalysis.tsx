import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import * as styles from './CaffeWeeklyAnalysis.styles';

export const CaffeWeeklyAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);

  const fetchAnalysis = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Implement weekly analysis API call
      // const data = await apiService.getWeeklyAnalysis();
      // setAnalysis(data);
      
      // Placeholder data
      setAnalysis({
        most_played_game: 'FIFA 24',
        activity_rate: 75.5,
        most_frequented_day: 'Saturday',
        daily_growth: 12.5,
        weekly_growth: 8.3,
        monthly_growth: 15.2,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load analysis');
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchAnalysis();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={styles.title}>
        Weekly Analysis
      </Typography>

      {analysis && (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="text.secondary">
                  Most Played Game
                </Typography>
                <Typography variant="h4" color="primary">
                  {analysis.most_played_game}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="text.secondary">
                  Customer Activity Rate
                </Typography>
                <Typography variant="h4" color="success.main">
                  {analysis.activity_rate.toFixed(2)}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="text.secondary">
                  Most Frequented Day
                </Typography>
                <Typography variant="h4" color="info.main">
                  {analysis.most_frequented_day}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="text.secondary">
                  Daily Growth
                </Typography>
                <Typography variant="h4" color="warning.main">
                  {analysis.daily_growth.toFixed(2)}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="text.secondary">
                  Weekly Growth
                </Typography>
                <Typography variant="h4" color="success.main">
                  {analysis.weekly_growth.toFixed(2)}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};
