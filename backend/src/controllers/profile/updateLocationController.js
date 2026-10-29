export const updateLocationController = async (request, reply) => {
  const userId = request.user.id;

  const { latitude, longitude, city } = request.body;

  if (latitude == null || longitude == null) {
    return reply.code(400).send({ error: "Latitude et longitude requises." });
  }

  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);

  if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return reply.code(400).send({ error: "Coordonnées invalides." });
  }

  try {
    await request.server.pg.query(
      `UPDATE profiles SET latitude = $1, longitude = $2, city = $3 WHERE user_id = $4`,
      [lat, lon, city || null, userId]
    );
    reply.code(200).send({ message: "Localisation mise à jour." });
  } catch (err) {
    request.log.error(err, "Erreur updateLocationController:");
    reply.code(500).send({ error: "Erreur serveur." });
  }
};
