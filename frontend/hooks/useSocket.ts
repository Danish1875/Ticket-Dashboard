import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/stores/authStore';

const SOCKET_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) return;

    // Initialize socket connection
    socketRef.current = io(SOCKET_URL, {
      query: {
        userId: user.id,
      },
      transports: ['websocket', 'polling'],
    });

    socketRef.current.on('connect', () => {
      console.log('✅ WebSocket connected');
    });

    socketRef.current.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user]);

  const joinProject = (projectId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('join-project', projectId);
      console.log(`🔗 Joined project: ${projectId}`);
    }
  };

  const leaveProject = (projectId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('leave-project', projectId);
      console.log(`🔌 Left project: ${projectId}`);
    }
  };

  const on = (event: string, callback: (...args: any[]) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  };

  const off = (event: string, callback?: (...args: any[]) => void) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  };

  return {
    socket: socketRef.current,
    joinProject,
    leaveProject,
    on,
    off,
    isConnected: socketRef.current?.connected || false,
  };
};