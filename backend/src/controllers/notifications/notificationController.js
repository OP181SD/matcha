import { 
  getUserNotifications, 
  markNotificationAsRead, 
  deleteNotification,
  getUnreadNotificationCount 
} from "../../models/notifications/Notification.js";


export const getNotifications = async (request, reply) => {
  const userId = request.user.id;
  const limitNum = Number(request.query.limit);
  const limit = Number.isInteger(limitNum) && limitNum > 0 && limitNum <= 100 ? limitNum : 50;

  try {
    const notifications = await getUserNotifications(userId, limit);
    reply.send(notifications);
  } catch (error) {
    request.log.error(error, 'Erreur lors de la récupération des notifications:');
    reply.status(500).send({ error: 'Erreur serveur' });
  }
};


export const markAsRead = async (request, reply) => {
  const userId = request.user.id;
  const { notificationId } = request.params;
  
  try {
    await markNotificationAsRead(notificationId, userId);
    reply.send({ success: true });
  } catch (error) {
    request.log.error(error, 'Erreur lors du marquage de notification:');
    reply.status(500).send({ error: 'Erreur serveur' });
  }
};


export const deleteNotificationController = async (request, reply) => {
  const userId = request.user.id;
  const { notificationId } = request.params;
  
  try {
    await deleteNotification(notificationId, userId);
    reply.send({ success: true });
  } catch (error) {
    request.log.error(error, 'Erreur lors de la suppression de notification:');
    reply.status(500).send({ error: 'Erreur serveur' });
  }
};


export const getUnreadCount = async (request, reply) => {
  const userId = request.user.id;
  
  try {
    const count = await getUnreadNotificationCount(userId);
    reply.send({ count });
  } catch (error) {
    request.log.error(error, 'Erreur lors du comptage des notifications:');
    reply.status(500).send({ error: 'Erreur serveur' });
  }
};
