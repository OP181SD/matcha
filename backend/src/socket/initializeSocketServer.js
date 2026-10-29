import { Server } from 'socket.io';
import {
  handlePing,
  addSocket,
  deleteSocket
} from './handler.js'

import {
  sendOnlineUser,
} from './client-server.js'

import {
  socketAuthMiddleware,
} from './token.js'

import {
  handleSendMessage,
} from './chat.js'

import {
  modelGetChannelsByUser
} from '../models/messaging/Message.js'

import {
  modelSetUserOnline,
  modelSetUserOffline,
} from '../models/user/presence.js'

export const activeSockets = new Map();

export const initializeSocketServer = (httpServer, fastify) => {

  const io = new Server(httpServer, {
    cors: {
      origin: [process.env.APP_URL || 'http://localhost:8080', 'http://localhost:3000'],
      credentials: true,
    },
  });

  io.use(socketAuthMiddleware(fastify));

  io.on('connection', async (socket) => {

    const channelIds = await modelGetChannelsByUser(socket.user.id);

    socket.on('joinChannels', async (channelIds) => {
      if (!Array.isArray(channelIds)) return;

      const owned = new Set(await modelGetChannelsByUser(socket.user.id));
      channelIds.forEach(channelId => {
        if (!owned.has(Number(channelId))) {
          console.warn(`[Socket ${socket.id}] join refusé pour channel_${channelId} (non membre)`);
          return;
        }
        socket.join('channel_' + channelId);
      });
    });

    socket.on('disconnect', async (reason) => {
      await deleteSocket(socket, io);

      if (!activeSockets.has(socket.user.id)) {
        await modelSetUserOffline(fastify, socket.user.id);
      }
      await sendOnlineUser(io, fastify);
    });

    await addSocket(socket);
    await modelSetUserOnline(fastify, socket.user.id);
    await sendOnlineUser(io, fastify);
    await handlePing(socket);

    socket.on('message', (data) => {
    });

    await handleSendMessage(io, socket, fastify);

    socket.on('notification_event', (data) => {
    })
  });
  return io;
};