import { useEffect } from 'react';
import { useSocket } from './Socket.jsx';

export function SocketAutoConnect() {
  const { socket, connectSocket } = useSocket();

  useEffect(() => {
    if (!socket) {
      connectSocket();
    }
  }, [socket, connectSocket]);

  return null; 
}