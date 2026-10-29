export const getViewByViewerAndViewed = async (pg, viewerId, viewedId) => {
  const { rows } = await pg.query(
    `SELECT * FROM views WHERE viewer_id = $1 AND viewed_id = $2`,
    [viewerId, viewedId]
  );
  return rows[0] || null;
};

export const insertView = async (pg, viewerId, viewedId) => {
  await pg.query(
    `INSERT INTO views (viewer_id, viewed_id) VALUES ($1, $2)`,
    [viewerId, viewedId]
  );
};

export const getVisitorsOfUser = async (pg, userId) => {
  const { rows } = await pg.query(`
    SELECT DISTINCT ON (u.id)
      u.id,
      u.is_online,
      u.last_seen,
      p.first_name,
      p.last_name,
      p.city,
      p.fame_rating,
      p.last_connection,
      v.viewed_at,
      COALESCE(
        json_agg(
          jsonb_build_object('id', pic.id, 'url', pic.url, 'is_profile_picture', pic.is_profile_picture)
          ORDER BY pic.is_profile_picture DESC, pic.id ASC
        ) FILTER (WHERE pic.id IS NOT NULL),
        '[]'
      ) AS pictures
    FROM views v
    JOIN users u ON v.viewer_id = u.id
    JOIN profiles p ON u.id = p.user_id
    LEFT JOIN pictures pic ON pic.user_id = u.id
    WHERE v.viewed_id = $1
    GROUP BY u.id, u.is_online, u.last_seen, p.first_name, p.last_name, p.city, p.fame_rating, p.last_connection, v.viewed_at
    ORDER BY u.id, v.viewed_at DESC
  `, [userId]);

  return rows;
};