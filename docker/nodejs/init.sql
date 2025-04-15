CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    profile_picture TEXT,  -- Colonne pour la photo de profil (peut contenir une URL ou le chemin du fichier)
    firstname VARCHAR(100) -- Colonne pour le prénom
);
