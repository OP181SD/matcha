import { AuthRegister, AuthUpdate } from '../controllers/authControllers.js';
import { AuthLogin } from '../controllers/authControllers.js';
import { AuthToken, testCookieRoute } from '../controllers/authControllers.js';



export default async function authRoutes(fastify) {
  fastify.post('/register', AuthRegister);
  fastify.post('/login', (request, reply) => {
    return AuthLogin(request, reply);
  });

  fastify.put('/update', async (request, reply) => {
    return AuthUpdate(request, reply);
  });

  fastify.get('/token', async (request, reply) => {
    return AuthToken(request, reply);
  }
  );

  fastify.get('/test-cookie', testCookieRoute);
}


