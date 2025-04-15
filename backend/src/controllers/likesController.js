import { fastify } from '../../config/import.js';

export const getLikes = async (request, reply) => {
    const userId = request.user.id;
    const client = await fastify.pg.connect();

    const { rows } = await client.query(`
        SELECT liker_id, created_at FROM likes
        WHERE liked_id = $1 ORDER BY created_at DESC;
    `, [userId]);

    client.release();
    return reply.send(rows);
};
