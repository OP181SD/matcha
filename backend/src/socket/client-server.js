import { activeSockets } from "./initializeSocketServer.js";
import { modelOnlineUser } from "../models/user/presence.js";

export async function getConnectedUsers(fastify) {
  const connectedUsers = [];

  for (const [userId, socketSet] of activeSockets.entries()) {
    if (socketSet.size > 0) {
      try {
        const user = await modelOnlineUser(fastify.pg, userId);
        if (user) {
          connectedUsers.push({
            id: user.id,
            first_name: user.first_name,
            image_url: user.image_url,
            is_online: socketSet.size > 0,
            sockets: [...socketSet].map(s => s.id),
            last_seen: user.last_seen || null, 
          });
        }

      } catch (err) {
        console.error(`Erreur récupération utilisateur ${userId} :`, err.message);
      }
    }
  }
  return connectedUsers;
}

export const sendOnlineUser = async (io, fastify) => {
  const connectedUsers = await getConnectedUsers(fastify);
  io.emit("onlineUsers", connectedUsers);
};