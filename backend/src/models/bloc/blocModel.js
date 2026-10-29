export const blockUser = async (pg, blockerId, blockedId) => {
  return pg.query(
    `
    INSERT INTO blocks (blocker_id, blocked_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
    `,
    [blockerId, blockedId]
  );
};

export const unblockUser = async (pg, userId, unblockedId) => {
  return pg.query(
    `
    DELETE FROM blocks
    WHERE blocker_id = $1 AND blocked_id = $2
    `,
    [userId, unblockedId]
  );
};

export const getBlockedUsers = async (pg, userId) => {
  return pg.query(
    `
    SELECT
      u.id,
      u.username,
      p.first_name,
      p.last_name,
      p.city,
      (SELECT url FROM pictures WHERE user_id = u.id AND is_profile_picture = true LIMIT 1) AS profile_picture
    FROM users u
    JOIN profiles p ON u.id = p.user_id
    JOIN blocks b ON b.blocked_id = u.id
    WHERE b.blocker_id = $1
    ORDER BY u.username
    `,
    [userId]
  );
};
