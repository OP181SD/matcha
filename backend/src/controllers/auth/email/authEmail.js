import crypto from 'crypto';

import {
    modelInsertEmailVerificationToken,
    modelSearchToken,
    modelVerifyUser,
    modelEmailDeleteToken,
    modelFindUserByEmail,
    modelGetExistingEmailToken,
    modelDeleteUserEmailTokens
} from "../../../models/email/EmailVerification.js";

import { sendVerificationEmail } from "../../../email/email.js";

import { checkEmail } from "../../../services/validation/fields.js";
import { cookieOptions } from "../../../utils/cookies.js";

const VERIF_TTL_MS = 15 * 60 * 1000;
const COOLDOWN_MS = 90 * 1000;

export async function issueVerificationForUser(request, reply, user) {
    if (user.is_verified) {
        return reply.code(400).send({
            error: "Cette adresse e-mail est déjà utilisée."
        });
    }

    const existingToken = await modelGetExistingEmailToken(request.server, user.id);
    if (existingToken) {
        const cooldownUntil = new Date(new Date(existingToken.created_at).getTime() + COOLDOWN_MS);
        const now = new Date();
        if (cooldownUntil > now) {
            const retryAfter = Math.ceil((cooldownUntil - now) / 1000);
            return reply.code(409).send({
                error: "TOKEN_ALREADY_GENERATED",
                message: "Un email de vérification a déjà été envoyé récemment. " +
                    "Merci de patienter un instant avant d'en demander un nouveau.",
                retryAfter
            });
        }
        await modelDeleteUserEmailTokens(request.server, user.id);
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + VERIF_TTL_MS);

    try {
        await modelInsertEmailVerificationToken(request.server, user.id, token, expiresAt);
    } catch (error) {
        request.log.error(error, "Erreur lors de l'insertion du token de vérification :");
        return reply.code(500).send({ error: "Impossible de générer le token de vérification." });
    }

    await sendVerificationEmail(user.email, token);

    return reply.code(200).send({
        message: "Un email de vérification a été envoyé à votre adresse. Veuillez consulter votre boîte de réception pour finaliser la vérification.",
        is_verified: false,
        userId: user.id
    });
}

export const authGenerateEmailToken = async (request, reply) => {
    try {
        const ev = checkEmail(request.body?.email);
        if (!ev.ok) return reply.code(400).send({ error: ev.msg });

        const { email } = request.body;
        const user = await modelFindUserByEmail(request, email);
        if (!user) {
            return reply.code(200).send({
                message: "Si cette adresse e-mail est enregistrée, un lien de confirmation a été envoyé."
            });
        }

        return issueVerificationForUser(request, reply, user);
    } catch (err) {
        request.log.error(err, 'Error generating verification token:');
        return reply.code(500).send({ error: 'Erreur interne du serveur' });
    }
};

export const authVerifyEmailToken = async (request, reply) => {
    try {
        const { token } = request.query;
        if (!token) {
            return reply.code(400).send({ error: 'Token manquant dans la requête' });
        }

        const tokenEntry = await modelSearchToken(request, token);
        if (!tokenEntry) {
            return reply.code(400).send({ error: 'Le lien de vérification est invalide ou a déjà été utilisé.' });
        }

        const now = new Date();
        const expiresAt = new Date(tokenEntry.expires_at);
        if (expiresAt <= now) {
            await modelEmailDeleteToken(request, token);
            return reply.code(400).send({ error: 'Votre lien de vérification a expiré. Merci de bien vouloir en demander un nouveau' });
        }

        const userId = tokenEntry.user_id;
        const verifyResult = await modelVerifyUser(userId, request);
        if (!verifyResult) {
            return reply.code(400).send({ error: 'Échec de la vérification de l\'utilisateur' });
        }

        await modelEmailDeleteToken(request, token);

        const accessToken = request.server.signToken({ id: userId });
        const refreshToken = request.server.refreshSignToken({ id: userId });

        return reply
            .setCookie('access_token', accessToken, cookieOptions())
            .setCookie('refresh_token', refreshToken, cookieOptions())
            .code(200)
            .send({
                message: 'E-mail vérifié avec succès.',
                userId: userId,
            });

    } catch (error) {
        request.log.error(error, 'Unexpected error:');
        return reply.code(500).send({ error: 'Erreur interne du serveur' });
    }
};

export const authDeleteEmailToken = async (request, reply) => {
    try {
        const { token } = request.query;
        if (!token) {
            return reply.code(400).send({ error: 'Token requis.' });
        }

        const tokenEntry = await modelSearchToken(request, token);
        if (!tokenEntry) {
            return reply.code(400).send({ error: 'Token invalide ou déjà supprimé.' });
        }

        await modelEmailDeleteToken(request, token);

        return reply.code(200).send({ message: 'Token supprimé avec succès.' });
    } catch (err) {
        request.log.error(err, 'Error deleting email token:');
        return reply.code(500).send({ error: 'Erreur interne du serveur' });
    }
};