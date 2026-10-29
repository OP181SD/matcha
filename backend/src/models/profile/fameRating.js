export const updateFameRating = async (pg, userId, delta) => {
  await pg.query(
    `UPDATE profiles
     SET fame_rating = GREATEST(0, LEAST(100, fame_rating + $1))
     WHERE user_id = $2`,
    [delta, userId]
  );
};
