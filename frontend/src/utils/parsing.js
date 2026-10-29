export function isValidEmail(email) {
  const trimmed = email.trim();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(trimmed);
}

export function isValidPassword(password) {
  if (!password) return false;
  const trimmed = password.trim();
  if (trimmed.length < 8) return false;
  const hasUppercase = /[A-Z]/.test(trimmed);
  const hasNumber = /\d/.test(trimmed);
  return hasUppercase && hasNumber;
}

export function isValidUsername(username) {
  if (!username) return false;
  const trimmed = username.trim();

  if (trimmed.length < 3 || trimmed.length > 20) return false;
  const regex = /^[a-zA-Z0-9_]+$/;
  return regex.test(trimmed);
}

export function isValidName(name) {
  if (!name) return false;
  const trimmed = name.trim();
  if (trimmed.length < 2 || trimmed.length > 30) return false;

  const regex = /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]+$/u;

  return regex.test(trimmed) && /[a-zA-ZÀ-ÖØ-öø-ÿ]/u.test(trimmed);
}
