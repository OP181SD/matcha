import { modelRegister } from '../models/User.js'
import { modelDeleteAccount } from '../models/User.js';
import { modelId } from '../models/User.js';


export const authRoutes = async (fastify) => {
    fastify.post('/register', modelRegister);
    fastify.post('/delete', modelDeleteAccount);
    fastify.post('/id',modelId);
}
