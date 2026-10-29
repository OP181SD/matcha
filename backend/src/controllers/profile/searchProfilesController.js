import { searchProfiles } from "../../models/profile/searchProfiles.js";

export const searchProfilesController = async (request, reply) => {
  try {
    const user = request.user;

    const { ageMin, ageMax, popularityMin, popularityMax, distanceMax, tags, sortBy } = request.query;

    const params = {
      ageMin: ageMin ? parseInt(ageMin, 10) : undefined,
      ageMax: ageMax ? parseInt(ageMax, 10) : undefined,
      popularityMin: popularityMin ? parseInt(popularityMin, 10) : undefined,
      popularityMax: popularityMax ? parseInt(popularityMax, 10) : undefined,
      distanceMax: distanceMax ? parseInt(distanceMax, 10) : undefined,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',')) : undefined,
      sortBy: ['distance', 'age', 'fame', 'tags'].includes(sortBy) ? sortBy : 'fame',
    };

    const profiles = await searchProfiles(request.server.pg, user.id, params);
    reply.code(200).send(profiles.length ? profiles : []);
  } catch (err) {
    request.log.error(err, "Erreur dans searchProfilesController :");
    reply.code(500).send([]);
  }
};
