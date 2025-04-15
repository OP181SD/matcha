import { fastify } from '../../config/import.js';

export const uploadPicture = async (request, reply) => {
    const userId = request.user.id;
    const { url, is_profile_picture } = request.body;

    const client = await fastify.pg.connect();

    if (is_profile_picture) {
        await client.query('UPDATE pictures SET is_profile_picture = FALSE WHERE user_id = $1', [userId]);
    }

    await client.query(`
        INSERT INTO pictures (user_id, url, is_profile_picture)
        VALUES ($1, $2, $3);
    `, [userId, url, is_profile_picture]);

    client.release();
    return reply.send({ message: "Image enregistrée avec succès." });
};
