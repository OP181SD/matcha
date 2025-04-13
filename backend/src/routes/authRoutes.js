import { authRegister } from "../controllers/authControllers.js";

export const authRoutes = async (fastify) => {
    fastify.post('/register', authRegister);
}
