

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'dunrzye1v';
const MAX_URL_LENGTH = 500;

export function isValidCloudinaryImageUrl(url) {
  if (typeof url !== 'string' || url.length === 0 || url.length > MAX_URL_LENGTH) {
    return false;
  }

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }

  if (parsed.protocol !== 'https:') return false;
  if (parsed.hostname !== 'res.cloudinary.com') return false;

  const expectedPrefix = `/${CLOUD_NAME}/image/upload/`;
  if (!parsed.pathname.startsWith(expectedPrefix)) return false;

  return true;
}
