-- Création de la table users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    profile_picture TEXT,  -- Colonne pour la photo de profil (peut contenir une URL ou le chemin du fichier)
    firstname VARCHAR(100) -- Colonne pour le prénom
);

-- Création de la table profiles
CREATE TABLE IF NOT EXISTS profiles (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    gender VARCHAR(50),
    sexual_preferences VARCHAR(50),
    biography TEXT,
    fame_rating INTEGER DEFAULT 0,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    is_geolocation_active BOOLEAN DEFAULT TRUE,
    last_connection TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    image_url TEXT
);

-- Création de la table des tags réutilisables
CREATE TABLE IF NOT EXISTS tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Création de la table pivot profile_tags (profil et tags)
CREATE TABLE IF NOT EXISTS profile_tags (
    profile_id INTEGER REFERENCES profiles(user_id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (profile_id, tag_id)
);

-- Création de la table pour stocker les photos de profil
CREATE TABLE IF NOT EXISTS pictures (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    is_profile_picture BOOLEAN DEFAULT FALSE
);

-- Création de la table des likes
CREATE TABLE IF NOT EXISTS likes (
    id SERIAL PRIMARY KEY,
    liker_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    liked_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table des vues de profils
CREATE TABLE IF NOT EXISTS views (
    id SERIAL PRIMARY KEY,
    viewer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    viewed_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
