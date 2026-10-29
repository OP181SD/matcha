import { activeSockets } from "./initializeSocketServer.js";

const cleanupDisconnectedSockets = () => {
  let cleanedCount = 0;

  for (const [userId, userSockets] of activeSockets.entries()) {
    const connectedSockets = new Set();

    for (const socket of userSockets) {
      if (socket.connected) {
        connectedSockets.add(socket);
      } else {
        cleanedCount++;
      }
    }

    if (connectedSockets.size === 0) {
      activeSockets.delete(userId);
    } else {
      activeSockets.set(userId, connectedSockets);
    }
  }

};

setInterval(cleanupDisconnectedSockets, 30000);

export const handlePing = async (socket) => {
  socket.on('ping', () => {
    socket.emit('pong');
  });
};

const displayUserSockets = async (userId) => {
  const userSockets = activeSockets.get(userId);
  if (!userSockets) return;
  const socketIds = [...userSockets].map(s => s.id);


  for (const socket of userSockets) {
  }

};

export const addSocket = async (socket) => {
  if (!socket?.user?.id) {
    console.warn('[addSocket] Socket invalide : user.id manquant');
    return;
  }

  const userId = socket.user.id;

  if (!activeSockets.has(userId)) {
    activeSockets.set(userId, new Set());
  }

  const userSockets = activeSockets.get(userId);

  for (const oldSocket of [...userSockets]) {
    if (!oldSocket.connected) {
      userSockets.delete(oldSocket);
    }
  }

  userSockets.add(socket);


  displayUserSockets(userId);
};


export const deleteSocket = async (socket, io) => {
  if (!socket?.user?.id) {
    console.warn('[deleteSocket] Socket invalide : user.id manquant');
    return;
  }

  const userId = socket.user.id;

  if (!activeSockets.has(userId)) {
    return;
  }

  const userSockets = activeSockets.get(userId);
  userSockets.delete(socket);

  const socketIds = [...userSockets].map(s => s.id);

  if (userSockets.size === 0) {
    activeSockets.delete(userId);
  }
};
