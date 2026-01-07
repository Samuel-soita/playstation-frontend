import { useEffect, useState, useCallback } from 'react';
import { realtimeService } from '@/services/realtime';
import { GameSpace, GameSession } from '@/types';

interface RealtimeData {
  gameSpaces: GameSpace[];
  activeSessions: GameSession[];
  connectionStatus: 'connected' | 'disconnected' | 'connecting' | 'failed';
  lastUpdate: Date | null;
}

interface PaymentData {
  payment_id: string;
  amount: number;
  method: string;
}

interface CaffeActionData {
  action: string;
  timestamp: string;
}

export const useRealtime = () => {
  const [data, setData] = useState<RealtimeData>({
    gameSpaces: [],
    activeSessions: [],
    connectionStatus: 'connecting',
    lastUpdate: null,
  });

  const [notifications, setNotifications] = useState<{
    payments: PaymentData[];
    caffeActions: CaffeActionData[];
    sessionEvents: { type: 'created' | 'terminated'; session_id: string; data?: any }[];
  }>({
    payments: [],
    caffeActions: [],
    sessionEvents: [],
  });

  // Update game space data
  const updateGameSpace = useCallback((updatedSpace: GameSpace) => {
    setData(prev => ({
      ...prev,
      gameSpaces: prev.gameSpaces.map(space =>
        space.name === updatedSpace.name ? updatedSpace : space
      ),
      lastUpdate: new Date(),
    }));
  }, []);

  // Update session data
  const updateGameSession = useCallback((updatedSession: GameSession) => {
    setData(prev => ({
      ...prev,
      activeSessions: prev.activeSessions.map(session =>
        session.name === updatedSession.name ? updatedSession : session
      ),
      lastUpdate: new Date(),
    }));
  }, []);

  // Add new session
  const addNewSession = useCallback((newSession: GameSession) => {
    setData(prev => ({
      ...prev,
      activeSessions: [...prev.activeSessions, newSession],
      lastUpdate: new Date(),
    }));

    setNotifications(prev => ({
      ...prev,
      sessionEvents: [
        ...prev.sessionEvents.slice(-4), // Keep last 5 events
        { type: 'created', session_id: newSession.name, data: newSession }
      ],
    }));
  }, []);

  // Remove terminated session
  const removeTerminatedSession = useCallback((sessionData: { session_id: string; invoice_id: string }) => {
    setData(prev => ({
      ...prev,
      activeSessions: prev.activeSessions.filter(session => session.name !== sessionData.session_id),
      lastUpdate: new Date(),
    }));

    setNotifications(prev => ({
      ...prev,
      sessionEvents: [
        ...prev.sessionEvents.slice(-4), // Keep last 5 events
        { type: 'terminated', session_id: sessionData.session_id, data: sessionData }
      ],
    }));
  }, []);

  // Add payment notification
  const addPaymentNotification = useCallback((payment: PaymentData) => {
    setNotifications(prev => ({
      ...prev,
      payments: [...prev.payments.slice(-4), payment], // Keep last 5 payments
    }));
  }, []);

  // Add caffe action notification
  const addCaffeAction = useCallback((action: CaffeActionData) => {
    setNotifications(prev => ({
      ...prev,
      caffeActions: [...prev.caffeActions.slice(-4), action], // Keep last 5 actions
    }));
  }, []);

  // Set connection status
  const setConnectionStatus = useCallback((status: RealtimeData['connectionStatus']) => {
    setData(prev => ({ ...prev, connectionStatus: status }));
  }, []);

  // Initialize data
  const initializeData = useCallback((gameSpaces: GameSpace[], activeSessions: GameSession[]) => {
    setData(prev => ({
      ...prev,
      gameSpaces,
      activeSessions,
      lastUpdate: new Date(),
    }));
  }, []);

  useEffect(() => {
    // Set up real-time listeners
    const unsubscribers = [
      realtimeService.on('connected', () => setConnectionStatus('connected')),
      realtimeService.on('disconnected', () => setConnectionStatus('disconnected')),
      realtimeService.on('connection_failed', () => setConnectionStatus('failed')),
      realtimeService.on('game_space_update', updateGameSpace),
      realtimeService.on('game_session_update', updateGameSession),
      realtimeService.on('session_created', addNewSession),
      realtimeService.on('session_terminated', removeTerminatedSession),
      realtimeService.on('payment_processed', addPaymentNotification),
      realtimeService.on('caffe_action_logged', addCaffeAction),
    ];

    // Set initial connection status
    setConnectionStatus(realtimeService.isConnected ? 'connected' : 'connecting');

    // Cleanup function
    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [updateGameSpace, updateGameSession, addNewSession, removeTerminatedSession, addPaymentNotification, addCaffeAction, setConnectionStatus]);

  return {
    ...data,
    notifications,
    initializeData,
    isOnline: data.connectionStatus === 'connected',
  };
};