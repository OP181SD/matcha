import { getProfileById } from "../controllers/profile/profileController.js";
import { handleCompleteProfile } from "../controllers/profile/completeProfileController.js";
import { addTags, getAllTags, getTagsByUser } from "../controllers/tags/tagsController.js";
import { uploadPicture } from "../controllers/pictures/pictureController.js";
import { getLikesController, likeController, unlikeController, dislikeController, checkLikeController } from "../controllers/likes/likesController.js";
import { updateBiographyController } from "../controllers/profile/add/biographyController.js";
import { updateOrientationAndGenderController } from '../controllers/profile/profileController.js';
import { getFiltersController, updateFiltersController } from '../controllers/filters/filtersController.js';
import { reportUserController } from '../controllers/report/reportUserController.js';
import { blockUserController, unblockUserController, getBlockedUsersController } from '../controllers/bloc/blocController.js';
import { getChannelsController } from '../controllers/channels/getChannelsController.js';
import { getAvailableProfilesController } from '../controllers/profile/AvailableProfiles.js'
import { searchProfilesController } from '../controllers/profile/searchProfilesController.js'
import { updateLocationController } from '../controllers/profile/updateLocationController.js'

export default async function profileRoutes(fastify) {

  fastify.post('/complete-profile', { preHandler: [fastify.authenticate] }, handleCompleteProfile);
  fastify.get("/profile/:id", { preHandler: [fastify.optionalAuth] }, getProfileById);
  fastify.post('/profile/biography', { preHandler: [fastify.authenticate] }, updateBiographyController);
  fastify.post('/profile/update-orientation-gender', { preHandler: [fastify.authenticate] }, updateOrientationAndGenderController);

  fastify.post('/tags/add', { preHandler: [fastify.authenticate] }, addTags);
  fastify.get('/tags/all', { preHandler: [fastify.authenticate] }, getAllTags);
  fastify.get('/tags/:userId', { preHandler: [fastify.authenticate] }, getTagsByUser);

  fastify.post('/picture/upload', { preHandler: [fastify.authenticate] }, uploadPicture);

  fastify.get('/likes', { preHandler: [fastify.authenticate] }, getLikesController);
  fastify.post('/like', { preHandler: [fastify.authenticate] }, likeController);
  fastify.post('/unlike', { preHandler: [fastify.authenticate] }, unlikeController);
  fastify.post('/dislike', { preHandler: [fastify.authenticate] }, dislikeController);
  fastify.get('/check-like/:id', { preHandler: [fastify.authenticate] }, checkLikeController);

  fastify.post('/filters', { preHandler: [fastify.authenticate] }, updateFiltersController);
  fastify.get('/filters', { preHandler: [fastify.authenticate] }, getFiltersController);

  fastify.post('/reports', { preHandler: [fastify.authenticate] }, reportUserController);
  fastify.get('/blocked-users', { preHandler: [fastify.authenticate] }, getBlockedUsersController);
  fastify.post('/unblock-user', { preHandler: [fastify.authenticate] }, unblockUserController);
  fastify.post('/block-user', { preHandler: [fastify.authenticate] }, blockUserController);

  fastify.get('/channels', { preHandler: [fastify.authenticate] }, getChannelsController);
  fastify.get('/profiles/available', { preHandler: [fastify.authenticate] }, getAvailableProfilesController);
  fastify.get('/profiles/search', { preHandler: [fastify.authenticate] }, searchProfilesController);
  fastify.put('/update-location', { preHandler: [fastify.authenticate] }, updateLocationController);

}