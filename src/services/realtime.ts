import { io, Socket } from 'socket.io-client';
import { GameSpace, GameSession } from '@/types';

class RealtimeService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private listeners: Map<string, Function[]> = new Map();

  constructor() {
    this.connect();
  }

  private connect() {
    // Use relative URL in development so it goes through Vite proxy
    const baseURL = import.meta.env.DEV ? '' : window.location.origin;

    this.socket = io(baseURL, {
      path: '/api/socket.io',
      transports: ['websocket', 'polling'],
      upgrade: true,
      rememberUpgrade: true,
      timeout: 20000,
      forceNew: false,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.socket.on('connect', () => {
      console.log('🔗 Connected to real-time service');
      this.reconnectAttempts = 0;
      this.emit('connected', { status: 'connected' });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Disconnected from real-time service:', reason);
      this.emit('disconnected', { reason });
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
      this.reconnectAttempts++;
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        this.emit('connection_failed', { error: error.message });
      }
    });

    // Listen for real-time updates
    this.socket.on('game_space_update', (data: { game_space: GameSpace }) => {
      console.log('🎮 Game space updated:', data.game_space.game_space_id);
      this.emit('game_space_update', data.game_space);
    });

    this.socket.on('game_session_update', (data: { session: GameSession }) => {
      console.log('⏰ Game session updated:', data.session.name);
      this.emit('game_session_update', data.session);
    });

    this.socket.on('session_created', (data: { session: GameSession }) => {
      console.log('🎯 New session created:', data.session.name);
      this.emit('session_created', data.session);
    });

    this.socket.on('session_terminated', (data: { session_id: string, invoice_id: string }) => {
      console.log('🏁 Session terminated:', data.session_id);
      this.emit('session_terminated', data);
    });

    this.socket.on('payment_processed', (data: { payment_id: string, amount: number, method: string }) => {
      console.log('💰 Payment processed:', data.payment_id);
      this.emit('payment_processed', data);
    });

    this.socket.on('caffe_action_logged', (data: { action: string, timestamp: string }) => {
      console.log('☕ Caffe action logged:', data.action);
      this.emit('caffe_action_logged', data);
    });
  }

  // Event subscription system
  public on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  private emit(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in event callback:', error);
        }
      });
    }
  }

  // Send real-time updates to server
  public updateGameSpace(gameSpaceId: string, updates: Partial<GameSpace>) {
    if (this.socket?.connected) {
      this.socket.emit('update_game_space', { game_space_id: gameSpaceId, updates });
    }
  }

  public updateGameSession(sessionId: string, updates: Partial<GameSession>) {
    if (this.socket?.connected) {
      this.socket.emit('update_game_session', { session_id: sessionId, updates });
    }
  }

  public notifySessionCreated(session: GameSession) {
    if (this.socket?.connected) {
      this.socket.emit('session_created', { session });
    }
  }

  public notifySessionTerminated(sessionId: string, invoiceId: string) {
    if (this.socket?.connected) {
      this.socket.emit('session_terminated', { session_id: sessionId, invoice_id: invoiceId });
    }
  }

  public notifyPaymentProcessed(paymentId: string, amount: number, method: string) {
    if (this.socket?.connected) {
      this.socket.emit('payment_processed', { payment_id: paymentId, amount, method });
    }
  }

  public notifyCaffeAction(action: string) {
    if (this.socket?.connected) {
      this.socket.emit('caffe_action', { action, timestamp: new Date().toISOString() });
    }
  }

  // Connection status
  public get isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public reconnect() {
    if (!this.socket?.connected) {
      this.connect();
    }
  }
}

// Singleton instance
export const realtimeService = new RealtimeService();