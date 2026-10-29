import { modelCreateMessage } from "../models/messaging/Message.js";
import { sendMessageNotification } from "../utils/notifications.js";
import { getChannelAccess } from "../models/messaging/channels.js";
import { activeSockets } from "./initializeSocketServer.js";

const emitToUsers = (userIds, event, payload) => {
    for (const userId of userIds) {
        const userSockets = activeSockets.get(userId);
        if (!userSockets) continue;
        for (const s of userSockets) {
            if (s.connected) s.emit(event, payload);
        }
    }
};

export const handleSendMessage = async (io, socket, fastify) => {

    socket.on("markMessagesAsRead", async ({ channelId }) => {
        try {
            const access = await getChannelAccess(fastify.pg, channelId, socket.user.id);
            if (!access) return;

            const { rows } = await fastify.pg.query(
                `UPDATE messages
             SET is_read = TRUE, read_at = NOW()
             WHERE channel_id = $1 AND sender_id != $2 AND is_read = FALSE
             RETURNING read_at`,
                [access.channelId, socket.user.id]
            );
            const readAt = rows[0]?.read_at || new Date().toISOString();
            io.to(`channel_${access.channelId}`).emit("messagesRead", { channelId: access.channelId, readAt });
        } catch (err) {
            console.error("Erreur lors de la mise à jour des messages lus :", err);
        }
    });

    socket.on("typing", async ({ channelId }) => {
        const access = await getChannelAccess(fastify.pg, channelId, socket.user.id);
        if (!access) return;
        emitToUsers([access.otherUserId], "userTyping", {
            userId: socket.user.id,
            channelId: access.channelId,
        });
    });

    socket.on('sendMessage', async (data) => {
        if (!data.content || typeof data.content !== 'string' || data.content.length > 1000) return;

        try {
            const access = await getChannelAccess(fastify.pg, data.channelId, socket.user.id);
            if (!access) {
                console.warn(`[chat] Accès refusé channel ${data.channelId} pour user ${socket.user.id}`);
                return;
            }
            if (access.isBlocked) {
                socket.emit('messageError', {
                    channelId: access.channelId,
                    error: "Vous ne pouvez plus envoyer de message à cette personne.",
                });
                return;
            }

            const message = await modelCreateMessage({
                channelId: access.channelId,
                senderId: socket.user.id,
                content: data.content
            });

            emitToUsers([socket.user.id, access.otherUserId], 'newMessage', {
                ...message,
                senderId: socket.user.id,
                gender: data.gender,
                channelId: access.channelId,
                is_read: false,
            });

            const messagePreview = data.content.length > 50
                ? data.content.substring(0, 50) + '...'
                : data.content;

            await sendMessageNotification(
                io, fastify, socket.user.id, access.otherUserId, messagePreview, access.channelId
            );
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message:', error);
        }
    });
}