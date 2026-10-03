'use client';

import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(token?: string | null): Socket | null {
  if (typeof window === 'undefined') return null;

  const socketUrl =
    process.env.NEXT_PUBLIC_SOCKET_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    'http://localhost:5000';

  if (!socket) {
    socket = io(socketUrl, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
      withCredentials: true,
      auth: token ? { token } : undefined,
    });
  } else if (token && socket.auth && (socket.auth as Record<string, any>).token !== token) {
    socket.auth = { token };
    if (socket.connected) {
      socket.disconnect().connect();
    }
  }

  return socket;
}

export function connectSocket(token?: string | null): Socket | null {
  const s = getSocket(token);
  if (s && !s.connected) {
    if (token) {
      s.auth = { token };
    }
    s.connect();
  }
  return s;
}

export function disconnectSocket() {
  if (socket && socket.connected) {
    socket.disconnect();
  }
}
