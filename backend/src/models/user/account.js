export const modelFindUserByUsername = async (server, username) => {
  const result = await server.pg.query(
    'SELECT id, username, email, password, is_verified FROM users WHERE LOWER(username) = $1',
    [username]
  );

  return result.rows[0];
};

export const modelDeleteAccount = async (pg, userId) => {
  if (!userId) {
    throw new Error('Utilisateur non authentifié');
  }

  const del = await pg.query('DELETE FROM users WHERE id = $1', [userId]);

  if (del.rowCount === 0) {
    return false;
  }

  return true;
};

export const modelDeleteExpiredUnverifiedUsers = async (request) => {
  const result = await request.server.pg.query(
    `DELETE FROM users
     WHERE is_verified = false
       AND created_at < NOW() - INTERVAL '30 minutes'
     RETURNING id, email, created_at;`
  );

  return result.rows;
};
