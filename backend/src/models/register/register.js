import { hashPassword } from '../../utils/hash.js';

export async function modelRegister(request) {
  const { username, email, password, first_name, last_name } = request.body;
  const cryptedPassword = await hashPassword(password);

  const client = await request.server.pg.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email;',
      [username, email, cryptedPassword]
    );
    const user = rows[0];
    await client.query(
      'INSERT INTO profiles (user_id, first_name, last_name) VALUES ($1, $2, $3);',
      [user.id, first_name, last_name]
    );
    await client.query('COMMIT');
    return { id: user.id, username: user.username, email: user.email };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
