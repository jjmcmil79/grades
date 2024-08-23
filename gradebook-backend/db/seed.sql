-- Insert sample data
INSERT INTO classes (name) VALUES
    ('Mathematics'),
    ('Science'),
    ('History'),
    ('English'),
    ('Computer Science'),
    ('Physics'),
    ('Chemistry'),
    ('Biology'),
    ('Art'),
    ('Music'),
    ('MasterLife');

-- Insert sample users
INSERT INTO users (first_name, last_name, email, password_hash) VALUES
    ('Admin', 'User', 'admin@example.com', 'hashed_password_here'),
    ('Teacher', 'One', 'teacher1@example.com', 'hashed_password_here'),
    ('Teacher', 'Two', 'teacher2@example.com', 'hashed_password_here');

-- Insert sample students with user associations
INSERT INTO students (first_name, last_name, phone_number, email, user_id) VALUES
    ('John', 'Doe', '1234567890', 'john.doe@example.com', 1),
    ('Jane', 'Smith', '2345678901', 'jane.smith@example.com', 2),
    ('Bob', 'Johnson', '3456789012', 'bob.johnson@example.com', 3),
    ('Alice', 'Brown', '4567890123', 'alice.brown@example.com', 1),
    ('Charlie', 'Davis', '5678901234', 'charlie.davis@example.com', 2),
    ('Eva', 'Wilson', '6789012345', 'eva.wilson@example.com', 3),
    ('Frank', 'Miller', '7890123456', 'frank.miller@example.com', 1),
    ('Grace', 'Lee', '8901234567', 'grace.lee@example.com', 2),
    ('Henry', 'Taylor', '9012345678', 'henry.taylor@example.com', 3),
    ('Ivy', 'Clark', '0123456789', 'ivy.clark@example.com', 1);

INSERT INTO assignments (name, class_id) VALUES
    ('Math Quiz 1', 1),
    ('Science Project', 2),
    ('History Essay', 3),
    ('English Book Report', 4),
    ('Programming Assignment', 5),
    ('Physics Lab', 6),
    ('Chemistry Experiment', 7),
    ('Biology Research Paper', 8),
    ('Art Portfolio', 9),
    ('Music Composition', 10),
    ('Book 1 Presentation', 11),
    ('Book 2 Presentation', 11),
    ('Book 3 Presentation', 11),
    ('Book 4 Presentation', 11);

-- Enroll every student in every class
INSERT INTO student_classes (student_id, class_id)
SELECT s.id, c.id
FROM students s
CROSS JOIN classes c;

-- Generate a grade for every student for every assignment
INSERT INTO grades (score, student_id, assignment_id)
SELECT 
    floor(random() * (100-60+1) + 60)::int, -- Random score between 60 and 100
    s.id,
    a.id
FROM students s
CROSS JOIN assignments a;