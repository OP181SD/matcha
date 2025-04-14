import { authRegister, authLogin, authUpdateFields} from "../controllers/authControllers.js";
import { modelDeleteAccount,modelId } from "../models/User.js";

export const authRoutes = async (fastify) => {
    fastify.post('/register', authRegister);
    fastify.post('/update', authUpdateFields);
    fastify.post ('/login', authLogin);
    fastify.delete('/',modelDeleteAccount);
    fastify.post('/auth/me',modelId);
}
