export const  updateOrientationAndGender = async (pg, userId, gender, orientation) => {
  await pg.query(
    `UPDATE profiles SET gender = $1, sexual_preferences = $2 WHERE user_id = $3`,
    [gender, orientation, userId]
  );

};
