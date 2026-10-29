import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || 'mailhog',
  port: Number(process.env.MAIL_PORT) || 1025,
  secure: false,
  ignoreTLS: true,
});

const APP_URL = process.env.APP_URL || 'http://localhost:8080';

export async function sendVerificationEmail(userEmail, verificationToken) {
  const verifyUrl = `${APP_URL}/confirm-email?token=${verificationToken}`;

  const mailOptions = {
    from: `"Matcha" <${process.env.MAIL_USER}>`,
    to: userEmail,
    subject: 'Vérifiez votre adresse email pour Matcha',
    html: `
      <h2>Bienvenue sur Matcha !</h2>
      <p>Merci de vous être inscrit. Pour activer votre compte, veuillez cliquer sur le lien ci-dessous :</p>
      <a href="${verifyUrl}">Valider mon compte</a>
      <p>Si vous n'avez pas créé de compte, ignorez ce message.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
  console.error("Erreur lors de l’envoi du mail de vérification :", error.message);
    throw error;
  }

}

export async function sendPasswordResetEmail(userEmail, resetToken) {
  const resetUrl = `${APP_URL}/confirm-password-reset?token=${resetToken}`;

  const mailOptions = {
    from: `"Matcha" <${process.env.MAIL_USER}>`,
    to: userEmail,
    subject: 'Réinitialisation de votre mot de passe Matcha',
    html: `
      <h2>Réinitialisation de votre mot de passe</h2>
      <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le lien ci-dessous pour choisir un nouveau mot de passe :</p>
      <a href="${resetUrl}">Réinitialiser mon mot de passe</a>
      <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Erreur lors de l’envoi du mail de réinitialisation :", error.message);
    throw error;
  }
}