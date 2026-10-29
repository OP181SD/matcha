import { createReport } from "../../models/report/createReport.js";
import { dislikeUser } from "../../models/likes/Likes.js";
import { deleteChannelBetweenUsers } from "../../models/messaging/channels.js";

export const reportUserController = async (request, reply) => {
  const client = await request.server.pg.connect();

  try {
    const user = request.user;

    const reportedId = Number(request.body?.reportedId);
    const reason = typeof request.body?.reason === 'string' ? request.body.reason.trim() : '';
    if (!Number.isInteger(reportedId) || reportedId <= 0 || reportedId === user.id) {
      return reply.code(400).send({ error: "Cible de signalement invalide." });
    }
    if (reason.length === 0 || reason.length > 500) {
      return reply.code(400).send({ error: "Motif de signalement invalide (1-500 caractères)." });
    }

    await client.query('BEGIN');

    await createReport(
      client,
      user.id,
      reportedId,
      reason
    );

    await dislikeUser(
      client,
      user.id,
      reportedId
    );

    await deleteChannelBetweenUsers(
      client,
      user.id,
      reportedId
    );

    await client.query('COMMIT');

    reply.code(200).send({
      success: true,
      message: "Signalement traité avec succès."
    });
  } catch (err) {
    await client.query('ROLLBACK');
    request.log.error(err, "Erreur dans reportUserController :");
    reply.code(500).send({
      error: "Erreur lors du signalement."
    });
  } finally {
    client.release();
  }
};
