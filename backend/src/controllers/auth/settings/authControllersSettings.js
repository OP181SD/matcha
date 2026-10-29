import {
  modelUpdateEmail,
  modelUpdateUsername,
  modelUpdatePassword,
  modelUpdateFirstName,
  modelUpdateLastName,
  modelGetUserPasswordById
} from "../../../models/update/update.js";
import { hashPassword, comparePassword } from "../../../utils/hash.js";
import { normEmail, normUsername } from "../../../utils/normalize.js";
import { checkEmail, checkName, checkUsername, checkPassword } from "../../../services/validation/fields.js";

import { getConnectedUsers } from "../../../socket/client-server.js";
import { issueVerificationForUser } from "../email/authEmail.js";
import { modelDeleteUserEmailTokens } from "../../../models/email/EmailVerification.js";

export const authUpdateEmail = async (request, reply) => {
  try {
    if (request.body) request.body.email = normEmail(request.body.email);
    const ev = checkEmail(request.body?.email);
    if (!ev.ok) return reply.code(400).send({ error: ev.msg });

    const updated = await modelUpdateEmail(request);
    if (!updated) {
      return reply.code(400).send({ error: 'Échec de la mise à jour de l\'email' });
    }

    await modelDeleteUserEmailTokens(request.server, request.user.id);
    return issueVerificationForUser(request, reply, {
      id: request.user.id,
      email: request.body.email,
      is_verified: false,
    });
  } catch (err) {
    if (err.code === '23505') {
      return reply.code(400).send({ error: 'Cette adresse e-mail est déjà utilisée.' });
    }
    request.log.error(err, 'Erreur dans authUpdateEmail :');
    reply.code(500).send({ error: 'Erreur serveur' });
  }
};

export const authUpdatePassword = async (request, reply) => {
  try {
    const { currentPassword, password } = request.body ?? {};
    if (!currentPassword || !password) {
      return reply.code(400).send({ error: 'Mot de passe actuel et nouveau mot de passe requis' });
    }

    const pw = checkPassword(password);
    if (!pw.ok) return reply.code(400).send({ error: pw.msg });

    const currentHash = await modelGetUserPasswordById(request.server, request.user.id);
    if (!currentHash || !(await comparePassword(currentPassword, currentHash))) {
      return reply.code(400).send({ error: 'Mot de passe actuel incorrect' });
    }

    const hashedPassword = await hashPassword(password);

    const updated = await modelUpdatePassword(request.server, request.user.id, hashedPassword);

    if (updated) {
      return reply.code(200).send({ success: true });
    } else {
      return reply.code(400).send({ error: 'Échec de la mise à jour du mot de passe' });
    }

  } catch (err) {
    request.log.error(err, 'Erreur dans authUpdatePassword :');
    return reply.code(500).send({ error: 'Erreur serveur' });
  }
};

export const authUpdateFirstName = async (request, reply) => {
  try {
    const { first_name } = request.body;
    const v = checkName(first_name, 'Prénom');
    if (!v.ok) return reply.code(400).send({ error: v.msg });

    const updated = await modelUpdateFirstName(request);
    if (updated) {
      reply.code(200).send({ success: true });
    } else {
      reply.code(400).send({ error: 'Échec de la mise à jour du prénom' });
    }
  } catch (err) {
    request.log.error(err, 'Erreur dans authUpdateFirstName :');
    reply.code(500).send({ error: 'Erreur serveur' });
  }
};

export const authUpdateLastName = async (request, reply) => {
  try {
    const { last_name } = request.body;
    const v = checkName(last_name, 'Nom');
    if (!v.ok) return reply.code(400).send({ error: v.msg });

    const updated = await modelUpdateLastName(request);
    if (updated) {
      reply.code(200).send({ success: true });
    } else {
      reply.code(400).send({ error: 'Échec de la mise à jour du nom' });
    }
  } catch (err) {
    request.log.error(err, 'Erreur dans authUpdateLastName :');
    reply.code(500).send({ error: 'Erreur serveur' });
  }
};

export const authUpdateUsername = async (request, reply) => {
  try {
    if (request.body) request.body.username = normUsername(request.body.username);
    const { username } = request.body;

    const v = checkUsername(username);
    if (!v.ok) return reply.code(400).send({ error: v.msg });

    const updated = await modelUpdateUsername(request);

    if (updated) {
      return reply.code(200).send({ success: true });
    } else {
      return reply.code(400).send({ error: "Échec de la mise à jour du nom d’utilisateur" });
    }

  } catch (err) {
    if (err.code === '23505') {
      return reply.code(400).send({ error: "Nom d’utilisateur déjà pris." });
    }
    request.log.error(err, 'Erreur dans authUpdateUsername :');
    return reply.code(500).send({ error: 'Erreur serveur' });
  }
};

export const authOnlineUsers = async (request, reply) => {
  try {
    const users = await getConnectedUsers(request.server);

    return reply.code(200).send(users);

  } catch (error) {
    request.log.error(error, 'Erreur dans authOnlineUsers:');
    return reply.code(500).send({ error: 'Erreur serveur' });
  }
};

