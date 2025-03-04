// config/database.js
import { Pool } from './import.js'; 

export const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT
});

async function connexion() {
  try {
    const connectPool = await pool.connect();
    console.log("Connecté à la base de données !");
    connectPool.release();
  } catch (error) {
    console.error("Erreur lors de la connexion à la base de données :", error);
  }
}

connexion();
