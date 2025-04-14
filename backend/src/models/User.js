import { hashPassword, comparePassword } from '../utils/hash.js';

export async function modelRegister(request) {
    const { username, email, password } = request.body;
    const cryptedPassword = await hashPassword(password);

    const result = await request.server.pg.query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email;',
        [username, email, cryptedPassword]
    );
    return result.rows[0];
}

export async function modelLogin(request) {
    const { log, password } = request.body;

    if (!log || !password) {
        throw new Error("Aucun Params");
    }

    const result = await request.server.pg.query(
        'SELECT * FROM users WHERE (email = $1 OR username = $2)',
        [log, log]
    );

    if (result.rows.length > 0) {
        const user = result.rows[0];
        const isPasswordValid = await comparePassword(password, user.password);

        if (isPasswordValid) {
            return user;
        }
    }

    throw new Error('Identifiants incorrects');
}

export async function modelUpdateFields(request) {
    const { username, id } = request.body;

    if (!username || !id) {
        throw new Error('Champs "username" et "id" requis.');
    }

    const result = await request.server.pg.query(
        'UPDATE users SET username = $1 WHERE id = $2 RETURNING *',
        [username, id]
    );
    return result.rows[0];
}

export async function modelId(request, reply) {
    const { id } = request.body;

    if (!id) {
        return reply.code(400).send({ error: 'ID non fourni' });
    }

    const search = await request.server.pg.query('SELECT * FROM users WHERE id = $1', [id]);
    if (search.rows.length === 0) {
        return reply.code(400).send({ error: 'Aucun utilisateur trouvé' });
    }

    return reply.code(200).send({ modelId: search.rows[0] });
}

export async function modelDeleteAccount(request, reply) {
    const { id } = request.body;

    if (!id) {
        return reply.code(400).send({ error: 'ID non fourni' });
    }

    const del = await request.server.pg.query('DELETE FROM users WHERE id = $1', [id]);
    if (del.rowCount === 0) {
        return reply.code(400).send({ error: 'Aucun utilisateur trouvé' });
    }

    return reply.code(200).send({ message: 'Compte supprimé avec succès' });
}
