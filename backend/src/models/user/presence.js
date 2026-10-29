export const modelSetUserOnline = async (server, userId) => {
  await server.pg.query(
    'UPDATE users SET is_online = TRUE, last_seen = CURRENT_TIMESTAMP WHERE id = $1',
    [userId]
  );
};

export const modelSetUserOffline = async (server, userId) => {
  const result = await server.pg.query(
    `UPDATE users
     SET is_online = FALSE, last_seen = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING id, is_online, last_seen`,
    [userId]
  );

  return result.rows[0];
};

export const modelOnlineUser = async (client, userId) => {
  const result = await client.query(
    `SELECT u.id, u.username, u.is_online, u.last_seen, p.image_url, p.first_name
     FROM users u
     LEFT JOIN profiles p ON u.id = p.user_id
     WHERE u.id = $1`,
    [userId]
  );

  if (result.rowCount === 0) return null;

  return result.rows[0];
};
