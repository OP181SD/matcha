import { blockUser, unblockUser, getBlockedUsers } from '../../models/bloc/blocModel.js';

export const blockUserController = async (request, reply) => {
  try {
    const user = request.user;

    const blockedId = Number(request.body?.blockedId);
    if (!Number.isInteger(blockedId) || blockedId <= 0 || blockedId === user.id) {
      return reply.code(400).send({ error: "Cible de blocage invalide." });
    }

    await blockUser(request.server.pg, user.id, blockedId);

    reply.code(200).send({
      success: true,
      message: "Utilisateur bloqué avec succès."
    });
  } catch (err) {
    request.log.error(err, "Erreur dans blockUserController :");
    reply.code(500).send({
      error: "Erreur lors du blocage."
    });
  }
};

export const unblockUserController = async (request, reply) => {
  try {
    const user = request.user;

    const unblockedId = Number(request.body?.unblockedId);
    if (!Number.isInteger(unblockedId) || unblockedId <= 0 || unblockedId === user.id) {
      return reply.code(400).send({ error: "Cible de déblocage invalide." });
    }

    await unblockUser(request.server.pg, user.id, unblockedId);

    reply.code(200).send({
      success: true,
      message: "Utilisateur débloqué avec succès."
    });
  } catch (err) {
    request.log.error(err, "Erreur dans unblockUserController :");
    reply.code(500).send({
      error: "Erreur lors du déblocage."
    });
  }
};

export const getBlockedUsersController = async (request, reply) => {
  try {
    const user = request.user;

    const { rows } = await getBlockedUsers(request.server.pg, user.id);

    reply.code(200).send(rows);
  } catch (err) {
    request.log.error(err, "Erreur dans getBlockedUsersController :");
    reply.code(500).send({
      error: "Erreur lors de la récupération des utilisateurs bloqués."
    });
  }
};
