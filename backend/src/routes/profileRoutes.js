import { handleProfile } from "../controllers/profileController.js";

export default async function profileRoutes(fastify, opts) {
    fastify.post('/profile', { preHandler: [fastify.authenticate] }, handleProfile);
}
