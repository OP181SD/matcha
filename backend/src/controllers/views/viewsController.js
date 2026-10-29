import { getViewByViewerAndViewed, insertView, getVisitorsOfUser } from "../../models/views/Views.js";
import { sendProfileViewNotification } from "../../utils/notifications.js";
import { updateFameRating } from "../../models/profile/fameRating.js";

export const addViewController = async (request, reply) => {
  const fastify = request.server;
  const viewerId = request.user.id;
  const viewedId = Number(request.body?.viewedId);

  if (!Number.isInteger(viewedId) || viewedId <= 0) {
    return reply.code(400).send({ error: "Cible de vue invalide." });
  }
  if (viewerId === viewedId) {
    return reply.code(400).send({ error: "Vous ne pouvez pas vous voir vous-même." });
  }

  try {
    const existingView = await getViewByViewerAndViewed(fastify.pg, viewerId, viewedId);

    if (existingView) {
      return reply.code(200).send({ alreadyViewed: true });
    }

    await insertView(fastify.pg, viewerId, viewedId);
    await updateFameRating(fastify.pg, viewedId, 1);
    await sendProfileViewNotification(fastify.io, fastify, viewerId, viewedId);

    reply.code(200).send({ success: true });
  } catch (err) {
    fastify.log.error(err);
    reply.code(500).send({ error: "Erreur lors de l'enregistrement de la vue." });
  }
};

export const getViewsController = async (request, reply) => {
  const fastify = request.server;
  const userId = request.user.id;
  try {
    const views = await getVisitorsOfUser(fastify.pg, userId);
    reply.code(200).send(views);
  } catch (err) {
    fastify.log.error(err);
    reply.code(500).send({ error: "Erreur lors de la récupération des vues." });
  }
};
