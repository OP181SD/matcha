import { fastify, byCryptHash } from "../../config/import.js";

export const ModelDuplicate = async (username, email) => {
  const users = 'SELECT * FROM users WHERE username=$1 OR email=$2';
  const { rowCount } = await fastify.pg.query(users, [username, email]);
  if (rowCount > 0) {
    return { error_users: 'Ce nom d\'utilisateur ou cet email est déjà pris. Veuillez en choisir un autre.' };
  }
  return { ok_users: 'Ok' };
};

export const ModelId = async (id) => {
  const users = 'SELECT * FROM users WHERE id=$1';
  const { rows } = await fastify.pg.query(users, [id]);
  if (rows > 0) {
    return { error_users: 'Cet utilisateur n\'existe pas.' };
  }
  return { ok_users: 'Ok' };
}

export const ModelHashedPassword = async (password) => {
  const hashedPassword = await byCryptHash(password, 10);
  return hashedPassword;
};

export const modelRegister = async (username, email, password) => {
  const insert = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *;`;
  const hashedPassword = await ModelHashedPassword(password);
  const { rows } = await fastify.pg.query(insert, [username, email, hashedPassword]);
  return rows;
};

export const ModelLogin = async (identifier) => {

  const log = 'SELECT * FROM users WHERE username=$1 OR email=$2';
  const { rows } = await fastify.pg.query(log, [identifier, identifier]);

  if (rows.length > 0) {
    return rows[0];
  }
  return null;
};

export const ModelUpdate = async (username, id) => {
  try {

    const update = 'UPDATE users SET username = $1 WHERE id = $2 RETURNING *';
    const { rows } = await fastify.pg.query(update, [username, id]);

    if (rows.length > 0) {
      return { status: 'success', user: rows[0] };
    }
    return { status: 'error', message: 'User not found' };

  } catch (error) {

    return { status: 'error', message: 'An error occurred during the update' };
  }
};


export const ModelDelete = async (id) => {

  try {
    const deleteQuery = 'DELETE FROM users WHERE id = $1 RETURNING *';
    const { rows } = await fastify.pg.query(deleteQuery, [id]);
    if (rows.length > 0) {
      return { status: 'success', message: 'User deleted successfully' };
    }
    return { status: 'error', message: 'User not found' };
  } catch (error) {
    return { status: 'error', message: 'An error occurred during the deletion' };
  }
};


export const ModelNextProfile = async (id, firstname) => {
  try {

    const update = 'UPDATE users SET firstname = $1 WHERE id = $2 RETURNING *';

    const { rows } = await fastify.pg.query(update, [firstname, id]);

    if (rows.length > 0) {
      return { status: 'success', user: rows[0] };
    }

    return { status: 'error', message: 'User not found' };

  } catch (error) {
    console.log("Erreur lors de la mise à jour du profil.");
    console.error('Erreur lors de la mise à jour du profil :', error);
    return { status: 'error', message: 'Erreur serveur' };
  }
};
