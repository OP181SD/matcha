import { authRegister } from "../controllers/auth/register/registerController.js";
import { authLogin, authLogout, refreshToken } from "../controllers/auth/login/loginController.js";
import {
  authGenerateEmailToken,
  authVerifyEmailToken,
  authDeleteEmailToken
} from "../controllers/auth/email/authEmail.js";
import {
  authGeneratePasswordResetToken,
  authVerifyPasswordToken,
  authResetPassword
} from "../controllers/auth/password/authPassword.js";
import {
  authUpdateEmail,
  authUpdatePassword,
  authUpdateFirstName,
  authUpdateLastName,
  authUpdateUsername,
  authOnlineUsers,
} from '../controllers/auth/settings/authControllersSettings.js';
import { checkAuth, getMe, deleteAccount } from '../controllers/auth/session/sessionController.js';
import { getUserGender } from "../controllers/profile/profileController.js";
import { reverseGeocode, forwardGeocode } from "../controllers/geocode/geocodeController.js";

export default async function authRoutes(fastify) {
  fastify.post('/register', authRegister);
  fastify.post('/login', authLogin);
  fastify.post('/refresh-token', refreshToken);
  fastify.post('/logout', { preHandler: [fastify.authenticate] }, authLogout);
  fastify.get('/check-auth', { preHandler: [fastify.authenticate] }, checkAuth);
  fastify.get('/authOnlineUsers', { preHandler: [fastify.authenticate] }, authOnlineUsers);

  fastify.post('/generate-email-token', authGenerateEmailToken);
  fastify.get('/confirm-email', authVerifyEmailToken);
  fastify.delete('/delete-email-token', authDeleteEmailToken);

  fastify.post('/generate-password-reset-token', authGeneratePasswordResetToken);
  fastify.get('/confirm-password-reset', authVerifyPasswordToken);
  fastify.post('/reset-password', authResetPassword);

  fastify.put('/update-email', { preHandler: [fastify.authenticate] }, authUpdateEmail);
  fastify.put('/update-password', { preHandler: [fastify.authenticate] }, authUpdatePassword);
  fastify.put('/update-firstname', { preHandler: [fastify.authenticate] }, authUpdateFirstName);
  fastify.put('/update-lastname', { preHandler: [fastify.authenticate] }, authUpdateLastName);
  fastify.put('/update-username', { preHandler: [fastify.authenticate] }, authUpdateUsername);

  fastify.get('/me', { preHandler: [fastify.optionalAuth] }, getMe);
  fastify.get('/gender', { preHandler: [fastify.authenticate] }, getUserGender);
  fastify.delete('/delete', { preHandler: [fastify.authenticate] }, deleteAccount);

  fastify.get('/reverse-geocode', { preHandler: [fastify.authenticate] }, reverseGeocode);
  fastify.get('/forward-geocode', { preHandler: [fastify.authenticate] }, forwardGeocode);
}
