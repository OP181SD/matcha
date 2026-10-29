import {
  addPicture,
  getPictures,
  deletePicture,
  setProfilePicture,
  getProfilePicture,
} from '../controllers/pictures/pictureController.js';

export default async function pictureRoutes(fastify) {
  fastify.post('/add-picture', { preHandler: [fastify.authenticate] }, addPicture);
  fastify.get('/pictures/:userId', { preHandler: [fastify.authenticate] }, getPictures);
  fastify.delete('/pictures/:photoId', { preHandler: [fastify.authenticate] }, deletePicture);
  fastify.post('/set-profile-picture', { preHandler: [fastify.authenticate] }, setProfilePicture);
  fastify.get('/profile-picture/:userId', { preHandler: [fastify.authenticate] }, getProfilePicture);
}
