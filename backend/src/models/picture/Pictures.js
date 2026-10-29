export const addPictureModel = async (db, userId, imageUrl) => {
  const { rows } = await db.query(
    'INSERT INTO pictures (user_id, url) VALUES ($1, $2) RETURNING *',
    [userId, imageUrl]
  );
  return rows[0];
}

export const modelDeletePictureById = async (server, photoId, userId) => {
  const result = await server.pg.query(
    'DELETE FROM pictures WHERE id = $1 AND user_id = $2',
    [photoId, userId]
  );

  return result.rowCount;
};