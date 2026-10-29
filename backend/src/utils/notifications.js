import { activeSockets } from '../socket/initializeSocketServer.js';
import { createNotification } from '../models/notifications/Notification.js';

const NOTIFICATION_TYPES = {
  LIKE_RECEIVED: 'like_received',
  PROFILE_VIEWED: 'profile_viewed',
  MATCH: 'match',
  MESSAGE_RECEIVED: 'message_received',
  LIKE_REMOVED: 'like_removed',
};

const sendNotification = async (io, targetUserId, type, data) => {
  try {

    const notification = await createNotification(targetUserId, type, data);

    const eventName = `notification_${type}`;

    const userSockets = activeSockets.get(targetUserId);

    if (!userSockets || userSockets.size === 0) {
      return notification;
    }

    const connectedSockets = new Set();
    for (const socket of userSockets) {
      if (socket && socket.connected) {
        connectedSockets.add(socket);
      } else {
      }
    }

    if (connectedSockets.size === 0) {
      activeSockets.delete(targetUserId);
      return notification;
    } else {
      activeSockets.set(targetUserId, connectedSockets);
    }

    let sentCount = 0;
    for (const socket of connectedSockets) {
      try {
        socket.emit(eventName, { ...data, id: notification.id });
        sentCount++;
      } catch (socketError) {
        console.error(` Erreur lors de l'envoi via socket ${socket.id}:`, socketError.message);
      }
    }

    return notification;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de notification:', error);
    throw error;
  }
};

const getUserInfo = async (fastify, userId) => {
  try {
    const { rows } = await fastify.pg.query(`
      SELECT u.id, u.username, p.first_name, p.last_name
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.id = $1
    `, [userId]);

    if (rows.length > 0) {
      const user = rows[0];
      return {
        id: user.id,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        displayName: user.first_name
          ? `${user.first_name} ${user.last_name || ''}`.trim()
          : user.username
      };
    }

    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération des infos utilisateur:', error);
    return null;
  }
};

export const sendLikeNotification = async (io, fastify, likerId, likedId) => {
  const liker = await getUserInfo(fastify, likerId);
  if (!liker) return;

  await sendNotification(io, likedId, NOTIFICATION_TYPES.LIKE_RECEIVED, {
    from_user_id: likerId,
    from_username: liker.displayName,
    message: `${liker.displayName} a aimé votre profil`
  });
};

export const sendProfileViewNotification = async (io, fastify, viewerId, viewedId) => {
  const viewer = await getUserInfo(fastify, viewerId);
  if (!viewer) return;

  await sendNotification(io, viewedId, NOTIFICATION_TYPES.PROFILE_VIEWED, {
    from_user_id: viewerId,
    from_username: viewer.displayName,
    message: `${viewer.displayName} a consulté votre profil`
  });
};

export const sendMatchNotification = async (io, fastify, user1Id, user2Id) => {
  const user1 = await getUserInfo(fastify, user1Id);
  const user2 = await getUserInfo(fastify, user2Id);

  if (!user1 || !user2) return;

  await sendNotification(io, user1Id, NOTIFICATION_TYPES.MATCH, {
    from_user_id: user2Id,
    from_username: user2.displayName,
    message: `Vous avez un match avec ${user2.displayName} !`
  });

  await sendNotification(io, user2Id, NOTIFICATION_TYPES.MATCH, {
    from_user_id: user1Id,
    from_username: user1.displayName,
    message: `Vous avez un match avec ${user1.displayName} !`
  });
};

export const sendMessageNotification = async (io, fastify, senderId, receiverId, messagePreview, channelId) => {
  const sender = await getUserInfo(fastify, senderId);
  if (!sender) return;

  await sendNotification(io, receiverId, NOTIFICATION_TYPES.MESSAGE_RECEIVED, {
    from_user_id: senderId,
    from_username: sender.displayName,
    preview: messagePreview,
    channel_id: channelId,
    message: `${sender.displayName}: ${messagePreview}`
  });
};

export const sendLikeRemovedNotification = async (io, fastify, likerId, likedId) => {
  const liker = await getUserInfo(fastify, likerId);
  if (!liker) return;

  await sendNotification(io, likedId, NOTIFICATION_TYPES.LIKE_REMOVED, {
    from_user_id: likerId,
    from_username: liker.displayName,
    message: `${liker.displayName} a retiré son like`
  });
};
