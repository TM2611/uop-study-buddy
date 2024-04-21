/*
 * This SQL file is used to create and populate tables for the application.
 * It should be uploaded to the Azure PostgreSQL database for the application (best done by using the Azure Commandline Interface).
 * 
 * Note: The drop_all_tables() function is intended for development stage only
 * and should not be used in a production environment.
 */

CREATE OR REPLACE FUNCTION drop_all() RETURNS VOID AS $$
DECLARE
    table_name RECORD;
    type_name RECORD;
    function_name RECORD;
BEGIN
    -- Drop tables
    FOR table_name IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS "' || table_name.tablename || '" CASCADE';
    END LOOP;

    -- Drop types (including ENUMs)
    FOR type_name IN (SELECT t.typname FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) LOOP
        EXECUTE 'DROP TYPE IF EXISTS "' || type_name.typname || '" CASCADE';
    END LOOP;

    -- Drop functions
    FOR function_name IN (
        SELECT p.oid::regprocedure
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
    ) LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS ' || function_name.oid || ' CASCADE';
    END LOOP;
END;
$$ LANGUAGE plpgsql;

SELECT drop_all();

SET datestyle = 'ISO, DMY';

CREATE TABLE department (
    id SMALLSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

INSERT INTO department (name) VALUES
('School of Computing'),
('School of Energy and Electronic Engineering');


CREATE TABLE topic (
    topic_id SMALLSERIAL PRIMARY KEY,
    topic_name VARCHAR(50) NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(id)
);

--School of Computing
INSERT INTO topic (topic_name, department_id) VALUES
('Data Structures and Algorithms', (SELECT id FROM department WHERE name = 'School of Computing')),
('Architecture and Operating Systems', (SELECT id FROM department WHERE name = 'School of Computing')),
('Artificial Intelligence', (SELECT id FROM department WHERE name = 'School of Computing')),
('Machine Learning and Deep Learning', (SELECT id FROM department WHERE name = 'School of Computing')),
('Computer Networks and Protocols', (SELECT id FROM department WHERE name = 'School of Computing')),
('Cybersecurity and Cryptography', (SELECT id FROM department WHERE name = 'School of Computing')),
('Software Engineering and Design Patterns', (SELECT id FROM department WHERE name = 'School of Computing')),
('Web Development and Full Stack Development', (SELECT id FROM department WHERE name = 'School of Computing')),
('Mobile Application Development', (SELECT id FROM department WHERE name = 'School of Computing')),
('Cloud Computing and Distributed Systems', (SELECT id FROM department WHERE name = 'School of Computing'));

--School of Energy and Electronic Engineering
INSERT INTO topic (topic_name, department_id) VALUES
('Smart Grids and Renewable Energy', (SELECT id FROM department WHERE name = 'School of Energy and Electronic Engineering')),
('Electrical Power Systems and Distribution', (SELECT id FROM department WHERE name = 'School of Energy and Electronic Engineering')),
('Control Systems and Automation', (SELECT id FROM department WHERE name = 'School of Energy and Electronic Engineering')),
('Analog and Digital Electronics', (SELECT id FROM department WHERE name = 'School of Energy and Electronic Engineering')),
('Signal Processing and Communication', (SELECT id FROM department WHERE name = 'School of Energy and Electronic Engineering')),
('Embedded Systems and Microcontrollers', (SELECT id FROM department WHERE name = 'School of Energy and Electronic Engineering')),
('Optoelectronics and Photonics', (SELECT id FROM department WHERE name = 'School of Energy and Electronic Engineering')),
('Robotics and Mechatronics', (SELECT id FROM department WHERE name = 'School of Energy and Electronic Engineering')),
('Biomedical Engineering and Biosensors', (SELECT id FROM department WHERE name = 'School of Energy and Electronic Engineering')),
('Nanotechnology and Advanced Materials', (SELECT id FROM department WHERE name = 'School of Energy and Electronic Engineering')),
('Electric Vehicles and Sustainable Transportation', (SELECT id FROM department WHERE name = 'School of Energy and Electronic Engineering'));

CREATE TYPE course_level AS ENUM ('UG', 'PG');
CREATE TABLE course (
    course_code VARCHAR(12) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    department_id INT NOT NULL,
    level course_level NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(id)
);

-- School of Computing
INSERT INTO course (course_code, name, department_id, level) VALUES
('P3439FTC', 'Artificial Intelligence and Machine Learning (MSc)', (SELECT id FROM department WHERE name = 'School of Computing'), 'PG'),
('U2365PYC', 'Computer Networks', (SELECT id FROM department WHERE name = 'School of Computing'), 'UG'),
('U0056PYC', 'Computer Science (BSc)', (SELECT id FROM department WHERE name = 'School of Computing'), 'UG'),
('U2515PYC', 'Computer Science (MEng)', (SELECT id FROM department WHERE name = 'School of Computing'), 'PG'),
('U0580PYC', 'Computing', (SELECT id FROM department WHERE name = 'School of Computing'), 'UG'),
('U2753PYC', 'Cyber Security and Forensic Computing', (SELECT id FROM department WHERE name = 'School of Computing'), 'UG'),
('C3559FTC', 'Data Science and Analytics', (SELECT id FROM department WHERE name = 'School of Computing'), 'UG'),
('U0968PYC', 'Software Engineering', (SELECT id FROM department WHERE name = 'School of Computing'), 'UG');

-- School of Energy and Electronic Engineering
INSERT INTO course (course_code, name, department_id, level) VALUES
('U2194PYC', 'Engineering and Technology (BEng)', (SELECT id FROM department WHERE name = 'School of Energy and Electronic Engineering'), 'UG'),
('U2174PYC', 'Electronic Engineering (BEng)', (SELECT id FROM department WHERE name = 'School of Energy and Electronic Engineering'), 'UG');

CREATE TABLE student (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(64) NOT NULL,
  given_name VARCHAR(50) NOT NULL,
  family_name VARCHAR(50) NOT NULL,
  picture VARCHAR(255),
  course_code VARCHAR(12) NOT NULL,
  year SMALLINT NOT NULL CHECK (year BETWEEN 1 AND 4),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (course_code) REFERENCES course(course_code)
);

INSERT INTO student (id, email, given_name, family_name, picture, course_code, year) 
VALUES 
-- School of Computing
('932756', 'up932756@myport.ac.uk', 'John', 'Doe', 'https://randomuser.me/api/portraits/men/0.jpg', 'U0056PYC', 1), 
('932757', 'up932757@myport.ac.uk', 'Kate', 'Doe', 'https://randomuser.me/api/portraits/women/0.jpg', 'U0056PYC', 1), 
('932758', 'up932758@myport.ac.uk', 'Zack', 'Smith', 'https://randomuser.me/api/portraits/men/1.jpg', 'U0968PYC', 3),
('932759', 'up932759@myport.ac.uk', 'Jenny', 'Smith', 'https://randomuser.me/api/portraits/women/2.jpg', 'U0968PYC', 3),
('932760', 'up932760@myport.ac.uk', 'Tom', 'Brown', 'https://randomuser.me/api/portraits/men/3.jpg', 'U0056PYC', 2),
('932761', 'up932761@myport.ac.uk', 'Emma', 'Taylor', 'https://randomuser.me/api/portraits/women/3.jpg', 'P3439FTC', 1),
('932762', 'up932762@myport.ac.uk', 'Mark', 'Jones', 'https://randomuser.me/api/portraits/men/4.jpg', 'U2365PYC', 2),
('932763', 'up932763@myport.ac.uk', 'Lucy', 'White', 'https://randomuser.me/api/portraits/women/4.jpg', 'U2515PYC', 4),
('932764', 'up932764@myport.ac.uk', 'Liam', 'Harris', 'https://randomuser.me/api/portraits/men/5.jpg', 'U0580PYC', 1),
('932765', 'up932765@myport.ac.uk', 'Sophie', 'Walker', 'https://randomuser.me/api/portraits/women/5.jpg', 'U2753PYC', 3),
('932766', 'up932766@myport.ac.uk', 'Nathan', 'Patel', 'https://randomuser.me/api/portraits/men/6.jpg', 'C3559FTC', 1),
('932767', 'up932767@myport.ac.uk', 'Alice', 'Young', 'https://randomuser.me/api/portraits/women/6.jpg', 'U2365PYC', 1),
('932768', 'up932768@myport.ac.uk', 'David', 'Thompson', 'https://randomuser.me/api/portraits/men/7.jpg', 'U0056PYC', 2),
('932769', 'up932769@myport.ac.uk', 'Claire', 'Martin', 'https://randomuser.me/api/portraits/women/7.jpg', 'U2515PYC', 4),
('932770', 'up932770@myport.ac.uk', 'Evan', 'Murphy', 'https://randomuser.me/api/portraits/men/8.jpg', 'C3559FTC', 1),
('932771', 'up932771@myport.ac.uk', 'Isla', 'Green', 'https://randomuser.me/api/portraits/women/8.jpg', 'U0968PYC', 1),
('932772', 'up932772@myport.ac.uk', 'Sam', 'Alexander', 'https://randomuser.me/api/portraits/men/9.jpg', 'U0968PYC', 2),
('932773', 'up932773@myport.ac.uk', 'Ava', 'Adams', 'https://randomuser.me/api/portraits/women/9.jpg', 'U0968PYC', 3),
('932774', 'up932774@myport.ac.uk', 'Leon', 'Turner', 'https://randomuser.me/api/portraits/men/10.jpg', 'U0968PYC', 4),
('932775', 'up932775@myport.ac.uk', 'Mila', 'Gibson', 'https://randomuser.me/api/portraits/women/10.jpg', 'U0968PYC', 2),
('932776', 'up932776@myport.ac.uk', 'Aaron', 'Spencer', 'https://randomuser.me/api/portraits/men/11.jpg', 'U0968PYC', 1),
('932777', 'up932777@myport.ac.uk', 'Leah', 'Mason', 'https://randomuser.me/api/portraits/women/11.jpg', 'U0968PYC', 3),
('932778', 'up932778@myport.ac.uk', 'Harry', 'Parker', 'https://randomuser.me/api/portraits/men/12.jpg', 'U0968PYC', 4),
('932779', 'up932779@myport.ac.uk', 'Amelia', 'Long', 'https://randomuser.me/api/portraits/women/12.jpg', 'U0968PYC', 1),
('932780', 'up932780@myport.ac.uk', 'Louis', 'Baker', 'https://randomuser.me/api/portraits/men/13.jpg', 'U0968PYC', 2),
('932781', 'up932781@myport.ac.uk', 'Olivia', 'Smith', 'https://randomuser.me/api/portraits/women/13.jpg', 'P3439FTC', 3),
('932782', 'up932782@myport.ac.uk', 'George', 'Johnson', 'https://randomuser.me/api/portraits/men/14.jpg', 'U2365PYC', 2),
('932783', 'up932783@myport.ac.uk', 'Sophia', 'Williams', 'https://randomuser.me/api/portraits/women/14.jpg', 'U0056PYC', 4),
('932784', 'up932784@myport.ac.uk', 'Jack', 'Brown', 'https://randomuser.me/api/portraits/men/15.jpg', 'U2515PYC', 1),
('932785', 'up932785@myport.ac.uk', 'Lily', 'Jones', 'https://randomuser.me/api/portraits/women/15.jpg', 'U0580PYC', 3),
('932786', 'up932786@myport.ac.uk', 'Ethan', 'Davis', 'https://randomuser.me/api/portraits/men/16.jpg', 'U2753PYC', 1),
('932787', 'up932787@myport.ac.uk', 'Grace', 'Miller', 'https://randomuser.me/api/portraits/women/16.jpg', 'C3559FTC', 4),
('932788', 'up932788@myport.ac.uk', 'Noah', 'Wilson', 'https://randomuser.me/api/portraits/men/17.jpg', 'U0968PYC', 3),
('932789', 'up932789@myport.ac.uk', 'Ava', 'Moore', 'https://randomuser.me/api/portraits/women/17.jpg', 'P3439FTC', 2),
('932790', 'up932790@myport.ac.uk', 'Leo', 'Taylor', 'https://randomuser.me/api/portraits/men/18.jpg', 'U2365PYC', 1),
('932791', 'up932791@myport.ac.uk', 'Mia', 'Anderson', 'https://randomuser.me/api/portraits/women/18.jpg', 'U0056PYC', 4),
('932792', 'up932792@myport.ac.uk', 'Charlie', 'Thomas', 'https://randomuser.me/api/portraits/men/19.jpg', 'U2515PYC', 3),
('932793', 'up932793@myport.ac.uk', 'Isla', 'Jackson', 'https://randomuser.me/api/portraits/women/19.jpg', 'U0580PYC', 2),
('932794', 'up932794@myport.ac.uk', 'Oliver', 'White', 'https://randomuser.me/api/portraits/men/20.jpg', 'U2753PYC', 1),
('932795', 'up932795@myport.ac.uk', 'Sophie', 'Harris', 'https://randomuser.me/api/portraits/women/20.jpg', 'C3559FTC', 4);

CREATE TABLE student_confidence (
  user_id VARCHAR(36) NOT NULL,
  topic_id SMALLINT NOT NULL,
  confidence_value SMALLINT NOT NULL CHECK (confidence_value BETWEEN 1 AND 5),
  PRIMARY KEY (user_id, topic_id),
  FOREIGN KEY (user_id) REFERENCES student(id),
  FOREIGN KEY (topic_id) REFERENCES topic(topic_id)
);

INSERT INTO student_confidence VALUES
-- School of Computing 
('932756', 1, 5),
('932756', 2, 4),
('932756', 3, 3),
('932756', 4, 2),
('932756', 5, 1),
('932756', 6, 5),
('932756', 7, 4),
('932756', 8, 3),
('932756', 9, 2),
('932756', 10, 1),
('932757', 1, 5),
('932757', 2, 4),
('932757', 3, 3),
('932757', 4, 2),
('932757', 5, 1),
('932757', 6, 5),
('932757', 7, 4),
('932757', 8, 3),
('932757', 9, 2),
('932757', 10, 1),
('932758', 1, 5),
('932758', 2, 4),
('932758', 3, 3),
('932758', 4, 2),
('932758', 5, 1),
('932758', 6, 5),
('932758', 7, 4),
('932758', 8, 3),
('932758', 9, 2),
('932758', 10, 1),
('932759', 1, 5),
('932759', 2, 4),
('932759', 3, 3),
('932759', 4, 2),
('932759', 5, 1),
('932759', 6, 5),
('932759', 7, 4),
('932759', 8, 3),
('932759', 9, 2),
('932759', 10, 1),
('932760', 1, 5),
('932760', 2, 4),
('932760', 3, 3),
('932760', 4, 2),
('932760', 5, 1),
('932760', 6, 5),
('932760', 7, 4),
('932760', 8, 3),
('932760', 9, 2),
('932760', 10, 1),
('932761', 1, 5),
('932761', 2, 4),
('932761', 3, 3),
('932761', 4, 2),
('932761', 5, 1),
('932761', 6, 5),
('932761', 7, 4),
('932761', 8, 3),
('932761', 9, 2),
('932761', 10, 1),
('932762', 1, 5),
('932762', 2, 4),
('932762', 3, 3),
('932762', 4, 2),
('932762', 5, 1),
('932762', 6, 5),
('932762', 7, 4),
('932762', 8, 3),
('932762', 9, 2),
('932762', 10, 1),
('932763', 1, 5),
('932763', 2, 4),
('932763', 3, 3),
('932763', 4, 2),
('932763', 5, 1),
('932763', 6, 5),
('932763', 7, 4),
('932763', 8, 3),
('932763', 9, 2),
('932763', 10, 1),
('932764', 1, 5),
('932764', 2, 4),
('932764', 3, 3),
('932764', 4, 2),
('932764', 5, 1),
('932764', 6, 5),
('932764', 7, 4),
('932764', 8, 3),
('932764', 9, 2),
('932764', 10, 1),
('932765', 1, 5),
('932765', 2, 4),
('932765', 3, 3),
('932765', 4, 2),
('932765', 5, 1),
('932765', 6, 5),
('932765', 7, 4),
('932765', 8, 3),
('932765', 9, 2),
('932765', 10, 1),
('932766', 1, 5),
('932766', 2, 4),
('932766', 3, 3),
('932766', 4, 2),
('932766', 5, 1),
('932766', 6, 5),
('932766', 7, 4),
('932766', 8, 3),
('932766', 9, 2),
('932766', 10, 1),
('932767', 1, 5),
('932767', 2, 4),
('932767', 3, 3),
('932767', 4, 2),
('932767', 5, 1),
('932767', 6, 5),
('932767', 7, 4),
('932767', 8, 3),
('932767', 9, 2),
('932767', 10, 1),
('932768', 1, 1),
('932768', 2, 4),
('932768', 3, 3),
('932768', 4, 2),
('932768', 5, 1),
('932768', 6, 5),
('932768', 7, 4),
('932768', 8, 3),
('932768', 9, 2),
('932768', 10, 1),
('932769', 1, 5),
('932769', 2, 4),
('932769', 3, 3),
('932769', 4, 2),
('932769', 5, 1),
('932769', 6, 5),
('932769', 7, 4),
('932769', 8, 3),
('932769', 9, 2),
('932769', 10, 1),
('932770', 1, 2),
('932770', 2, 4),
('932770', 3, 3),
('932770', 4, 4),
('932770', 5, 1),
('932770', 6, 5),
('932770', 7, 4),
('932770', 8, 3),
('932770', 9, 2),
('932770', 10, 3),
('932771', 1, 3),
('932771', 2, 5),
('932771', 3, 1),
('932771', 4, 4),
('932771', 5, 2),
('932771', 6, 5),
('932771', 7, 3),
('932771', 8, 1),
('932771', 9, 4),
('932771', 10, 2),
('932772', 1, 4),
('932772', 2, 1),
('932772', 3, 5),
('932772', 4, 2),
('932772', 5, 3),
('932772', 6, 1),
('932772', 7, 4),
('932772', 8, 5),
('932772', 9, 2),
('932772', 10, 3),
('932773', 1, 2),
('932773', 2, 4),
('932773', 3, 1),
('932773', 4, 5),
('932773', 5, 3),
('932773', 6, 2),
('932773', 7, 1),
('932773', 8, 4),
('932773', 9, 5),
('932773', 10, 3),
('932774', 1, 5),
('932774', 2, 3),
('932774', 3, 1),
('932774', 4, 4),
('932774', 5, 2),
('932774', 6, 1),
('932774', 7, 5),
('932774', 8, 3),
('932774', 9, 2),
('932774', 10, 4),
('932775', 1, 3),
('932775', 2, 5),
('932775', 3, 4),
('932775', 4, 1),
('932775', 5, 2),
('932775', 6, 4),
('932775', 7, 3),
('932775', 8, 5),
('932775', 9, 1),
('932775', 10, 2),
('932776', 1, 2),
('932776', 2, 4),
('932776', 3, 5),
('932776', 4, 1),
('932776', 5, 3),
('932776', 6, 5),
('932776', 7, 2),
('932776', 8, 4),
('932776', 9, 1),
('932776', 10, 3),
('932777', 1, 5),
('932777', 2, 3),
('932777', 3, 2),
('932777', 4, 4),
('932777', 5, 1),
('932777', 6, 3),
('932777', 7, 5),
('932777', 8, 1),
('932777', 9, 4),
('932777', 10, 2),
('932778', 1, 3),
('932778', 2, 1),
('932778', 3, 4),
('932778', 4, 5),
('932778', 5, 2),
('932778', 6, 4),
('932778', 7, 3),
('932778', 8, 1),
('932778', 9, 5),
('932778', 10, 2),
('932779', 1, 4),
('932779', 2, 5),
('932779', 3, 3),
('932779', 4, 1),
('932779', 5, 2),
('932779', 6, 1),
('932779', 7, 4),
('932779', 8, 5),
('932779', 9, 3),
('932779', 10, 2),
('932780', 1, 1),
('932780', 2, 3),
('932780', 3, 5),
('932780', 4, 4),
('932780', 5, 2),
('932780', 6, 5),
('932780', 7, 1),
('932780', 8, 3),
('932780', 9, 4),
('932780', 10, 2),
('932781', 1, 2),
('932781', 2, 4),
('932781', 3, 1),
('932781', 4, 5),
('932781', 5, 3),
('932781', 6, 1),
('932781', 7, 2),
('932781', 8, 4),
('932781', 9, 5),
('932781', 10, 3),
('932782', 1, 4),
('932782', 2, 1),
('932782', 3, 3),
('932782', 4, 2),
('932782', 5, 5),
('932782', 6, 3),
('932782', 7, 4),
('932782', 8, 1),
('932782', 9, 2),
('932782', 10, 4),
('932783', 1, 5),
('932783', 2, 3),
('932783', 3, 1),
('932783', 4, 2),
('932783', 5, 4),
('932783', 6, 1),
('932783', 7, 5),
('932783', 8, 3),
('932783', 9, 2),
('932783', 10, 4),
('932784', 1, 3),
('932784', 2, 5),
('932784', 3, 4),
('932784', 4, 1),
('932784', 5, 2),
('932784', 6, 4),
('932784', 7, 3),
('932784', 8, 5),
('932784', 9, 1),
('932784', 10, 2),
('932785', 1, 1),
('932785', 2, 4),
('932785', 3, 5),
('932785', 4, 3),
('932785', 5, 2),
('932785', 6, 5),
('932785', 7, 1),
('932785', 8, 4),
('932785', 9, 3),
('932785', 10, 2),
('932786', 1, 2),
('932786', 2, 1),
('932786', 3, 4),
('932786', 4, 5),
('932786', 5, 3),
('932786', 6, 4),
('932786', 7, 2),
('932786', 8, 1),
('932786', 9, 5),
('932786', 10, 3),
('932787', 1, 5),
('932787', 2, 3),
('932787', 3, 2),
('932787', 4, 4),
('932787', 5, 1),
('932787', 6, 3),
('932787', 7, 5),
('932787', 8, 1),
('932787', 9, 4),
('932787', 10, 2),
('932788', 1, 3),
('932788', 2, 1),
('932788', 3, 5),
('932788', 4, 2),
('932788', 5, 4),
('932788', 6, 1),
('932788', 7, 3),
('932788', 8, 5),
('932788', 9, 2),
('932788', 10, 4),
('932789', 1, 4),
('932789', 2, 5),
('932789', 3, 1),
('932789', 4, 3),
('932789', 5, 2),
('932789', 6, 2),
('932789', 7, 4),
('932789', 8, 5),
('932789', 9, 1),
('932789', 10, 3),
('932790', 1, 1),
('932790', 2, 3),
('932790', 3, 5),
('932790', 4, 4),
('932790', 5, 2),
('932790', 6, 5),
('932790', 7, 1),
('932790', 8, 3),
('932790', 9, 4),
('932790', 10, 2),
('932791', 1, 2),
('932791', 2, 4),
('932791', 3, 1),
('932791', 4, 5),
('932791', 5, 3),
('932791', 6, 1),
('932791', 7, 2),
('932791', 8, 4),
('932791', 9, 5),
('932791', 10, 3),
('932792', 1, 4),
('932792', 2, 1),
('932792', 3, 3),
('932792', 4, 2),
('932792', 5, 5),
('932792', 6, 3),
('932792', 7, 4),
('932792', 8, 1),
('932792', 9, 2),
('932792', 10, 4),
('932793', 1, 5),
('932793', 2, 3),
('932793', 3, 1),
('932793', 4, 2),
('932793', 5, 4),
('932793', 6, 1),
('932793', 7, 5),
('932793', 8, 3),
('932793', 9, 2),
('932793', 10, 4),
('932794', 1, 3),
('932794', 2, 5),
('932794', 3, 4),
('932794', 4, 1),
('932794', 5, 2),
('932794', 6, 4),
('932794', 7, 3),
('932794', 8, 5),
('932794', 9, 1),
('932794', 10, 2),
('932795', 1, 1),
('932795', 2, 4),
('932795', 3, 5),
('932795', 4, 3),
('932795', 5, 2),
('932795', 6, 5),
('932795', 7, 1),
('932795', 8, 4),
('932795', 9, 3),
('932795', 10, 2);



CREATE TABLE availability (
  id SMALLSERIAL PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  day VARCHAR(3) NOT NULL CHECK (day IN ('MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN')),
  start_hour SMALLINT NOT NULL CHECK (start_hour BETWEEN 0 AND 22),
  end_hour SMALLINT NOT NULL CHECK (end_hour BETWEEN 0 AND 23),
  FOREIGN KEY (user_id) REFERENCES student(id)
);

INSERT INTO availability (user_id, day, start_hour, end_hour) VALUES
('932756', 'MON', 9, 11),
('932756', 'TUE', 14, 16),
('932757', 'TUE', 13, 14),
('932757', 'WED', 10, 12),
('932758', 'WED', 9, 18),
('932758', 'THU', 15, 17),
('932759', 'WED', 9, 18),
('932759', 'THU', 16, 18),
('932759', 'FRI', 8, 10),
('932760', 'FRI', 12, 14),
('932760', 'MON', 10, 12),
('932761', 'MON', 14, 16),
('932761', 'TUE', 10, 11),
('932762', 'TUE', 12, 13),
('932762', 'THU', 15, 17),
('932763', 'WED', 18, 20),
('932763', 'FRI', 10, 11),
('932764', 'THU', 20, 22),
('932764', 'MON', 13, 15),
('932765', 'FRI', 11, 13),
('932765', 'TUE', 16, 18),
('932766', 'MON', 15, 17),
('932766', 'WED', 9, 12),
('932767', 'TUE', 9, 11),
('932767', 'THU', 14, 16),
('932768', 'WED', 11, 14),
('932768', 'FRI', 13, 15),
('932769', 'MON', 10, 12),
('932769', 'TUE', 16, 18),
('932770', 'TUE', 12, 14),
('932770', 'THU', 11, 13),
('932771', 'WED', 9, 11),
('932771', 'FRI', 15, 17),
('932772', 'THU', 14, 16),
('932772', 'MON', 10, 12),
('932773', 'FRI', 11, 13),
('932773', 'TUE', 13, 15),
('932774', 'MON', 16, 18),
('932774', 'WED', 9, 12),
('932775', 'TUE', 9, 11),
('932775', 'THU', 17, 19),
('932776', 'WED', 10, 14),
('932776', 'FRI', 11, 13),
('932777', 'MON', 9, 11),
('932777', 'TUE', 14, 17),
('932778', 'THU', 12, 14),
('932778', 'WED', 16, 18),
('932779', 'FRI', 13, 15),
('932779', 'MON', 11, 13),
('932780', 'TUE', 14, 16),
('932780', 'THU', 10, 12),
('932781', 'WED', 9, 11),
('932781', 'FRI', 10, 16),
('932782', 'THU', 11, 13),
('932782', 'MON', 15, 17),
('932783', 'FRI', 10, 12),
('932783', 'TUE', 16, 18),
('932784', 'MON', 13, 15),
('932784', 'WED', 9, 11),
('932785', 'TUE', 11, 13),
('932785', 'THU', 14, 16),
('932786', 'WED', 10, 12),
('932786', 'FRI', 15, 17),
('932787', 'THU', 13, 15),
('932787', 'MON', 10, 12),
('932788', 'FRI', 9, 11),
('932788', 'TUE', 15, 17),
('932789', 'MON', 14, 16),
('932789', 'WED', 11, 13),
('932790', 'TUE', 9, 11),
('932790', 'THU', 16, 18),
('932791', 'WED', 12, 14),
('932791', 'FRI', 10, 12),
('932792', 'MON', 11, 13),
('932792', 'TUE', 14, 16),
('932793', 'THU', 10, 12),
('932793', 'WED', 15, 17),
('932794', 'FRI', 8, 15),
('932794', 'MON', 9, 17),
('932795', 'TUE', 9, 14),
('932795', 'THU', 10, 17);


CREATE TYPE session_status AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED');
CREATE TABLE session (
  id SMALLSERIAL PRIMARY KEY,
  topic_id SMALLINT,
  start_hour SMALLINT NOT NULL,
  end_hour SMALLINT NOT NULL,
  date DATE NOT NULL,
  status session_status NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (topic_id) REFERENCES topic(topic_id)
);

-- For demo/test purposes
CREATE OR REPLACE FUNCTION next_wednesday() RETURNS DATE AS $$
BEGIN
  RETURN CURRENT_DATE + INTERVAL '1 day' * ((10 - EXTRACT(DOW FROM CURRENT_DATE)::SMALLINT) % 7);
END;
$$ LANGUAGE plpgsql;


INSERT INTO session (topic_id, start_hour, end_hour, date, status) VALUES
-- Jenny and Zack
(7, 10, 11, next_wednesday(), 'ACCEPTED'),
(2, 14, 15, next_wednesday(), 'ACCEPTED');
-- End of Jenny and Zack

CREATE TABLE student_session (
  session_id SMALLINT NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  rating SMALLINT CHECK (rating BETWEEN 1 AND 5),
  feedback TEXT,
  is_requester BOOLEAN NOT NULL,
  PRIMARY KEY (user_id, session_id),
  FOREIGN KEY (user_id) REFERENCES student(id),
  FOREIGN KEY (session_id) REFERENCES session(id)
);

INSERT INTO student_session (session_id, user_id, is_requester) VALUES
-- Jenny and Zack
(1, '932758', TRUE),
(1, '932759', FALSE),
(2, '932759', TRUE),
(2, '932758', FALSE);
-- End of Jenny and Zack

CREATE VIEW user_availability_confidence AS
SELECT s.*, c1.department_id,
       av.availability AS availability_slots,
       tp.topics AS confidence,
       bk.bookings
FROM student s
JOIN course c1 ON s.course_code = c1.course_code
LEFT JOIN (
    SELECT user_id, array_agg(json_build_object('day', day, 'start_hour', start_hour, 'end_hour', end_hour)) as availability
    FROM availability
    GROUP BY user_id
) av ON s.id = av.user_id
LEFT JOIN (
    SELECT sc.user_id, array_agg(json_build_object('topic_id', t.topic_id, 'topic_name', t.topic_name, 'confidence_value', sc.confidence_value)) as topics
    FROM student_confidence sc
    JOIN topic t ON sc.topic_id = t.topic_id
    GROUP BY sc.user_id
) tp ON s.id = tp.user_id
LEFT JOIN (
    SELECT ss.user_id, array_agg(json_build_object('start_hour', s.start_hour, 'end_hour', s.end_hour, 'date', s.date, 'status', s.status, 'session_id', s.id, 'requester_id', u.id, 'email', u.email, 'given_name', u.given_name, 'family_name', u.family_name, 'picture', u.picture, 'course_code', c.course_code, 'course_name', c.name, 'topic_name', t.topic_name, 'partner_confidence', sc.confidence_value)) as bookings
    FROM session s
    INNER JOIN topic t ON s.topic_id = t.topic_id
    INNER JOIN student_session ss ON s.id = ss.session_id
    INNER JOIN student_session ss_other ON s.id = ss_other.session_id AND ss_other.user_id != ss.user_id
    INNER JOIN student u ON ss_other.user_id = u.id
    INNER JOIN course c ON u.course_code = c.course_code
    LEFT JOIN student_confidence sc ON sc.user_id = u.id AND sc.topic_id = t.topic_id
    WHERE s.status = 'ACCEPTED'
    GROUP BY ss.user_id
) bk ON s.id = bk.user_id;

--- Jaccard Similarity
CREATE OR REPLACE FUNCTION find_similar_users(p_user_id VARCHAR, p_threshold FLOAT)
RETURNS TABLE(user_id_1 VARCHAR, user_id_2 VARCHAR, similarity FLOAT) AS $$
BEGIN
  RETURN QUERY
  WITH user_confidences AS (
    SELECT user_id, topic_id, confidence_value
    FROM student_confidence
  ),
  user_intersections AS (
    SELECT u1.user_id AS user_id_1, u2.user_id AS user_id_2, COUNT(*) AS intersection_count
    FROM user_confidences u1
    JOIN user_confidences u2 ON u1.user_id <> u2.user_id AND u1.topic_id = u2.topic_id AND u1.confidence_value = u2.confidence_value
    WHERE u1.user_id = p_user_id
    GROUP BY u1.user_id, u2.user_id
  ),
  total_topics AS (
    SELECT COUNT(DISTINCT topic_id) AS topic_count
    FROM student_confidence
  ),
  similarities AS (
    SELECT ui.user_id_1, ui.user_id_2, ui.intersection_count::float / total_topics.topic_count::float AS similarity
    FROM user_intersections AS ui, total_topics
  )
  SELECT s.user_id_1, s.user_id_2, s.similarity
  FROM similarities AS s
  WHERE s.similarity >= p_threshold
  ORDER BY s.similarity DESC;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION get_similar_users(p_user_id VARCHAR, p_threshold FLOAT)
RETURNS TABLE(id VARCHAR, email VARCHAR, given_name VARCHAR, family_name VARCHAR, picture VARCHAR, course_code VARCHAR, year SMALLINT, department_id SMALLINT, availability_slots JSON[], confidence JSON[], bookings JSON[], similarity FLOAT) AS $$
BEGIN
  RETURN QUERY
  SELECT uac.id, uac.email, uac.given_name, uac.family_name, uac.picture, uac.course_code, uac.year, uac.department_id::SMALLINT, uac.availability_slots, uac.confidence, uac.bookings, fsu.similarity
  FROM user_availability_confidence uac
  JOIN find_similar_users(p_user_id, p_threshold) fsu ON uac.id = fsu.user_id_2
  ORDER BY fsu.similarity DESC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_confident_users(p_user_id VARCHAR, p_topic_id SMALLINT)
RETURNS TABLE(id VARCHAR, email VARCHAR, given_name VARCHAR, family_name VARCHAR, picture VARCHAR, course_code VARCHAR, year SMALLINT, department_id SMALLINT, availability_slots JSON[], confidence JSON[], bookings JSON[], topic_confidence_value SMALLINT) AS $$
BEGIN
  RETURN QUERY
  WITH user_confidence AS (
    SELECT user_id, confidence_value
    FROM student_confidence
    WHERE user_id = p_user_id AND topic_id = p_topic_id
  ),
  confident_users AS (
    SELECT uac.*, sc.confidence_value AS topic_confidence_value
    FROM user_availability_confidence uac
    JOIN student_confidence sc ON uac.id = sc.user_id AND sc.topic_id = p_topic_id
    CROSS JOIN user_confidence uc
    WHERE sc.confidence_value >= uc.confidence_value
  )
  SELECT cu.id, cu.email, cu.given_name, cu.family_name, cu.picture, cu.course_code, cu.year, cu.department_id::SMALLINT, cu.availability_slots, cu.confidence, cu.bookings, cu.topic_confidence_value
  FROM confident_users cu;
END;
$$ LANGUAGE plpgsql;
