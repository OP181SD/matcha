import {
  modelGetUserGender,
  getProfileByIdQuery,
  getProfileTagsQuery,
  getProfilePicturesQuery,
  getProfileLikesQuery,
  getProfileViewsQuery,
  insertProfileViewQuery,
  checkExistingViewQuery
} from "../../models/profile/profileQueries.js";

import { updateOrientationAndGender } from "../../models/profile/GenderOrientation.js";
import { updateFameRating } from "../../models/profile/fameRating.js";
import { checkGender, checkSexualPreferences } from "../../services/validation/profile.js";



export const getUserGender = async (request, reply) => {
  try {
    const userId = request.user.id;

    const gender = await modelGetUserGender(request.server, userId);
    reply.send({ gender });
  } catch (err) {
    request.log.error(err, "Erreur lors de la récupération du genre :");
    reply.code(500).send({ error: 'Erreur interne du serveur' });
  }
};


export const updateOrientationAndGenderController = async (request, reply) => {
  try {
    const user = request.user;

    const { gender, orientation } = request.body;

    const gCheck = checkGender(gender);
    if (!gCheck.ok) return reply.code(400).send({ error: gCheck.msg });
    const pCheck = checkSexualPreferences(orientation);
    if (!pCheck.ok) return reply.code(400).send({ error: pCheck.msg });

    await updateOrientationAndGender(request.server.pg, user.id, gender, orientation);

    reply.code(200).send({ message: "Genre et orientation mis à jour avec succès." });
  } catch (err) {
    request.log.error(err, "Erreur dans updateOrientationAndGenderController :");
    reply.code(500).send({ error: "Erreur lors de la mise à jour du profil." });
  }
};

export const getProfileById = async (request, reply) => {
  const profileId = request.params.id;
  const viewerId = request.user?.id;
  const client = await request.server.pg.connect();

  try {
    const profileRows = await getProfileByIdQuery(client, profileId, viewerId ?? null);

    if (profileRows.length === 0) return reply.code(404).send({ error: "Profil introuvable." });

    if (viewerId && viewerId !== parseInt(profileId)) {
      const { rows: blockRows } = await client.query(
        `SELECT 1 FROM blocks
         WHERE (blocker_id = $1 AND blocked_id = $2)
            OR (blocker_id = $2 AND blocked_id = $1)
         LIMIT 1`,
        [viewerId, parseInt(profileId)]
      );
      if (blockRows.length > 0) {
        return reply.code(403).send({ error: "Ce profil n'est pas accessible." });
      }
    }

    const profile = profileRows[0];

    if (viewerId && viewerId !== parseInt(profileId)) {
      const existingViewRows = await checkExistingViewQuery(client, viewerId, profileId);

      if (existingViewRows.length === 0) {
        await insertProfileViewQuery(client, viewerId, profileId);
        await updateFameRating(request.server.pg, parseInt(profileId), 1);

        const { sendProfileViewNotification } = await import('../../utils/notifications.js');
        await sendProfileViewNotification(request.server.io, request.server, viewerId, parseInt(profileId));
      }
    }

    const tags = await getProfileTagsQuery(client, profileId);
    const pictures = await getProfilePicturesQuery(client, profileId);
    const totalLikes = await getProfileLikesQuery(client, profileId);
    const totalViews = await getProfileViewsQuery(client, profileId);

    return reply.send({
      id: profile.user_id,
      username: profile.username,
      is_online: profile.is_online,
      last_seen: profile.last_seen,
      first_name: profile.first_name,
      last_name: profile.last_name,
      gender: profile.gender,
      age: profile.age,
      sexual_preferences: profile.sexual_preferences,
      biography: profile.biography,
      city: profile.city,
      fame_rating: profile.fame_rating,
      latitude: profile.latitude,
      longitude: profile.longitude,
      last_connection: profile.last_connection,
      created_at: profile.created_at,
      likes_you: profile.likes_you,
      connected: profile.connected,
      tags,
      pictures,
      stats: { likes: totalLikes, views: totalViews }
    });
  } catch (err) {
    request.log.error(err, "Erreur getProfileById :");
    reply.code(500).send({ error: "Erreur lors de la récupération du profil." });
  } finally {
    client.release();
  }
};





