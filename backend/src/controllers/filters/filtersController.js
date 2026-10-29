import { getUserFilters, upsertUserFilters } from "../../models/filters/filtersModel.js";

export const getFiltersController = async (request, reply) => {
  try {
    const user = request.user;

    const { rows } = await getUserFilters(request.server.pg, user.id);

    if (rows.length === 0) {
      return reply.code(200).send({ filters: null });
    }

    const f = rows[0];

    reply.code(200).send({
      filters: {
        ageRange: [f.age_min, f.age_max],
        popularity: f.popularity_min,
        distance: f.distance_max,
        tags: f.tags || []
      }
    });
  } catch (err) {
    request.log.error(err, "Erreur dans getFiltersController :");
    reply.code(500).send({
      error: "Erreur lors de la récupération des filtres."
    });
  }
};

export const updateFiltersController = async (request, reply) => {
  try {
    const user = request.user;

    const { ageRange, popularity, distance, tags } = request.body || {};

    if (!Array.isArray(ageRange) || ageRange.length !== 2
      || !Number.isFinite(Number(ageRange[0])) || !Number.isFinite(Number(ageRange[1]))) {
      return reply.code(400).send({ error: "Tranche d'âge invalide." });
    }
    const ageMin = Number(ageRange[0]);
    const ageMax = Number(ageRange[1]);
    if (ageMin < 18 || ageMax > 120 || ageMin > ageMax) {
      return reply.code(400).send({ error: "Tranche d'âge invalide." });
    }
    if (tags != null && !Array.isArray(tags)) {
      return reply.code(400).send({ error: "Liste de tags invalide." });
    }

    const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : null);

    await upsertUserFilters(
      request.server.pg,
      user.id,
      [ageMin, ageMax],
      num(popularity),
      num(distance),
      Array.isArray(tags) ? tags : []
    );

    reply.code(200).send({
      success: true,
      message: "Filtres sauvegardés avec succès."
    });
  } catch (err) {
    request.log.error(err, "Erreur dans updateFiltersController :");
    reply.code(500).send({
      error: "Erreur lors de la sauvegarde des filtres."
    });
  }
};
