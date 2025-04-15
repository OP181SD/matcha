import dotenv from 'dotenv';

dotenv.config();

export const API_URL = 'http://127.0.0.1:5001';
export const JWT_SECRET = process.env.JWT_SECRET;
export const DATABASE_URL = process.env.DATABASE_URL;

export { dotenv };