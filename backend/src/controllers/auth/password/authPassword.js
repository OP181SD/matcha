import crypto from 'crypto';

import { hashPassword } from "../../../utils/hash.js";
import { modelFindUserByEmail } from "../../../models/email/EmailVerification.js";
import { modelUpdatePassword } from '../../../models/update/update.js';
import {
    modelInsertPasswordResetToken,
    modelEmailPasswordDeleteToken,
    modelSearchTokenPassword,
    modelGetExistingPasswordResetToken,
    modelDeleteUserPasswordResetTokens,
} from "../../../models/password/PasswordVerification.js";
import { sendPasswordResetEmail } from "../../../email/email.js";
import { checkEmail, checkPassword } from "../../../services/validation/fields.js";

const RESET_TTL_MS = 45 * 60 * 1000;
const COOLDOWN_MS = 90 * 1000;

export const authGeneratePasswordResetToken = async (request, reply) => {
    try {
        const { email } = request.body;
        const ev = checkEmail(email);
        if (!ev.ok) return reply.code(400).send({ error: ev.msg });

        const user = await modelFindUserByEmail(request, email);
        if (!user) {
            return reply.code(200).send({
                message: "Si cette adresse e-mail est enregistrée, un lien de réinitialisation a été envoyé."
            });
        }

        const userId = user.id;

        const existing = await modelGetExistingPasswordResetToken(request.server, userId);
        if (existing) {
            const cooldownUntil = new Date(new Date(existing.created_at).getTime() + COOLDOWN_MS);
            const now = new Date();
            if (cooldownUntil > now) {
                const retryAfter = Math.ceil((cooldownUntil - now) / 1000);
                return reply.code(409).send({
                    error: 'RESET_TOKEN_ALREADY_GENERATED',
                    message: "Un lien de réinitialisation a déjà été envoyé récemment. " +
                        "Merci de patienter un instant avant d'en demander un nouveau.",
                    retryAfter
                });
            }
            await modelDeleteUserPasswordResetTokens(request.server, userId);
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + RESET_TTL_MS);

        try {
            await modelInsertPasswordResetToken(request.server, userId, token, expiresAt);
        } catch (error) {
            request.log.error(error, "Erreur lors de l'insertion du token de réinitialisation :");
            return reply.code(500).send({ error: "Impossible de générer le token de réinitialisation." });
        }

        await sendPasswordResetEmail(user.email, token);

        return reply.code(200).send({
            message: "Si cette adresse e-mail est enregistrée, un lien de réinitialisation a été envoyé."
        });

    } catch (error) {
        request.log.error(error, "Erreur lors de la génération du token de réinitialisation du mot de passe :");
        return reply.code(500).send({ error: "Impossible de générer le token de réinitialisation." });
    }
};

export const authVerifyPasswordToken = async (request, reply) => {
    try {
        const { token } = request.query;
        if (!token) return reply.code(400).send({ error: 'Token manquant dans la requête' });

        const tokenEntry = await modelSearchTokenPassword(request, token);
        if (!tokenEntry) return reply.code(400).send({ error: 'Le lien de vérification est invalide ou a déjà été utilisé.' });

        const now = new Date();
        const expiresAt = new Date(tokenEntry.expires_at);
        if (expiresAt <= now) {
            await modelEmailPasswordDeleteToken(request, token);
            return reply.code(400).send({ error: 'Le lien de vérification a expiré. Veuillez en générer un nouveau.' });
        }

        return reply.code(200).send({ message: 'Le lien de réinitialisation est valide.' });

    } catch (error) {
        request.log.error(error, 'Unexpected error:');
        return reply.code(500).send({ error: 'Erreur interne du serveur' });
    }
};

export const authResetPassword = async (request, reply) => {
    try {
        const { token, password } = request.body;
        if (!token || !password) return reply.code(400).send({ error: 'Token et nouveau mot de passe requis.' });

        const pw = checkPassword(password);
        if (!pw.ok) return reply.code(400).send({ error: pw.msg });

        const tokenEntry = await modelSearchTokenPassword(request, token);
        if (!tokenEntry) return reply.code(400).send({ error: 'Le lien de réinitialisation est invalide ou a déjà été utilisé.' });

        const now = new Date();
        const expiresAt = new Date(tokenEntry.expires_at);
        if (expiresAt <= now) {
            await modelEmailPasswordDeleteToken(request, token);
            return reply.code(400).send({ error: 'Le lien de réinitialisation a expiré. Veuillez en générer un nouveau.' });
        }

        const userId = tokenEntry.user_id;
        const hashedPassword = await hashPassword(password);

        await modelUpdatePassword(request.server, userId,hashedPassword);

        await modelEmailPasswordDeleteToken(request, token);
        return reply.code(200).send({ message: 'Mot de passe mis à jour avec succès.' });

    } catch (err) {
        request.log.error(err, 'Erreur lors de la réinitialisation du mot de passe :');
        return reply.code(500).send({ error: 'Erreur serveur lors de la réinitialisation.' });
    }
};