import { AuthRegister } from '../controllers/authControllers.js';
import { AuthLogin } from '../controllers/authControllers.js';



export default async function authRoutes(fastify, options) {
    fastify.post('/register', AuthRegister);
    fastify.post('/login', (request, reply) => {
      console.log("Route /login appelée !");
      return AuthLogin(request, reply);
    });
  }
  