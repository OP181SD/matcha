import { authRegister, authLogin, authLogout, authRegisterPartTwo} from "../controllers/authControllers.js";
import { modelDeleteAccount} from "../models/User.js";

export const authRoutes = async (fastify) => {
    fastify.post('/register', authRegister);
    fastify.post ('/login', authLogin);
    fastify.delete('/',modelDeleteAccount);
    fastify.put('/profil', authRegisterPartTwo);
    fastify.post('/logout', authLogout);

}
