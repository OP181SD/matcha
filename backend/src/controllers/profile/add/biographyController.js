import { updateBiography } from "../../../models/profile/Biography.js";
import { checkBiography } from "../../../services/validation/profile.js";

export const updateBiographyController = async (request, reply) => {
  try {
    const user = request.user;

    const { biography } = request.body;

    const bCheck = checkBiography(biography);
    if (!bCheck.ok) return reply.code(400).send({ error: bCheck.msg });

    await updateBiography(request.server.pg, user.id, biography);

    reply.code(200).send({ biography });
  } catch (err) {
    request.log.error(err, "Erreur dans updateBiography :");
    reply.code(500).send({ error: "Erreur lors de la mise à jour de la biographie." });
  }
};