export const addTagsModel = async (db, userId, tags) => {
  try {
    await db.query("BEGIN");

    await db.query(
      'DELETE FROM profile_tags WHERE profile_id = $1',
      [userId]
    );

    for (const tag of tags) {
      const tagResult = await db.query(
        'INSERT INTO tags (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id',
        [tag]
      );
      const tagId = tagResult.rows[0].id;

      await db.query(
        'INSERT INTO profile_tags (profile_id, tag_id) VALUES ($1, $2)',
        [userId, tagId]
      );
    }

    await db.query("COMMIT");
  } catch (err) {
    await db.query("ROLLBACK");
    throw err;
  }
};

export const getAllTagsModel = async (db) => {
  const { rows } = await db.query(`SELECT name FROM tags ORDER BY name`);
  return rows.map(r => r.name);
};

export const getTagsByUserModel = async (db, userId) => {
  const { rows } = await db.query(
    `SELECT t.name FROM tags t
     INNER JOIN profile_tags pt ON pt.tag_id = t.id
     WHERE pt.profile_id = $1`,
    [userId]
  );

  return rows.map(row => row.name);
};