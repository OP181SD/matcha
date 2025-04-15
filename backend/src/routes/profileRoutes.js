import { handleProfile } from "../controllers/profileController.js";
import { addTags } from "../controllers/tagsController.js"; // Ajoute cette ligne
import { uploadPicture } from "../controllers/pictureController.js"; // Si ce n'est pas déjà fait
import { getLikes } from "../controllers/likesController.js"; // Si ce n'est pas déjà fait
import { getViews } from "../controllers/viewsController.js"; // Si ce n'est pas déjà fait
import { getProfileById } from "../controllers/profileController.js"

export default async function profileRoutes(fastify, opts) {
    fastify.post('/profile', { preHandler: [fastify.authenticate] }, handleProfile);
    fastify.post('/tags/add', { preHandler: [fastify.authenticate] }, addTags);
    fastify.post('/picture/upload', { preHandler: [fastify.authenticate] }, uploadPicture);
    fastify.get('/likes', { preHandler: [fastify.authenticate] }, getLikes);
    fastify.get('/views', { preHandler: [fastify.authenticate] }, getViews);
    fastify.get("/profile/:id",  getProfileById);
}
