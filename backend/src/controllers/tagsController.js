import { fastify } from '../../config/import.js';

export const addTags = async (request, reply) => {
    const userId = request.user.id;
    const { tags } = request.body;

    const client = await fastify.pg.connect();

    for (const tag of tags) {
        let { rowCount } = await client.query('SELECT id FROM tags WHERE name = $1', [tag]);
        let tagId;
        if (rowCount === 0) {
            const { rows } = await client.query('INSERT INTO tags (name) VALUES ($1) RETURNING id', [tag]);
            tagId = rows[0].id;
        } else {
            const { rows } = await client.query('SELECT id FROM tags WHERE name = $1', [tag]);
            tagId = rows[0].id;
        }

        await client.query(`
            INSERT INTO profile_tags (profile_id, tag_id)
            VALUES ($1, $2) ON CONFLICT DO NOTHING;
        `, [userId, tagId]);
    }

    client.release();
    return reply.send({ message: "Tags ajoutés avec succès", tags });
};
