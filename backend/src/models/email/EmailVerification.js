export async function modelSearchToken(request, token) {
  const { rows } = await request.server.pg.query(
    'SELECT * FROM email_verification_tokens WHERE token = $1;',
    [token]
  );
  return rows[0];
}

export async function modelVerifyUser(userId, request) {
  return request.server.pg.query(
    'UPDATE users SET is_verified = true WHERE id = $1 RETURNING *;',
    [userId]
  );
}

export async function modelEmailDeleteToken(request, token) {
  return request.server.pg.query(
    'DELETE FROM email_verification_tokens WHERE token = $1;',
    [token]
  );
}

export async function modelDeleteUserEmailTokens(server, userId) {
  return server.pg.query(
    'DELETE FROM email_verification_tokens WHERE user_id = $1;',
    [userId]
  );
}

export const modelGetExistingEmailToken = async (server, userId) => {
  const { rows } = await server.pg.query(
    'SELECT * FROM email_verification_tokens WHERE user_id = $1;',
    [userId]
  );
  return rows[0];
};

export async function modelInsertEmailVerificationToken(server, userId, token, expiresAt) {
  const existingToken = await server.pg.query(
    'SELECT 1 FROM email_verification_tokens WHERE user_id = $1 AND expires_at > NOW()',
    [userId]
  );

  if (existingToken.rowCount > 0) {
    throw new Error('TOKEN_ALREADY_EXISTS');
  }

  return server.pg.query(
    'INSERT INTO email_verification_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
    [userId, token, expiresAt]
  );
}

export async function modelFindUserByEmail(request, email) {
  const result = await request.server.pg.query(
    'SELECT id, email, is_verified FROM users WHERE email = $1',
    [email]
  );

  return result.rows[0] ?? null;
}
