import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const isConnectingRef = useRef(false);
  const socketRef = useRef(null);

  const connectSocket = useCallback(() => {
    if (socketRef.current || isConnectingRef.current) return;

    isConnectingRef.current = true;

    const socketIo = io({
      transports: ['websocket'],
      withCredentials: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 5000,
    });

    socketIo.on('connect', () => {
      isConnectingRef.current = false;
      setIsReady(true);
      socketIo.emit('ping');
    });

    socketIo.on('disconnect', (reason) => {
      setIsReady(false);
      if (reason === 'io server disconnect') {

        socketRef.current = null;
        setSocket(null);
        isConnectingRef.current = false;
      }
    });

    socketIo.on('pong', () => {
    });

    socketIo.on('connect_error', (err) => {
      isConnectingRef.current = false;
      setIsReady(false);
    });

    socketIo.on('reconnect', (attemptNumber) => {
      setIsReady(true);
    });

    socketIo.on('reconnect_error', (err) => {
    });

    socketRef.current = socketIo;
    setSocket(socketIo);
  }, []);

  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
      setSocket(null);
      setIsReady(false);
      isConnectingRef.current = false;
    }
  }, []);

  useEffect(() => {
    const checkAuthAndConnect = async () => {
      try {
        const { data } = await axios.get('/api/check-auth', { withCredentials: true });

        if (data.user) {
          setUser(data.user);

          if (!isConnectingRef.current) {
            isConnectingRef.current = true;
            connectSocket();
          }
        }
      } catch (err) {
      }
    };
    checkAuthAndConnect();
    return () => {
      disconnectSocket();
    };
  }, [connectSocket, disconnectSocket]);

  return (
    <SocketContext.Provider value={{ socket, user, connectSocket, disconnectSocket, isReady }}>      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);