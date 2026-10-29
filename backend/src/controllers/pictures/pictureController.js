import { fastify } from "../../instance.js";
import { modelDeletePictureById, addPictureModel } from '../../models/picture/Pictures.js';
import { isValidCloudinaryImageUrl } from '../../utils/validateImageUrl.js';

const MATCHA_DEFAULT_URL = 'https://cdn.jsdelivr.net/npm/openmoji@15.0.0/color/svg/1F375.svg';

export const uploadPicture = async (request, reply) => {
    const userId = request.user.id;
    const { url, is_profile_picture } = request.body;

    if (!isValidCloudinaryImageUrl(url)) {
        return reply.code(400).send({ error: "URL d'image invalide." });
    }

    const client = await fastify.pg.connect();

    try {
        const { rows: countRows } = await client.query(
            'SELECT COUNT(*) AS total FROM pictures WHERE user_id = $1',
            [userId]
        );
        if (parseInt(countRows[0].total) >= 5) {
            return reply.code(403).send({ error: "Vous ne pouvez pas avoir plus de 5 photos." });
        }

        if (is_profile_picture) {
            await client.query('UPDATE pictures SET is_profile_picture = FALSE WHERE user_id = $1', [userId]);
        }

        await client.query(`
            INSERT INTO pictures (user_id, url, is_profile_picture)
            VALUES ($1, $2, $3);
        `, [userId, url, is_profile_picture]);

        reply.send({ message: "Image enregistrée avec succès." });
    } catch (err) {
        request.log.error(err.message, "Erreur uploadPicture :");
        reply.code(500).send({ error: "Erreur serveur lors de l'enregistrement de l'image." });
    } finally {
        client.release();
    }
};

export const setProfilePicture = async (request, reply) => {
    const userId = request.user.id;
    const { imageUrl } = request.body;

    if (!imageUrl) {
        return reply.code(400).send({ error: 'URL de la photo manquante' });
    }

    if (!isValidCloudinaryImageUrl(imageUrl)) {
        return reply.code(400).send({ error: "URL d'image invalide." });
    }

    const client = await fastify.pg.connect();
    try {
        await client.query('UPDATE pictures SET is_profile_picture = FALSE WHERE user_id = $1', [userId]);
        await client.query('UPDATE pictures SET is_profile_picture = TRUE WHERE user_id = $1 AND url = $2', [userId, imageUrl]);
        await client.query('UPDATE profiles SET image_url = $1 WHERE user_id = $2', [imageUrl, userId]);

        reply.send({ success: true });
    } catch (err) {
        request.log.error(err, "Erreur DB:");
        reply.code(500).send({ error: "Erreur serveur" });
    } finally {
        client.release();
    }
};

export const getPictures = async (request, reply) => {
    const { userId } = request.params;

    try {
        const { rows } = await request.server.pg.query(
            'SELECT id, url, is_profile_picture FROM pictures WHERE user_id = $1',
            [userId]
        );
        reply.send(rows);
    } catch (err) {
        request.log.error(err.message, "Erreur getPictures :");
        reply.code(500).send({ error: "Erreur serveur lors de la récupération des photos." });
    }
};

export const getProfilePicture = async (request, reply) => {
    const { userId } = request.params;

    try {
        const { rows } = await request.server.pg.query(
            'SELECT url FROM pictures WHERE user_id = $1 AND is_profile_picture = TRUE LIMIT 1',
            [userId]
        );

        const profilePic = rows[0]?.url;
        reply.send({ url: profilePic });
    } catch (err) {
        request.log.error(err, "Erreur récupération photo de profil:");
        reply.code(500).send({ error: "Erreur serveur" });
    }
};


export const deletePicture = async (request, reply) => {
  const userId = request.user.id;
  const { photoId } = request.params;

  try {
    const rowCount = await modelDeletePictureById(request.server, photoId, userId);

    if (rowCount === 0) {
      return reply.code(404).send({ error: 'Photo non trouvée ou non autorisée.' });
    }

    const { rows: hasProfilePic } = await request.server.pg.query(
      'SELECT 1 FROM pictures WHERE user_id = $1 AND is_profile_picture = TRUE LIMIT 1',
      [userId]
    );
    if (hasProfilePic.length === 0) {
      const { rows: next } = await request.server.pg.query(
        'SELECT id, url FROM pictures WHERE user_id = $1 ORDER BY id DESC LIMIT 1',
        [userId]
      );
      if (next.length > 0) {
        await request.server.pg.query('UPDATE pictures SET is_profile_picture = TRUE WHERE id = $1', [next[0].id]);
        await request.server.pg.query('UPDATE profiles SET image_url = $1 WHERE user_id = $2', [next[0].url, userId]);
      } else {
        await request.server.pg.query('UPDATE profiles SET image_url = $1 WHERE user_id = $2', [MATCHA_DEFAULT_URL, userId]);
      }
    }

    reply.send({ message: 'Photo supprimée avec succès.' });
  } catch (err) {
    request.log.error(err.message, "Erreur deletePicture :");
    reply.code(500).send({ error: "Erreur lors de la suppression de la photo." });
  }
};

export const addPicture = async (request, reply) => {
  try {
    const { imageUrl } = request.body;

    if (!imageUrl) {
      return reply.code(400).send({ error: "URL de l'image manquante" });
    }

    if (!isValidCloudinaryImageUrl(imageUrl)) {
      return reply.code(400).send({ error: "URL d'image invalide." });
    }

    const userId = request.user.id;

    const { rows: countRows } = await request.server.pg.query(
      "SELECT COUNT(*) AS total FROM pictures WHERE user_id = $1",
      [userId]
    );
    if (parseInt(countRows[0].total) >= 5) {
      return reply.code(403).send({ error: "Vous ne pouvez pas avoir plus de 5 photos." });
    }

    const picture = await addPictureModel(request.server.pg, userId, imageUrl);
    reply.code(201).send({ message: "Image ajoutée avec succès.", picture });
  } catch (err) {
    request.log.error(err, "Erreur dans addPicture :");
    reply.code(500).send({ error: "Erreur serveur lors de l'ajout de la photo." });
  }
};
