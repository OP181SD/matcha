import { modelLogin, modelRegister, modelUpdateFields} from "../models/User.js";
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


export async function authUpdateFields(request, reply) {
    try {
       
        const up = await modelUpdateFields(request);
        if (up) {
            reply.code(200).send({ authUpdateFields: 'Succès' });
        } else {
            reply.code(500).send({ authFields_error: 'Échec de la mise à jour.' });
        }
    } catch (err) {
        reply.code(400).send({ error_auth_fields: err.message });
    }
}

export async function authLogin(request, reply) {
    try {
   
        const user = await modelLogin(request);
      
        if (user) {
            return reply.code(200).send({
                authLoginSucces: 'Connexion réussie',
            });
        }
    } catch (error) {
    
        return reply.code(401).send({
            authLoginError: error.message || 'Erreur lors de la connexion',
        });
    }
}
