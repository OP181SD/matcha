

const EMAIL_RE = /^[\w-.]+@[\w-]+\.[a-z]{2,}$/i;
const USERNAME_RE = /^[A-Za-z0-9_]+$/;
const NAME_RE = /^[a-zA-ZÀ-ÿ\s'-]+$/;

const COMMON_PASSWORDS = new Set([
  "password", "password1", "password123", "123456", "123456789", "12345678",
  "qwerty", "qwerty123", "abc123", "iloveyou", "admin", "letmein", "monkey",
  "dragon", "master", "sunshine", "princess", "welcome", "shadow", "superman",
  "michael", "football", "baseball", "soccer", "hockey", "batman", "trustno1",
  "111111", "1234567", "hello", "charlie", "donald", "password2", "qwertyuiop",
]);

export const checkEmail = (email) => {
  if (!email) return { ok: false, msg: "Email est requis." };
  if (!EMAIL_RE.test(email)) return { ok: false, msg: "Format d'email invalide." };
  return { ok: true };
};

export const checkUsername = (username) => {
  if (!username || username.length < 3 || username.length > 20 || !USERNAME_RE.test(username)) {
    return { ok: false, msg: "Nom d'utilisateur invalide (3-20 caractères : lettres, chiffres, _)." };
  }
  return { ok: true };
};

export const checkName = (value, label) => {
  if (!value || value.length < 2 || value.length > 30 || !NAME_RE.test(value)) {
    return { ok: false, msg: `${label} invalide. (2 à 30 caractères, lettres, espaces, - ')` };
  }
  return { ok: true };
};

export const checkPassword = (password) => {
  if (!password) return { ok: false, msg: "Mot de passe requis." };
  if (password.length < 8) return { ok: false, msg: "Le mot de passe doit faire au moins 8 caractères." };
  if (!/[A-Z]/.test(password)) return { ok: false, msg: "Le mot de passe doit contenir au moins une majuscule." };
  if (!/\d/.test(password)) return { ok: false, msg: "Le mot de passe doit contenir au moins un chiffre." };
  const lower = password.toLowerCase();
  const alphaOnly = lower.replace(/[^a-z]/g, '');
  if (COMMON_PASSWORDS.has(lower) || COMMON_PASSWORDS.has(alphaOnly)) {
    return { ok: false, msg: "Ce mot de passe est trop courant. Choisissez-en un plus sécurisé." };
  }
  return { ok: true };
};
