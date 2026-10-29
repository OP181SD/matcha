import { 
  getNotifications, 
  markAsRead, 
  deleteNotificationController, 
  getUnreadCount 
} from '../controllers/notifications/notificationController.js';

export default async function notificationRoutes(fastify) {

  fastify.get('/notifications', { preHandler: [fastify.authenticate] }, getNotifications);
  fastify.get('/notifications/unread-count', { preHandler: [fastify.authenticate] }, getUnreadCount);
  fastify.patch('/notifications/:notificationId/read', { preHandler: [fastify.authenticate] }, markAsRead);
  fastify.delete('/notifications/:notificationId', { preHandler: [fastify.authenticate] }, deleteNotificationController);
}