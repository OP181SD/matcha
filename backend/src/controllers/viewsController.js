import { fastify } from '../../config/import.js';

export const getViews = async (request, reply) => {
    const userId = request.user.id;
    const client = await fastify.pg.connect();

    const { rows } = await client.query(`
        SELECT viewer_id, viewed_at FROM views
        WHERE viewed_id = $1 ORDER BY viewed_at DESC;
    `, [userId]);

    client.release();
    return reply.send(rows);
};
