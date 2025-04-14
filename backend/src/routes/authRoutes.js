import { authRegister, authLogin, authUpdateFields } from "../controllers/authControllers.js";

export const authRoutes = async (fastify) => {
    fastify.post('/register', authRegister);
    fastify.post('/update', authUpdateFields);
    fastify.post ('/login', authLogin);

}
