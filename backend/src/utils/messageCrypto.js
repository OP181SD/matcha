import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;

if (!process.env.MESSAGE_SECRET) {
  throw new Error("MESSAGE_SECRET manquant : définissez-le dans .env (clé de chiffrement des messages).");
}

const SECRET_KEY = crypto
  .createHash("sha256")
  .update(process.env.MESSAGE_SECRET)
  .digest();

export const encryptMessage = (text) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex");

  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
};

export const decryptMessage = (encryptedText) => {
  const [ivHex, authTagHex, encrypted] = encryptedText.split(":");

  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};

export const isEncrypted = (content) => {
  return typeof content === "string" && content.split(":").length === 3;
};