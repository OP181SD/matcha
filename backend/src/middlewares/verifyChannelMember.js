import { getChannelAccess } from "../models/messaging/channels.js";

export const verifyChannelMember = ({ source = 'params', rejectIfBlocked = false } = {}) =>
  async (request, reply) => {
    const user = request.user;
    if (!user?.id) {
      return reply.code(401).send({ error: "Utilisateur non authentifié." });
    }

    const channelId = source === 'body'
      ? request.body?.channelId
      : request.params?.channelId;

    if (channelId === undefined || channelId === null || channelId === '') {
      return reply.code(400).send({ error: "channelId requis." });
    }

    const access = await getChannelAccess(request.server.pg, channelId, user.id);

    if (!access) {

      return reply.code(404).send({ error: "Conversation introuvable." });
    }

    if (rejectIfBlocked && access.isBlocked) {
      return reply.code(403).send({ error: "Conversation indisponible." });
    }

    request.channelAccess = access;
  };