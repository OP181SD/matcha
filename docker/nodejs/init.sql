CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL, 
    is_online BOOLEAN NOT NULL DEFAULT FALSE,
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS profiles (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    gender VARCHAR(50),
    age DECIMAL(3),
    sexual_preferences VARCHAR(50),
    biography TEXT,
    fame_rating INTEGER DEFAULT 0,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    city TEXT,
    is_geolocation_active BOOLEAN DEFAULT TRUE,
    last_connection TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_filters (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    age_min INTEGER,
    age_max INTEGER,
    popularity_min INTEGER,
    distance_max INTEGER,
    tags TEXT[]
);

CREATE TABLE IF NOT EXISTS tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS profile_tags (
    profile_id INTEGER REFERENCES profiles(user_id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (profile_id, tag_id)
);

CREATE TABLE IF NOT EXISTS pictures (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    is_profile_picture BOOLEAN DEFAULT FALSE
);


CREATE TABLE IF NOT EXISTS likes (
    liker_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    liked_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (liker_id, liked_id),
    CHECK (liker_id <> liked_id)
);

CREATE INDEX IF NOT EXISTS idx_likes_liked_id ON likes(liked_id);

CREATE TABLE IF NOT EXISTS dislikes (
    disliker_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    disliked_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (disliker_id, disliked_id),
    CHECK (disliker_id <> disliked_id)
);

CREATE INDEX IF NOT EXISTS idx_dislikes_disliked_id ON dislikes(disliked_id);

CREATE TABLE IF NOT EXISTS blocks (
    blocker_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    blocked_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (blocker_id, blocked_id),
    CHECK (blocker_id <> blocked_id)
);

CREATE INDEX IF NOT EXISTS idx_blocks_blocked_id ON blocks(blocked_id);

CREATE TABLE IF NOT EXISTS views (
    id SERIAL PRIMARY KEY,
    viewer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    viewed_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    reporter_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reported_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS channel (
    id SERIAL PRIMARY KEY,
    user_id_1 INTEGER REFERENCES users(id) ON DELETE CASCADE,
    user_id_2 INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (user_id_1 <> user_id_2)
);


CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    channel_id INTEGER REFERENCES channel(id) ON DELETE CASCADE,
    sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL
);


CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE IF NOT EXISTS email_verification_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    data JSONB NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    read_at TIMESTAMP NULL
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

COMMENT ON TABLE notifications IS 'Table des notifications en temps réel';
COMMENT ON COLUMN notifications.type IS 'Type de notification: like_received, profile_viewed, match, message_received, like_removed';
COMMENT ON COLUMN notifications.data IS 'Données JSON de la notification';
COMMENT ON COLUMN notifications.is_read IS 'Notification lue ou non';
COMMENT ON COLUMN notifications.read_at IS 'Date de lecture de la notification';
