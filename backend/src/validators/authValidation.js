export async function validateRegisterFields(request, reply) {
    const { username, email, password, confirmPassword } = request.body;

    if (!username || !email || !password || !confirmPassword) {
        reply.code(400).send({ modelRegisterError: 'Champs requis.' });
        return false;
    }

    if (password !== confirmPassword) {
        reply.code(400).send({ modelRegisterError: 'Les mots de passe ne correspondent pas' });
        return false;
    }

    return true;
}

export async function validateDuplicateFields(request, reply) {
    const { username, email } = request.body;
    const existingUser = await request.server.pg.query(
        'SELECT * FROM users WHERE email = $1 OR username = $2',
        [email, username]
    );

    if (existingUser.rows.length > 0) {
        reply.code(400).send({ error: 'L\'email ou le nom d\'utilisateur est déjà pris' });
        return false;
    }

    return true;
}