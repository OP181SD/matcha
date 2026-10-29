import { addViewController, getViewsController } from "../controllers/views/viewsController.js";

export default async function viewProfileRoutes(fastify) {
  fastify.post('/views', { preHandler: [fastify.authenticate] }, addViewController);
  fastify.get('/views', { preHandler: [fastify.authenticate] }, getViewsController);
}
