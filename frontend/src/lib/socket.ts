'use client'

import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'https://socity-backend-production.up.railway.app';

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      reconnectionAttempts: 5,
      withCredentials: true,
      transports: ['websocket', 'polling']
    });
  }
  return socket;
};

export const connectSocket = (societyId: number | string) => {
  const s = getSocket();
  if (!s.connected) {
    s.connect();
    s.on('connect', () => {
      console.log('Connected to socket server');
      s.emit('join-society', societyId);
    });
  } else {
    s.emit('join-society', societyId);
  }
  return s;
};

export const connectPlatformAdmin = () => {
  const s = getSocket();
  if (!s.connected) {
    s.connect();
    s.on('connect', () => {
      console.log('Connected to socket server as platform admin');
      s.emit('join-platform-admin');
    });
  } else {
    s.emit('join-platform-admin');
  }
  return s;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
