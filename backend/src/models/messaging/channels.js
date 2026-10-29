export const getChannelAccess = async (pg, channelId, userId) => {
  const id = Number(channelId);
  if (!Number.isInteger(id) || id <= 0) return null;

  const { rows } = await pg.query(
    `SELECT
       c.id,
       CASE WHEN c.user_id_1 = $2 THEN c.user_id_2 ELSE c.user_id_1 END AS other_user_id,
       EXISTS (
         SELECT 1 FROM blocks b
         WHERE (b.blocker_id = $2 AND b.blocked_id = CASE WHEN c.user_id_1 = $2 THEN c.user_id_2 ELSE c.user_id_1 END)
            OR (b.blocked_id = $2 AND b.blocker_id = CASE WHEN c.user_id_1 = $2 THEN c.user_id_2 ELSE c.user_id_1 END)
       ) AS is_blocked
     FROM channel c
     WHERE c.id = $1
       AND (c.user_id_1 = $2 OR c.user_id_2 = $2)`,
    [id, userId]
  );

  if (rows.length === 0) return null;

  return {
    channelId: rows[0].id,
    otherUserId: rows[0].other_user_id,
    isBlocked: rows[0].is_blocked,
  };
};

export const getUserChannels = async (pg, userId) => {
  return pg.query(
    `
    SELECT c.id AS channel_id,
           CASE WHEN c.user_id_1 = $1 THEN c.user_id_2 ELSE c.user_id_1 END AS matched_user_id,
           u.username,
           p.first_name,
           p.last_name,
           p.gender,
           p.age,
           p.city,
           u.is_online,
           u.last_seen,
           EXISTS (
             SELECT 1 FROM blocks b
             WHERE (b.blocker_id = $1 AND b.blocked_id = u.id)
                OR (b.blocked_id = $1 AND b.blocker_id = u.id)
           ) AS is_blocked,
           (SELECT url FROM pictures pic
            WHERE pic.user_id = u.id AND pic.is_profile_picture
            LIMIT 1) AS profile_picture
    FROM channel c
    JOIN users u ON u.id = CASE WHEN c.user_id_1 = $1 THEN c.user_id_2 ELSE c.user_id_1 END
    JOIN profiles p ON p.user_id = u.id
    WHERE c.user_id_1 = $1 OR c.user_id_2 = $1
    `,
    [userId]
  );
};

export const deleteChannelBetweenUsers = async (client, userId1, userId2) => {
  return client.query(
    `
    DELETE FROM channel
    WHERE (user_id_1 = $1 AND user_id_2 = $2)
       OR (user_id_1 = $2 AND user_id_2 = $1)
    `,
    [userId1, userId2]
  );
};
