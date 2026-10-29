const GENDERS = ["homme", "femme"];
const SEXUAL_PREFERENCES = ["hétérosexuel", "homosexuel", "bisexuel"];

export const checkGender = (gender) => {
  if (!GENDERS.includes(gender)) return { ok: false, msg: "Genre invalide." };
  return { ok: true };
};

export const checkSexualPreferences = (pref) => {
  if (!SEXUAL_PREFERENCES.includes(pref)) return { ok: false, msg: "Préférence sexuelle invalide." };
  return { ok: true };
};

export const checkAge = (age) => {
  if (typeof age !== "number" || age < 18 || age > 120) return { ok: false, msg: "Âge invalide (18-120)." };
  return { ok: true };
};

export const checkBiography = (bio) => {
  if (typeof bio !== "string" || bio.length < 1 || bio.length > 144) {
    return { ok: false, msg: "Biographie invalide (1-144 caractères)." };
  }
  return { ok: true };
};

export const checkCity = (city) => {
  if (typeof city !== "string" || city.length < 2 || city.length > 100) return { ok: false, msg: "Ville invalide." };
  return { ok: true };
};

export const checkCoordinates = (latitude, longitude) => {
  if (typeof latitude !== "number" || typeof longitude !== "number") return { ok: false, msg: "Localisation invalide." };
  return { ok: true };
};
