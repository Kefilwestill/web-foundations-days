CREATE TABLE students (
    student_id INTEGER PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

CREATE TABLE courses (
    course_id INTEGER PRIMARY KEY,
    course_name TEXT NOT NULL,
    course_code TEXT NOT NULL
);

CREATE TABLE enrolments (
    enrolment_id INTEGER PRIMARY KEY,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade TEXT,

    FOREIGN KEY (student_id)
        REFERENCES students(student_id),

    FOREIGN KEY (course_id)
        REFERENCES courses(course_id),

    UNIQUE(student_id, course_id)
);

INSERT INTO students
(student_id, first_name, last_name, email)
VALUES
(1, 'Kefilwe', 'Makoro', 'kefilwe@example.com'),
(2, 'Grace', 'Ndlovu', 'grace@example.com'),
(3, 'John', 'Smith', 'john@example.com'),
(4, 'Sarah', 'Mokoena', 'sarah@example.com');

INSERT INTO courses
(course_id, course_name, course_code)
VALUES
(1, 'Web Development', 'WEB101'),
(2, 'Database Systems', 'DBS201'),
(3, 'JavaScript Fundamentals', 'JS301');

INSERT INTO enrolments
(enrolment_id, student_id, course_id, grade)
VALUES
(1, 1, 1, 'A'),
(2, 1, 3, 'B'),
(3, 2, 1, 'A'),
(4, 3, 2, 'C'),
(5, 3, 3, 'B');

SELECT
    s.first_name,
    s.last_name,
    c.course_name
FROM students s
JOIN enrolments e
    ON s.student_id = e.student_id
JOIN courses c
    ON e.course_id = c.course_id
WHERE s.first_name = 'Kefilwe';

SELECT
    c.course_name,
    s.first_name,
    s.last_name
FROM courses c
JOIN enrolments e
    ON c.course_id = e.course_id
JOIN students s
    ON e.student_id = s.student_id
WHERE c.course_name = 'Web Development';


SELECT
    c.course_name,
    COUNT(e.student_id) AS student_count
FROM courses c
LEFT JOIN enrolments e
    ON c.course_id = e.course_id
GROUP BY c.course_id, c.course_name;

SELECT
    s.student_id,
    s.first_name,
    s.last_name
FROM students s
LEFT JOIN enrolments e
    ON s.student_id = e.student_id
WHERE e.student_id IS NULL;

UPDATE enrolments
SET grade = 'A'
WHERE enrolment_id = 4;