import {
  modelCreateMessage,
  modelGetMessagesByChannel,
  getLastMessage,
  getUnreadMessagesCount,
  markMessagesAsRead,
} from "../../models/messaging/Message.js";
import { decryptMessage } from '../../utils/messageCrypto.js';

export const createMessageController = async (request, reply) => {
    try {
        const senderId = request.user.id; 
        const { channelId, content } = request.body;

        if (!channelId || !content) {
            return reply.status(400).send({ error: "channelId et content sont requis" });
        }

        const message = await modelCreateMessage({ channelId, senderId, content });
        return reply.status(201).send(message);
    } catch (error) {
        request.log.error(error, 'Erreur création message:');
        return reply.status(500).send({ error: 'Erreur serveur lors de la création du message' });
    }
};

export const getMessagesByChannelController = async (request, reply) => {
    try {
        const { channelId } = request.params;
        const countNum = Number(request.query.count);
        const count = Number.isInteger(countNum) && countNum > 0 && countNum <= 100 ? countNum : 50;
        const messages = await modelGetMessagesByChannel(channelId, count);
        return reply.send(messages);
    } catch (error) {
        request.log.error(error, 'Erreur récupération messages:');
        return reply.status(500).send({ error: 'Erreur serveur' });
    }
};

export const getLastMessageController = async (request, reply) => {
  try {
    const { channelId } = request.params;

    let lastMessage = await getLastMessage(request.server.pg, channelId);

    if (lastMessage) {
      try {
        lastMessage.content = decryptMessage(lastMessage.content);
      } catch (err) {
        request.log.error(err, 'Erreur décryptage du dernier message:');
        lastMessage.content = "[Message illisible]";
      }
    }

    reply.code(200).send({ message: lastMessage || null });
  } catch (err) {
    request.log.error(err, "Erreur dans getLastMessageController :");
    reply.code(500).send({ error: "Erreur lors de la récupération du dernier message" });
  }
};

export const getUnreadMessagesCountController = async (request, reply) => {
  try {
    const user = request.user;

    const count = await getUnreadMessagesCount(request.server.pg, user.id);
    reply.code(200).send({ count });
  } catch (err) {
    request.log.error(err, "Erreur dans getUnreadMessagesCountController :");
    reply.code(500).send({
      error: "Erreur lors de la récupération du nombre de messages non lus."
    });
  }
};

export const markMessagesAsReadController = async (request, reply) => {
  try {
    const user = request.user;

    const { channelId } = request.params;

    const result = await markMessagesAsRead(request.server.pg, channelId, user.id);

    reply.code(200).send({
      status: 'success',
      updatedRows: result.rowCount
    });
  } catch (err) {
    request.log.error(err, "Erreur dans markMessagesAsReadController :");
    reply.code(500).send({
      error: 'Erreur serveur lors du marquage des messages comme lus'
    });
  }
};
