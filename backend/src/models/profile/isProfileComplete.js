export async function isProfileComplete(pg, userId) {
  const { rows } = await pg.query(
    `SELECT (
       p.gender IS NOT NULL AND p.sexual_preferences IS NOT NULL
       AND p.age IS NOT NULL AND p.biography IS NOT NULL
       AND p.latitude IS NOT NULL AND p.longitude IS NOT NULL
       AND (
         p.image_url IS NOT NULL
         OR EXISTS (
           SELECT 1 FROM pictures pic
           WHERE pic.user_id = p.user_id AND pic.is_profile_picture = true
         )
       )
     ) AS complete
     FROM profiles p
     WHERE p.user_id = $1;`,
    [userId]
  );
  return rows[0]?.complete === true;
}
