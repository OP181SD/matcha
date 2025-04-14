import { modelLogin, modelRegister, modelUpdateFields, modelRegisterPartTwo} from "../models/User.js";
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
            const token = fastify.jwt.sign({ id: user.id }, { expiresIn: '1h' });
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


export async function authRegisterPartTwo(request, reply) {

   const token = request.cookies.access_token;
   const decoded = fastify.jwt.verify(token);

   if (!token) {
       return reply.code(401).send({ error: 'Token manquant' });
   } 
    try {
         const user = await modelRegisterPartTwo(request, decoded.id);
         if (user) {
              reply.code(200).send({ authRegisterPartTwo: 'Etape 2 Ok' });
         } else {
              reply.code(500).send({ authRegisterPartTwoError: 'Erreur lors de l\'inscription' });
         }
    } catch (err) {
         console.error('Erreur dans authRegisterPartTwo :', err); 
         return reply.code(500).send({ authRegisterPartTwoError: 'Erreur lors de l\'inscription' });
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


export async function authLogout(_, reply) {
    try {
        reply
            .clearCookie('access_token')
            .code(200)
            .send({ authLogout: 'Déconnexion réussie' });
    } catch (error) {
        reply.code(500).send({ authLogoutError: 'Erreur lors de la déconnexion' });
    }
}

