export const modelUpdateFirstName = (request) =>
  request.server.pg.query(
    'UPDATE profiles SET first_name = $1 WHERE user_id = $2 RETURNING *;',
    [request.body.first_name, request.user.id]
  );

export const modelUpdateLastName = (request) =>
  request.server.pg.query(
    'UPDATE profiles SET last_name = $1 WHERE user_id = $2 RETURNING *;',
    [request.body.last_name, request.user.id]
  );

export const modelUpdateUsername = (request) =>
  request.server.pg.query(
    'UPDATE users SET username = $1 WHERE id = $2 RETURNING *;',
    [request.body.username, request.user.id]
  );

export const modelUpdateEmail = (request) =>
  request.server.pg.query(
    'UPDATE users SET email = $1, is_verified = false WHERE id = $2 RETURNING *;',
    [request.body.email, request.user.id]
  );

export const modelUpdatePassword = (server, userId, hashedPassword) =>
  server.pg.query(
    'UPDATE users SET password = $1 WHERE id = $2 RETURNING *;',
    [hashedPassword, userId]
  );

export const modelGetUserPasswordById = async (server, userId) => {
  const { rows } = await server.pg.query('SELECT password FROM users WHERE id = $1;', [userId]);
  return rows[0]?.password ?? null;
};
