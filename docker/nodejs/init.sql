-- Création de la table users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    image_url TEXT NOT NULL,
    last_connection TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
