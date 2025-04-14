import { hashPassword } from '../utils/hash.js';

export async function modelId(request, reply) {
    const { id } = request.body;

    if (!id)
        return reply.code(400).send({ error: 'ID non fourni' });

    try {
        const search = await request.server.pg.query('SELECT * FROM users WHERE id = $1', [id]);
        if (search.rows.length === 0)
            return reply.code(400).send({ error: 'Aucun utilisateur trouvé' });

        return reply.code(200).send({ modelId: search.rows[0] });
    } catch (error) {
        reply.code(500).send({ error: 'Erreur lors de la recherche de l\'utilisateur' });
    }
}

export async function modelDeleteAccount(request, reply) {
    const { id } = request.body;

    if (!id)
        return reply.code(400).send({ error: 'ID non fourni' });

    try {
        const del = await request.server.pg.query('DELETE FROM users WHERE id = $1', [id]);
        if (del.rowCount === 0)
            return reply.code(400).send({ error: 'Aucun utilisateur trouvé' });

        return reply.code(200).send({ message: 'Compte supprimé avec succès' });
    } catch (error) {
        reply.code(500).send({ error: 'Erreur lors de la suppression du compte' });
    }
}

export async function modelRegister(request) {
    const { username, email, password } = request.body;
    const cryptedPassword = await hashPassword(password);

    try {
        const result = await request.server.pg.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email;',
            [username, email, cryptedPassword]
        );
        return result.rows[0];
    } catch (err) {
        throw new Error('Erreur lors de l\'inscription'); 
    }
}

export async function modelUpdateFields(request) {
    const { username, id } = request.body;

    if (!username || !id) {
        throw new Error('Champs "username" et "id" requis.');
    }

    try {
        const result = await request.server.pg.query(
            'UPDATE users SET username = $1 WHERE id = $2 RETURNING *',
            [username, id]
        );
        return result.rows[0];
    } catch (err) {
        throw new Error("Erreur lors de la mise à jour du username.");
    }
}