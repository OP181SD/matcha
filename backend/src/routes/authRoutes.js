import { authRegister, authLogin, authUpdateFields, authRegisterPartTwo} from "../controllers/authControllers.js";
import { modelDeleteAccount } from "../models/User.js";

export const authRoutes = async (fastify) => {
    fastify.post('/register', authRegister);
    fastify.post('/update', authUpdateFields);
    fastify.post ('/login', authLogin);
    fastify.delete('/',modelDeleteAccount);
    fastify.post('/registerPartTwo', authRegisterPartTwo);
    
}
