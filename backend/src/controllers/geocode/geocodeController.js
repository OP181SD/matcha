const NOMINATIM_HEADERS = { 'User-Agent': 'Matcha/1.0 (42 school project)' };

export const reverseGeocode = async (request, reply) => {
  const lat = Number(request.query.lat);
  const lon = Number(request.query.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)
    || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return reply.code(400).send({ error: 'Coordonnées invalides.' });
  }
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      { headers: NOMINATIM_HEADERS }
    );
    if (!response.ok) return reply.code(502).send({ error: 'Reverse geocoding indisponible' });
    return reply.send(await response.json());
  } catch (err) {
    request.server.log.error('reverse-geocode error: ' + err.message);
    return reply.code(502).send({ error: 'Reverse geocoding indisponible' });
  }
};

export const forwardGeocode = async (request, reply) => {
  const city = typeof request.query.city === 'string' ? request.query.city.trim() : '';
  if (!city || city.length > 100) {
    return reply.code(400).send({ error: 'Ville invalide.' });
  }
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(city)}&format=json&limit=1`,
      { headers: NOMINATIM_HEADERS }
    );
    if (!response.ok) return reply.code(502).send({ error: 'Geocoding indisponible' });
    return reply.send(await response.json());
  } catch (err) {
    request.server.log.error('forward-geocode error: ' + err.message);
    return reply.code(502).send({ error: 'Geocoding indisponible' });
  }
};
