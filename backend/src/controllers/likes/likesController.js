import {
  getLikes,
  insertLike,
  checkMutualLike,
  getExistingChannel,
  createChannel,
  deleteChannel,
  checkUserLike,
  unlikeUser,
  dislikeUser,
} from '../../models/likes/Likes.js';
import { sendLikeNotification, sendMatchNotification, sendLikeRemovedNotification } from '../../utils/notifications.js';
import { updateFameRating } from "../../models/profile/fameRating.js";
export const getLikesController = async (request, reply) => {
  try {
    const user = request.user;

    const likes = await getLikes(request.server.pg, user.id);
    reply.code(200).send(likes);
  } catch (err) {
    request.log.error(err, "Erreur dans getLikes :");
    reply.code(500).send({ error: 'Erreur serveur lors de la récupération des likes.' });
  }
};

export const likeController = async (request, reply) => {
  const likerId = request.user?.id;
  const likedId = Number(request.body?.likedId);

  if (!Number.isInteger(likedId) || likedId <= 0) {
    return reply.code(400).send({ error: "Cible de like invalide." });
  }
  if (likedId === likerId) {
    return reply.code(400).send({ error: "Vous ne pouvez pas vous liker vous-même." });
  }

  const { rows: picRows } = await request.server.pg.query(
    'SELECT id FROM pictures WHERE user_id = $1 AND is_profile_picture = true LIMIT 1',
    [likerId]
  );
  if (picRows.length === 0) {
    return reply.code(403).send({ error: "Vous devez avoir une photo de profil pour liker." });
  }

  const client = await request.server.pg.connect();

  try {
    const { rowCount } = await insertLike(client, likerId, likedId);

    if (rowCount === 0) {
      return reply.send({ success: true, match: false, message: 'Like déjà existant.' });
    }

    await updateFameRating(request.server.pg, likedId, 2);
    await sendLikeNotification(request.server.io, request.server, likerId, likedId);

    const isMutual = await checkMutualLike(client, likerId, likedId);

    if (isMutual) {
      const existingChannel = await getExistingChannel(client, likerId, likedId);

      if (existingChannel.length === 0) {
        await createChannel(client, likerId, likedId);
      }

      await updateFameRating(request.server.pg, likerId, 3);
      await updateFameRating(request.server.pg, likedId, 3);
      await sendMatchNotification(request.server.io, request.server, likerId, likedId);

      return reply.send({ success: true, match: true, message: 'Like mutuel, match créé !' });
    }

    
    reply.send({ success: true, match: false, message: 'Like enregistré, pas encore mutuel.' });

  } catch (err) {
    if (err.code === '23503') return reply.code(404).send({ error: "Utilisateur introuvable." });
    request.log.error(err, "Erreur dans likeController :");
    reply.code(500).send({ error: 'Erreur lors du like' });
  } finally {
    client.release();
  }
};

export const unlikeController = async (request, reply) => {
  try {
    const user = request.user;

    const { likedId } = request.body;

    const { rowCount } = await unlikeUser(
      request.server.pg,
      user.id,
      likedId
    );

    if (rowCount > 0) {
      await updateFameRating(request.server.pg, likedId, -1);
      await deleteChannel(request.server.pg, user.id, likedId);
      await sendLikeRemovedNotification(
        request.server.io,
        request.server,
        user.id,
        likedId
      );
    }

    reply.code(200).send({
      success: true,
      message: "Like annulé avec succès."
    });
  } catch (err) {
    request.log.error(err, "Erreur dans unlikeController :");
    reply.code(500).send({
      error: "Erreur lors de l'annulation du like."
    });
  }
};

export const checkLikeController = async (request, reply) => {
  try {
    const user = request.user;

    const profileId = request.params.id;

    const { rows } = await checkUserLike(request.server.pg, user.id, profileId);

    reply.code(200).send({
      liked: rows.length > 0
    });
  } catch (err) {
    request.log.error(err, "Erreur dans checkLikeController :");
    reply.code(500).send({
      error: "Erreur lors de la vérification du like."
    });
  }
};

export const dislikeController = async (request, reply) => {
  try {
    const user = request.user;

    const dislikedId = Number(request.body?.dislikedId);
    if (!Number.isInteger(dislikedId) || dislikedId <= 0 || dislikedId === user.id) {
      return reply.code(400).send({ error: "Cible de dislike invalide." });
    }

    await dislikeUser(request.server.pg, user.id, dislikedId);

    reply.code(200).send({
      success: true,
      message: "Utilisateur disliké avec succès."
    });
  } catch (err) {
    request.log.error(err, "Erreur dans dislikeController :");
    reply.code(500).send({
      error: "Erreur lors du dislike."
    });
  }
};


