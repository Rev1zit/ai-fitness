-- Пользователи
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Тренеры
CREATE TABLE trainers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(255),
    img VARCHAR(255),
    bio TEXT,
    tags TEXT[]
);

-- Залы
CREATE TABLE halls (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Типы тренировок
CREATE TABLE session_types (
    id SERIAL PRIMARY KEY,
    code VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL
);

-- Занятия/расписание
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    hall_id INTEGER REFERENCES halls(id),
    session_type_id INTEGER REFERENCES session_types(id),
    name VARCHAR(255) NOT NULL,
    day VARCHAR(20) NOT NULL,
    time VARCHAR(20) NOT NULL
);

-- Заявки на тренировку
CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 