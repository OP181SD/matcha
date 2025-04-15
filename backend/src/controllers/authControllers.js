import { modelRegister, modelUpdateFields, modelRegisterPartTwo} from "../models/User.js";
import { validateRegisterFields, validateDuplicateFields } from '../validators/authValidation.js';

export async function authRegister(request, reply) {
    const isValidFields = await validateRegisterFields(request, reply);
    if (!isValidFields) return;

    const isUnique = await validateDuplicateFields(request, reply);
    if (!isUnique) return;

    try {
        const user = await modelRegister(request);
        if (user) {
            const token = request.server.signToken({ id: user.id }); 
            console.log("🔧 Token signé :", token);

            reply
                .setCookie('access_token', token, {
                    httpOnly: true,
                    secure: false, // true en prod avec HTTPS
                    sameSite: 'Lax', 
                    path: '/'
                })
                .send({
                    authRegister: 'Etape 1 Ok',
                    userid: user.id,
                    token: token
                });
        }
    } catch (err) {
        console.error('Erreur dans authRegister :', err);
        reply.code(500).send({ authRegisterror: 'Erreur lors de l\'inscription' });
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

    if (!token) {
        return reply.code(401).send({ error: 'Token manquant' });
    }

    try {
        const decoded = await request.server.verifyToken(token);
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

export const AuthLogin = async (request, reply) => {
  const { identifier, password } = request.body;

  if (!identifier || !password) {
    return reply.code(400).send({ err_auth_login: 'Erreur : Identifiant ou mot de passe manquant.' });
  }

  const user = await ModelLogin(identifier);
  if (!user) {
    return reply.code(404).send({ err_auth_login: 'Erreur de connexion' });
  }

  let isPasswordValid = await byCryptCompare(password, user.password);
  if (!isPasswordValid) {
    return reply.code(401).send({ err_auth_login: 'Mot de passe incorrect.' });
  }

  const token = await getToken(user.username, user.email);
   reply
   .setCookie('token', token, {
       path: '/', 
       httpOnly: true,  
       sameSite: 'Strict', 
       maxAge: 3600 * 1000 
   })
   .code(200)
   .send({
       message: 'Connexion réussie',
       user
   });
  
};


export const AuthUpdate = async (request, reply) => {
  const { username, id } = request.body;
  if (!username) {
    return (reply.code(400).send({ err_auth_update: 'Erreur champs a modifier manquant.' }));
  }
  const update = await ModelUpdate(username, id);
  if (!update) {
    return reply.code(404).send({ err_auth_login: 'Ce nom existe pas ' });
  }
}
