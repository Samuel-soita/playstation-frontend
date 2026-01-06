import { useState, useEffect } from 'react';
import { Typography } from '@mui/material';

interface SessionTimerProps {
  startTime: string;
}

export const SessionTimer = ({ startTime }: SessionTimerProps) => {
  const [elapsed, setElapsed] = useState<string>('00:00:00');

  useEffect(() => {
    const updateTimer = () => {
      const start = new Date(startTime).getTime();
      const now = new Date().getTime();
      const diff = Math.floor((now - start) / 1000); // difference in seconds

      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;

      const formatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      setElapsed(formatted);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <Typography variant="body2" component="span" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
      {elapsed}
    </Typography>
  );
};
