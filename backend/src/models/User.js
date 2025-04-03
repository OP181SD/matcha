import { fastify, byCryptHash } from "../../config/import.js";

export const ModelDuplicate = async (username, email) => {
    const users = 'SELECT * FROM users WHERE username=$1 OR email=$2';
    const { rowCount } = await fastify.pg.query(users, [username, email]);
    if (rowCount > 0) {
        return { error_users: 'Ce nom d\'utilisateur ou cet email est déjà pris. Veuillez en choisir un autre.' };
    }
    return {ok_users: 'Ok'};
};

export const ModelHashedPassword = async (password) => {
   const hashedPassword = await byCryptHash(password, 10);
   return hashedPassword;
};

export const ModelRegister = async (username, email ,password) => {
    const insert = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *;`;
    const hashedPassword = await ModelHashedPassword(password);
    const { rows } = await fastify.pg.query(insert, [username, email, hashedPassword]);
    return rows;
};

export const ModelLogin = async (identifier) => {
    console.log("Identifier reçu! :", identifier); 

    const log = 'SELECT * FROM users WHERE username=$1 OR email=$2';
    const { rows } = await fastify.pg.query(log, [identifier, identifier]); 

    if (rows.length > 0) {
        console.log("Identifier reçu! :",rows[0].id);
        return rows[0];
    }
    return null;  
};

export const ModelUpdate = async (username, id) => {
    try {
    
      const update = 'UPDATE users SET username = $1 WHERE id = $2 RETURNING *';
      
    
      const { rows } = await fastify.pg.query(update, [username, id]);
  
    
      if (rows.length > 0) {
        console.log("User updated, new username: ", rows[0].username);
        return { status: 'success', user: rows[0] };
      }
  
    
      console.log("User not found for the given ID");
      return { status: 'error', message: 'User not found' };
  
    } catch (error) {
     
      console.error('Error updating user:', error);
      return { status: 'error', message: 'An error occurred during the update' };
    }
  };
  