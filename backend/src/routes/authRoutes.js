import { AuthRegister } from '../controllers/authControllers.js';


const registerRoute = (fastify) => {
  fastify.post('/register', AuthRegister); 
};

export default async function authRoutes(fastify) {
  registerRoute(fastify);
}
