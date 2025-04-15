import { createOrUpdateProfile } from "../models/Profile.js";


export const handleProfile = async (request, reply) => {
    const userId = request.user.id;
    console.log("User ID from token:", userId); // Ajoutez ce log
    const profileData = request.body;
    try {
        const profile = await createOrUpdateProfile(userId, profileData);
        reply.send({ message: "Profil enregistré avec succès", profile });
    } catch (error) {
        console.error("Erreur détaillée:", error.message, error.stack); // Plus de détails
        reply.status(500).send({ error: "Erreur lors de la création/mise à jour du profil.", details: error.message });
    }
};


export const getProfileById = async (request, reply, fastify) => {
    const profileId = request.params.id;

    const client = await request.server.pg.connect();
    const { rows } = await client.query(`
        SELECT first_name, last_name, gender, sexual_preferences, biography, fame_rating, latitude, longitude, last_connection 
        FROM profiles WHERE user_id = $1;
    `, [profileId]);

    client.release();

    if (rows.length === 0) {
        return reply.code(404).send({ error: "Profil introuvable." });
    }

    return reply.send(rows[0]);
};
