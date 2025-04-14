import { modelLogin, modelRegister, modelUpdateFields} from "../models/User.js";
import { validateRegisterFields, validateDuplicateFields } from '../validators/authValidation.js';
import { fastify } from '../app.js';

export async function authRegister(request, reply) {
    
    const isValidFields = await validateRegisterFields(request, reply);
    if (!isValidFields) return;
    
    const isUnique = await validateDuplicateFields(request, reply);
    if (!isUnique) return;

    try {
        const user = await modelRegister(request);
        if (user)
        {  
            const token = fastify.jwt.sign({ id: user.id }, { expiresIn: '30s' });
            reply
            .setCookie('access_token',token,{
                httpOnly: true,
                secure: false,
                sameSite: 'Strict',
                path: '/'
            })
            .send({ authRegister: 'Etape 1 Ok', userid: user.id });
        }
    } catch (err) {
        console.error('Erreur dans authRegister :', err); 
        return reply.code(500).send({ authRegisterror: 'Erreur lors de l\'inscription' });
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
