import { fastify } from "../../config/import.js";

export const createOrUpdateProfile = async (userId, data) => {
    const { first_name, last_name, gender, age, sexual_preferences, biography, latitude, longitude, image_url } = data;
    
    // Vérifier si le profil existe déjà pour cet utilisateur
    const { rowCount } = await fastify.pg.query('SELECT * FROM profiles WHERE user_id = $1', [userId]);
    
    if (rowCount > 0) {
        // Mettre à jour le profil existant
        const { rows } = await fastify.pg.query(`
          UPDATE profiles SET 
            first_name=$1, last_name=$2, gender=$3, age=$4, sexual_preferences=$5, biography=$6,
            latitude=$7, longitude=$8, image_url=$9, last_connection=NOW()
          WHERE user_id=$10 RETURNING *;
        `, [first_name, last_name, gender, age, sexual_preferences, biography, latitude, longitude, image_url, userId]);
        return rows[0];
    } else {
        // Créer un nouveau profil
        const { rows } = await fastify.pg.query(`
          INSERT INTO profiles (user_id, first_name, last_name, gender, age, sexual_preferences, biography, latitude, longitude, image_url)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;
        `, [userId, first_name, last_name, gender, age, sexual_preferences, biography, latitude, longitude, image_url]);
        return rows[0];
    }
};