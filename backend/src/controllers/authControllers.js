import { modelRegister} from "../models/User.js";
import { validateRegisterFields, validateDuplicateFields } from '../validators/authValidation.js';


export async function authRegister(request, reply) {
    
    const isValidFields = await validateRegisterFields(request, reply);
    if (!isValidFields) return;
    
    const isUnique = await validateDuplicateFields(request, reply);
    if (!isUnique) return;

    try {
    
        const user = await modelRegister(request);

        return reply.code(200).send({
            message: 'Inscription réussie',
            userId: user.id,
            username: user.username,
            email: user.email,
        });
    } catch (err) {
        return reply.code(500).send({ error: 'Erreur lors de l\'inscription' });
    }
}