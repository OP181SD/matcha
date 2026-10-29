import { addTagsModel, getAllTagsModel, getTagsByUserModel } from "../../models/tags/Tags.js";

export const addTags = async (request, reply) => {
  try {
    const user = request.user;

    const { tags } = request.body;
    if (!Array.isArray(tags)) {
      return reply.code(400).send({ error: "Liste de tags invalide." });
    }

    const clean = [...new Set(
      tags
        .filter(t => typeof t === 'string')
        .map(t => t.trim().toLowerCase())
        .filter(t => t.length >= 1 && t.length <= 30)
    )];
    if (clean.length > 20) {
      return reply.code(400).send({ error: "Trop de tags (maximum 20)." });
    }

    await addTagsModel(request.server.pg, user.id, clean);
    reply.code(200).send({ message: "Tags mis à jour avec succès", tags: clean });

  } catch (err) {
    request.log.error(err, "Erreur dans addTags :");
    reply.code(500).send({ error: "Erreur serveur lors de la mise à jour des tags" });
  }
};

export const getAllTags = async (request, reply) => {
  try {
    const tags = await getAllTagsModel(request.server.pg);
    reply.code(200).send(tags);
  } catch (err) {
    request.log.error(err, "Erreur dans getAllTags :");
    reply.code(500).send({ error: "Erreur serveur lors de la récupération des tags" });
  }
};

export const getTagsByUser = async (request, reply) => {
  try {
    const userId = request.params.userId;
    if (!userId) {
      return reply.code(400).send({ error: "ID utilisateur manquant." });
    }

    const tags = await getTagsByUserModel(request.server.pg, userId);
    reply.code(200).send(tags);

  } catch (err) {
    request.log.error(err, "Erreur dans getTagsByUser :");
    reply.code(500).send({ error: "Erreur serveur lors de la récupération des tags" });
  }
};
