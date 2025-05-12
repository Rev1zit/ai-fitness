CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_complexes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    weight INTEGER,
    height INTEGER,
    injuries TEXT,
    age INTEGER,
    query_text TEXT,
    ai_response TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
); 