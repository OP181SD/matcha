import { checkGender, checkSexualPreferences, checkAge, checkBiography, checkCity, checkCoordinates } from "../../services/validation/profile.js";

export const handleCompleteProfile = async (request, reply) => {
  const userId = request.user.id;

  const { gender, sexual_preferences, age, biography, latitude, longitude, city } = request.body;

  for (const r of [
    checkGender(gender),
    checkSexualPreferences(sexual_preferences),
    checkAge(age),
    checkBiography(biography),
    checkCoordinates(latitude, longitude),
    checkCity(city),
  ]) {
    if (!r.ok) return reply.code(400).send({ error: r.msg });
  }

  try {
    await request.server.pg.query(
      `UPDATE profiles SET gender = $1, sexual_preferences = $2, age = $3, biography = $4, latitude = $5, longitude = $6, city = $7 WHERE user_id = $8;`,
      [gender, sexual_preferences, age, biography, latitude, longitude, city, userId]
    );
    reply.send({ message: "Profil complété." });
  } catch (err) {
    request.log.error(err, "handleCompleteProfile:");
    reply.code(500).send({ error: "Erreur serveur lors de la complétion du profil." });
  }
};
