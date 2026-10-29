export const updateBiography = async (pg, userId, biography) => {
  await pg.query('UPDATE profiles SET biography = $1 WHERE user_id = $2', [biography, userId]);

};
