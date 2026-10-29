export const insertLike = async (client, likerId, likedId) => {
  return await client.query(`
    INSERT INTO likes (liker_id, liked_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
  `, [likerId, likedId]);
};

export const checkMutualLike = async (client, likerId, likedId) => {
  const { rows } = await client.query(`
    SELECT 1 FROM likes WHERE liker_id = $2 AND liked_id = $1
  `, [likerId, likedId]);
  return rows.length > 0;
};

export const getExistingChannel = async (client, user1, user2) => {
  const { rows } = await client.query(`
    SELECT id FROM channel 
    WHERE (user_id_1 = $1 AND user_id_2 = $2)
       OR (user_id_1 = $2 AND user_id_2 = $1)
  `, [user1, user2]);
  return rows;
};

export const createChannel = async (client, user1, user2) => {
  await client.query(`
    INSERT INTO channel (user_id_1, user_id_2)
    VALUES ($1, $2)
  `, [user1, user2]);
};

export const deleteChannel = async (pg, user1, user2) => {
  await pg.query(`
    DELETE FROM channel
    WHERE (user_id_1 = $1 AND user_id_2 = $2)
       OR (user_id_1 = $2 AND user_id_2 = $1)
  `, [user1, user2]);
};

export const checkUserLike = async (pg, likerId, likedId) => {
  return pg.query(
    `SELECT 1 FROM likes WHERE liker_id = $1 AND liked_id = $2`,
    [likerId, likedId]
  );
};

export const unlikeUser = async (pg, likerId, likedId) => {
  return pg.query(
    `DELETE FROM likes WHERE liker_id = $1 AND liked_id = $2`,
    [likerId, likedId]
  );
};

export const dislikeUser = async (pg, dislikerId, dislikedId) => {
  return pg.query(
    `
    INSERT INTO dislikes (disliker_id, disliked_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
    `,
    [dislikerId, dislikedId]
  );
};

export const getLikes = async (db, userId) => {
  const { rows } = await db.query(`
    SELECT
      u.id,
      u.username,
      u.is_online,
      u.last_seen,
      p.first_name,
      p.last_name,
      p.city,
      p.fame_rating,
      p.last_connection,
      l.created_at AS liked_at,
      (SELECT url FROM pictures WHERE user_id = u.id AND is_profile_picture = true LIMIT 1) AS profile_picture
    FROM likes l
    JOIN users u ON u.id = l.liker_id
    JOIN profiles p ON p.user_id = u.id
    WHERE l.liked_id = $1
    ORDER BY l.created_at DESC
  `, [userId]);

  return rows;
};

