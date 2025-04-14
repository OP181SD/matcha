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