export async function modelInsertPasswordResetToken(server, userId, token, expiresAt) {
  const existingToken = await server.pg.query(
    'SELECT 1 FROM password_reset_tokens WHERE user_id = $1 AND expires_at > NOW()',
    [userId]
  );

  if (existingToken.rowCount > 0) {
    throw new Error('RESET_TOKEN_ALREADY_EXISTS');
  }

  return server.pg.query(
    'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
    [userId, token, expiresAt]
  );
}

export async function modelEmailPasswordDeleteToken(request, token) {
  return request.server.pg.query(
    'DELETE FROM password_reset_tokens WHERE token = $1;',
    [token]
  );
}

export async function modelSearchTokenPassword(request, token) {
  const { rows } = await request.server.pg.query(
    'SELECT * FROM password_reset_tokens WHERE token = $1;',
    [token]
  );
  return rows[0];
}

export const modelGetExistingPasswordResetToken = async (server, userId) => {
  const { rows } = await server.pg.query(
    'SELECT * FROM password_reset_tokens WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1;',
    [userId]
  );
  return rows[0];
};

export async function modelDeleteUserPasswordResetTokens(server, userId) {
  return server.pg.query(
    'DELETE FROM password_reset_tokens WHERE user_id = $1;',
    [userId]
  );
}
