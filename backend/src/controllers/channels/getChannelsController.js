import { getUserChannels } from '../../models/messaging/channels.js';

export const getChannelsController = async (request, reply) => {
  try {
    const user = request.user;

    const userId = user.id;

    const { rows } = await getUserChannels(
      request.server.pg,
      userId
    );

    reply.code(200).send(rows);
  } catch (err) {
    request.log.error(err, "Erreur dans getChannelsController :");
    reply.code(500).send({
      error: "Erreur lors de la récupération des channels."
    });
  }
};
