import { fastify, byCryptHash } from "../../config/import.js";

export const DupUsers = async (username, email) => {
    const users = 'SELECT * FROM users WHERE username=$1 OR email= $2';
    const { rowCount } = await fastify.pg.query(users, [username, email]);
    if (rowCount > 0) {
        return { error_users: 'Ce nom d\'utilisateur ou cet email est déjà pris. Veuillez en choisir un autre.' };
    }
    return {ok_users: 'Ok'};
};


export const InsertUser = async (username, email ,password) => {
    try {
        const insert = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *;`;
        const hashedPassword = await byCryptHash(password, 10);
        const { rows } = await fastify.pg.query(insert, [username, email, hashedPassword]);
        return rows;
    } catch (error) {
        console.error("Error lors de l'insertion de l'utilisateur :", error);
        throw new Error("Une erreur est survenue lors de la création du compte.");
    }
};
