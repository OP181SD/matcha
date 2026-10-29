export const getUserFilters = async (pg, userId) => {
  return pg.query(
    `SELECT * FROM user_filters WHERE user_id = $1`,
    [userId]
  );
};

export const upsertUserFilters = async (pg, userId, ageRange, popularity, distance, tags) => {
  return pg.query(
    `
    INSERT INTO user_filters (
      user_id,
      age_min,
      age_max,
      popularity_min,
      distance_max,
      tags
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (user_id) DO UPDATE SET
      age_min = $2,
      age_max = $3,
      popularity_min = $4,
      distance_max = $5,
      tags = $6
    `,
    [
      userId,
      ageRange[0],
      ageRange[1],
      popularity,
      distance,
      tags
    ]
  );
};
