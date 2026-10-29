

export const modelId = async (client, id) => {
  const result = await client.query('SELECT * FROM users WHERE id = $1;', [id]);
  return result.rows[0];
};

export const modelGetUserGender = async (server, userId) => {
  const result = await server.pg.query(
    'SELECT gender FROM profiles WHERE user_id = $1;',
    [userId]
  );
  return result.rows[0]?.gender;
};

export const getProfileByIdQuery = async (client, profileId, viewerId = null) => {
  const result = await client.query(`
    SELECT
      u.id AS user_id, u.username, u.is_online, u.last_seen,
      p.first_name, p.last_name, p.gender, p.age, p.sexual_preferences, p.biography,
      p.city, p.fame_rating, p.latitude, p.longitude, p.last_connection, u.created_at,
      EXISTS(SELECT 1 FROM likes WHERE liker_id = $1 AND liked_id = $2) AS likes_you,
      EXISTS(SELECT 1 FROM channel
             WHERE (user_id_1 = $1 AND user_id_2 = $2)
                OR (user_id_1 = $2 AND user_id_2 = $1)) AS connected
    FROM users u
    JOIN profiles p ON u.id = p.user_id
    WHERE u.id = $1
  `, [profileId, viewerId]);
  return result.rows;
};

export const getProfileTagsQuery = async (client, profileId) => {
  const result = await client.query(`
    SELECT t.name
    FROM profile_tags pt
    JOIN tags t ON pt.tag_id = t.id
    WHERE pt.profile_id = $1
  `, [profileId]);
  return result.rows.map(r => r.name);
};

export const getProfilePicturesQuery = async (client, profileId) => {
  const result = await client.query(`
    SELECT id, url, is_profile_picture
    FROM pictures
    WHERE user_id = $1
    ORDER BY is_profile_picture DESC, id ASC
  `, [profileId]);
  return result.rows.map(r => ({ id: r.id, url: r.url, is_profile_picture: r.is_profile_picture }));
};

export const getProfileLikesQuery = async (client, profileId) => {
  const result = await client.query(
    'SELECT COUNT(*) AS total_likes FROM likes WHERE liked_id = $1',
    [profileId]
  );
  return Number(result.rows[0]?.total_likes) || 0;
};

export const getProfileViewsQuery = async (client, profileId) => {
  const result = await client.query(
    'SELECT COUNT(*) AS total_views FROM views WHERE viewed_id = $1',
    [profileId]
  );
  return Number(result.rows[0]?.total_views) || 0;
};

export const insertProfileViewQuery = async (client, viewerId, viewedId) => {
  await client.query(
    'INSERT INTO views (viewer_id, viewed_id) VALUES ($1, $2)',
    [viewerId, viewedId]
  );
};

export const checkExistingViewQuery = async (client, viewerId, viewedId) => {
  const result = await client.query(
    'SELECT * FROM views WHERE viewer_id = $1 AND viewed_id = $2',
    [viewerId, viewedId]
  );
  return result.rows;
};