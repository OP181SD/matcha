import {
  createMessageController,
  getMessagesByChannelController,
  getLastMessageController,
  getUnreadMessagesCountController,
  markMessagesAsReadController,
} from "../controllers/message/messageController.js";
import { verifyChannelMember } from "../middlewares/verifyChannelMember.js";

export default async function messageRoutes(fastify) {
  fastify.post('/messages', { preHandler: [fastify.authenticate, verifyChannelMember({ source: 'body', rejectIfBlocked: true })] }, createMessageController);
  fastify.get('/messages/:channelId', { preHandler: [fastify.authenticate, verifyChannelMember({ source: 'params' })] }, getMessagesByChannelController);
  fastify.get('/messages/:channelId/last', { preHandler: [fastify.authenticate, verifyChannelMember({ source: 'params' })] }, getLastMessageController);
  fastify.put('/messages/:channelId/mark-as-read', { preHandler: [fastify.authenticate, verifyChannelMember({ source: 'params' })] }, markMessagesAsReadController);
  fastify.get('/messages/unread-count', { preHandler: [fastify.authenticate] }, getUnreadMessagesCountController);
};
