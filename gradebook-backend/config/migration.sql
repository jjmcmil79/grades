-- Drop tables if they exist
DROP TABLE IF EXISTS grades;
DROP TABLE IF EXISTS student_classes;
DROP TABLE IF EXISTS assignments;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS classes;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create tables
CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    email VARCHAR(255),
    user_id INTEGER REFERENCES users(id)
);


CREATE TABLE assignments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE
);

CREATE TABLE student_classes (
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    PRIMARY KEY (student_id, class_id)
);

CREATE TABLE grades (
    id SERIAL PRIMARY KEY,
    score FLOAT NOT NULL,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    assignment_id INTEGER REFERENCES assignments(id) ON DELETE CASCADE
);

