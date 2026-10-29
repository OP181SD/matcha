import { getAvailableProfiles } from "../../models/profile/getAvailableProfiles.js";
export const getAvailableProfilesController = async (request, reply) => {
  try {
    const user = request.user;

    const userId = user.id;
    const sortBy = ['distance', 'age', 'fame', 'tags'].includes(request.query.sortBy)
      ? request.query.sortBy
      : 'distance';

    const profiles = await getAvailableProfiles(
      request.server.pg,
      userId,
      sortBy
    );

    reply.code(200).send(profiles.length ? profiles : []);
  } catch (err) {
    request.log.error(err, "Erreur dans getAvailableProfilesController :");
    reply.code(500).send([]);
  }
};
