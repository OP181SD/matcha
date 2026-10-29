const SORT_MAP = {
  distance: 'distance ASC NULLS LAST, common_tags_count DESC, p.fame_rating DESC',
  age: 'p.age ASC, p.fame_rating DESC',
  fame: 'p.fame_rating DESC, p.age ASC',
  tags: 'common_tags_count DESC, p.fame_rating DESC',
};

export const searchProfiles = async (pg, userId, params = {}) => {
  const { rows: userProfileRows } = await pg.query(
    `SELECT latitude, longitude, gender, sexual_preferences FROM profiles WHERE user_id = $1`,
    [userId]
  );
  if (!userProfileRows.length) return [];

  const { latitude: userLat, longitude: userLon, gender: userGender } = userProfileRows[0];
  const userPrefs = userProfileRows[0].sexual_preferences || 'bisexuel';
  const hasLocation = userLat != null && userLon != null;

  const { ageMin, ageMax, popularityMin, popularityMax, distanceMax, tags, sortBy } = params;

  const filterClauses = [];
  const queryParams = [userLat, userLon, userId];
  let index = 4;

  if (ageMin) { filterClauses.push(`p.age >= $${index++}`); queryParams.push(ageMin); }
  if (ageMax) { filterClauses.push(`p.age <= $${index++}`); queryParams.push(ageMax); }
  if (popularityMin) { filterClauses.push(`p.fame_rating >= $${index++}`); queryParams.push(popularityMin); }
  if (popularityMax) { filterClauses.push(`p.fame_rating <= $${index++}`); queryParams.push(popularityMax); }
  if (distanceMax && hasLocation) {
    filterClauses.push(`(
      6371 * acos(
        cos(radians($1)) * cos(radians(p.latitude)) *
        cos(radians(p.longitude) - radians($2)) +
        sin(radians($1)) * sin(radians(p.latitude))
      )
    ) <= $${index++}`);
    queryParams.push(distanceMax);
  }
  if (tags && tags.length > 0) {
    filterClauses.push(`EXISTS (
      SELECT 1 FROM profile_tags pt
      JOIN tags t ON pt.tag_id = t.id
      WHERE pt.profile_id = p.user_id AND t.name = ANY($${index++})
    )`);
    queryParams.push(tags);
  }

  let targetGenders = [], targetPreferences = [];
  if (userGender === 'homme') {
    if (userPrefs === 'hétérosexuel') { targetGenders = ['femme']; targetPreferences = ['bisexuel', 'hétérosexuel']; }
    else if (userPrefs === 'homosexuel') { targetGenders = ['homme']; targetPreferences = ['bisexuel', 'homosexuel']; }
    else { targetGenders = ['homme', 'femme']; targetPreferences = ['bisexuel', 'hétérosexuel', 'homosexuel']; }
  } else if (userGender === 'femme') {
    if (userPrefs === 'hétérosexuel') { targetGenders = ['homme']; targetPreferences = ['bisexuel', 'hétérosexuel']; }
    else if (userPrefs === 'homosexuel') { targetGenders = ['femme']; targetPreferences = ['bisexuel', 'homosexuel']; }
    else { targetGenders = ['homme', 'femme']; targetPreferences = ['bisexuel', 'hétérosexuel', 'homosexuel']; }
  } else {
    targetGenders = ['homme', 'femme'];
    targetPreferences = ['bisexuel', 'hétérosexuel', 'homosexuel'];
  }

  const genderPlaceholders = targetGenders.map((_, i) => `$${index + i}`).join(', ');
  const preferencePlaceholders = targetPreferences.map((_, i) => `$${index + targetGenders.length + i}`).join(', ');
  queryParams.push(...targetGenders, ...targetPreferences);
  index += targetGenders.length + targetPreferences.length;

  const genderPrefClause = `(
    p.gender IN (${genderPlaceholders}) AND p.sexual_preferences IN (${preferencePlaceholders})
  )`;

  filterClauses.push(`u.is_verified = true`);
  filterClauses.push(`EXISTS (SELECT 1 FROM pictures WHERE user_id = u.id AND is_profile_picture = true)`);
  filterClauses.push(`p.latitude IS NOT NULL AND p.longitude IS NOT NULL`);

  filterClauses.push(`NOT EXISTS (SELECT 1 FROM blocks WHERE blocker_id = $3 AND blocked_id = u.id)`);
  filterClauses.push(`NOT EXISTS (SELECT 1 FROM blocks WHERE blocker_id = u.id AND blocked_id = $3)`);

  const whereClause = filterClauses.length ? `AND ${filterClauses.join(' AND ')}` : '';

  const distanceExpr = hasLocation
    ? `(6371 * acos(
         cos(radians($1)) * cos(radians(p.latitude)) *
         cos(radians(p.longitude) - radians($2)) +
         sin(radians($1)) * sin(radians(p.latitude))
       ))`
    : 'NULL';

  const effectiveSort = (!hasLocation && sortBy === 'distance') ? 'fame' : sortBy;

  const query = `
    SELECT u.id, p.*,
           COALESCE(json_agg(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL), '[]') AS tags,
           COALESCE(json_agg(DISTINCT pic.url) FILTER (WHERE pic.url IS NOT NULL), '[]') AS pictures,
           ${distanceExpr} AS distance,
           (SELECT COUNT(*) FROM profile_tags pt_me
            JOIN profile_tags pt_them ON pt_me.tag_id = pt_them.tag_id
            WHERE pt_me.profile_id = $3 AND pt_them.profile_id = p.user_id
           ) AS common_tags_count
    FROM users u
    JOIN profiles p ON p.user_id = u.id
    LEFT JOIN profile_tags pt ON pt.profile_id = p.user_id
    LEFT JOIN tags t ON t.id = pt.tag_id
    LEFT JOIN pictures pic ON pic.user_id = u.id
    WHERE u.id != $3 ${whereClause} AND ${genderPrefClause}
    GROUP BY u.id, p.user_id
    ORDER BY ${SORT_MAP[effectiveSort] || SORT_MAP.fame}
  `;

  const { rows } = await pg.query(query, queryParams);
  return rows;
};
