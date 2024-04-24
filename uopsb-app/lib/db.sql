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
('032756', 'up032756@myport.ac.uk', 'John', 'Doe', 'https://randomuser.me/api/portraits/men/0.jpg', 'U0056PYC', 1), 
('032757', 'up032757@myport.ac.uk', 'Kate', 'Doe', 'https://randomuser.me/api/portraits/women/0.jpg', 'U0056PYC', 1), 
('032758', 'up032758@myport.ac.uk', 'Zack', 'Smith', 'https://randomuser.me/api/portraits/men/1.jpg', 'U0968PYC', 3),
('032759', 'up032759@myport.ac.uk', 'Jenny', 'Smith', 'https://randomuser.me/api/portraits/women/2.jpg', 'U0968PYC', 3),
('032760', 'up032760@myport.ac.uk', 'Tom', 'Brown', 'https://randomuser.me/api/portraits/men/3.jpg', 'U0056PYC', 2),
('032761', 'up032761@myport.ac.uk', 'Emma', 'Taylor', 'https://randomuser.me/api/portraits/women/3.jpg', 'P3439FTC', 1),
('032762', 'up032762@myport.ac.uk', 'Mark', 'Jones', 'https://randomuser.me/api/portraits/men/4.jpg', 'U2365PYC', 2),
('032763', 'up032763@myport.ac.uk', 'Lucy', 'White', 'https://randomuser.me/api/portraits/women/4.jpg', 'U2515PYC', 4),
('032764', 'up032764@myport.ac.uk', 'Liam', 'Harris', 'https://randomuser.me/api/portraits/men/5.jpg', 'U0580PYC', 1),
('032765', 'up032765@myport.ac.uk', 'Sophie', 'Walker', 'https://randomuser.me/api/portraits/women/5.jpg', 'U2753PYC', 3),
('032766', 'up032766@myport.ac.uk', 'Nathan', 'Patel', 'https://randomuser.me/api/portraits/men/6.jpg', 'C3559FTC', 1),
('032767', 'up032767@myport.ac.uk', 'Alice', 'Young', 'https://randomuser.me/api/portraits/women/6.jpg', 'U2365PYC', 1),
('032768', 'up032768@myport.ac.uk', 'David', 'Thompson', 'https://randomuser.me/api/portraits/men/7.jpg', 'U0056PYC', 2),
('032769', 'up032769@myport.ac.uk', 'Claire', 'Martin', 'https://randomuser.me/api/portraits/women/7.jpg', 'U2515PYC', 4),
('032770', 'up032770@myport.ac.uk', 'Evan', 'Murphy', 'https://randomuser.me/api/portraits/men/8.jpg', 'C3559FTC', 1),
('032771', 'up032771@myport.ac.uk', 'Isla', 'Green', 'https://randomuser.me/api/portraits/women/8.jpg', 'U0968PYC', 1),
('032772', 'up032772@myport.ac.uk', 'Sam', 'Alexander', 'https://randomuser.me/api/portraits/men/9.jpg', 'U0968PYC', 2),
('032773', 'up032773@myport.ac.uk', 'Ava', 'Adams', 'https://randomuser.me/api/portraits/women/9.jpg', 'U0968PYC', 3),
('032774', 'up032774@myport.ac.uk', 'Leon', 'Turner', 'https://randomuser.me/api/portraits/men/10.jpg', 'U0968PYC', 4),
('032775', 'up032775@myport.ac.uk', 'Mila', 'Gibson', 'https://randomuser.me/api/portraits/women/10.jpg', 'U0968PYC', 2),
('032776', 'up032776@myport.ac.uk', 'Aaron', 'Spencer', 'https://randomuser.me/api/portraits/men/11.jpg', 'U0968PYC', 1),
('032777', 'up032777@myport.ac.uk', 'Leah', 'Mason', 'https://randomuser.me/api/portraits/women/11.jpg', 'U0968PYC', 3),
('032778', 'up032778@myport.ac.uk', 'Harry', 'Parker', 'https://randomuser.me/api/portraits/men/12.jpg', 'U0968PYC', 4),
('032779', 'up032779@myport.ac.uk', 'Amelia', 'Long', 'https://randomuser.me/api/portraits/women/12.jpg', 'U0968PYC', 1),
('032780', 'up032780@myport.ac.uk', 'Louis', 'Baker', 'https://randomuser.me/api/portraits/men/13.jpg', 'U0968PYC', 2),
('032781', 'up032781@myport.ac.uk', 'Olivia', 'Smith', 'https://randomuser.me/api/portraits/women/13.jpg', 'P3439FTC', 3),
('032782', 'up032782@myport.ac.uk', 'George', 'Johnson', 'https://randomuser.me/api/portraits/men/14.jpg', 'U2365PYC', 2),
('032783', 'up032783@myport.ac.uk', 'Sophia', 'Williams', 'https://randomuser.me/api/portraits/women/14.jpg', 'U0056PYC', 4),
('032784', 'up032784@myport.ac.uk', 'Jack', 'Brown', 'https://randomuser.me/api/portraits/men/15.jpg', 'U2515PYC', 1),
('032785', 'up032785@myport.ac.uk', 'Lily', 'Jones', 'https://randomuser.me/api/portraits/women/15.jpg', 'U0580PYC', 3),
('032786', 'up032786@myport.ac.uk', 'Ethan', 'Davis', 'https://randomuser.me/api/portraits/men/16.jpg', 'U2753PYC', 1),
('032787', 'up032787@myport.ac.uk', 'Grace', 'Miller', 'https://randomuser.me/api/portraits/women/16.jpg', 'C3559FTC', 4),
('032788', 'up032788@myport.ac.uk', 'Noah', 'Wilson', 'https://randomuser.me/api/portraits/men/17.jpg', 'U0968PYC', 3),
('032789', 'up032789@myport.ac.uk', 'Ava', 'Moore', 'https://randomuser.me/api/portraits/women/17.jpg', 'P3439FTC', 2),
('032790', 'up032790@myport.ac.uk', 'Leo', 'Taylor', 'https://randomuser.me/api/portraits/men/18.jpg', 'U2365PYC', 1),
('032791', 'up032791@myport.ac.uk', 'Mia', 'Anderson', 'https://randomuser.me/api/portraits/women/18.jpg', 'U0056PYC', 4),
('032792', 'up032792@myport.ac.uk', 'Charlie', 'Thomas', 'https://randomuser.me/api/portraits/men/19.jpg', 'U2515PYC', 3),
('032793', 'up032793@myport.ac.uk', 'Isla', 'Jackson', 'https://randomuser.me/api/portraits/women/19.jpg', 'U0580PYC', 2),
('032794', 'up032794@myport.ac.uk', 'Oliver', 'White', 'https://randomuser.me/api/portraits/men/20.jpg', 'U2753PYC', 1),
('032795', 'up032795@myport.ac.uk', 'Sophie', 'Harris', 'https://randomuser.me/api/portraits/women/20.jpg', 'C3559FTC', 4);

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
('032756', 1, 5),
('032756', 2, 4),
('032756', 3, 3),
('032756', 4, 2),
('032756', 5, 1),
('032756', 6, 5),
('032756', 7, 4),
('032756', 8, 3),
('032756', 9, 2),
('032756', 10, 1),
('032757', 1, 5),
('032757', 2, 4),
('032757', 3, 3),
('032757', 4, 2),
('032757', 5, 1),
('032757', 6, 5),
('032757', 7, 4),
('032757', 8, 3),
('032757', 9, 2),
('032757', 10, 1),
('032758', 1, 5),
('032758', 2, 4),
('032758', 3, 3),
('032758', 4, 2),
('032758', 5, 1),
('032758', 6, 5),
('032758', 7, 4),
('032758', 8, 3),
('032758', 9, 2),
('032758', 10, 1),
('032759', 1, 5),
('032759', 2, 4),
('032759', 3, 3),
('032759', 4, 2),
('032759', 5, 1),
('032759', 6, 5),
('032759', 7, 4),
('032759', 8, 3),
('032759', 9, 2),
('032759', 10, 1),
('032760', 1, 5),
('032760', 2, 4),
('032760', 3, 3),
('032760', 4, 2),
('032760', 5, 1),
('032760', 6, 5),
('032760', 7, 4),
('032760', 8, 3),
('032760', 9, 2),
('032760', 10, 1),
('032761', 1, 5),
('032761', 2, 4),
('032761', 3, 3),
('032761', 4, 2),
('032761', 5, 1),
('032761', 6, 5),
('032761', 7, 4),
('032761', 8, 3),
('032761', 9, 2),
('032761', 10, 1),
('032762', 1, 5),
('032762', 2, 4),
('032762', 3, 3),
('032762', 4, 2),
('032762', 5, 1),
('032762', 6, 5),
('032762', 7, 4),
('032762', 8, 3),
('032762', 9, 2),
('032762', 10, 1),
('032763', 1, 5),
('032763', 2, 4),
('032763', 3, 3),
('032763', 4, 2),
('032763', 5, 1),
('032763', 6, 5),
('032763', 7, 4),
('032763', 8, 3),
('032763', 9, 2),
('032763', 10, 1),
('032764', 1, 5),
('032764', 2, 4),
('032764', 3, 3),
('032764', 4, 2),
('032764', 5, 1),
('032764', 6, 5),
('032764', 7, 4),
('032764', 8, 3),
('032764', 9, 2),
('032764', 10, 1),
('032765', 1, 5),
('032765', 2, 4),
('032765', 3, 3),
('032765', 4, 2),
('032765', 5, 1),
('032765', 6, 5),
('032765', 7, 4),
('032765', 8, 3),
('032765', 9, 2),
('032765', 10, 1),
('032766', 1, 5),
('032766', 2, 4),
('032766', 3, 3),
('032766', 4, 2),
('032766', 5, 1),
('032766', 6, 5),
('032766', 7, 4),
('032766', 8, 3),
('032766', 9, 2),
('032766', 10, 1),
('032767', 1, 5),
('032767', 2, 4),
('032767', 3, 3),
('032767', 4, 2),
('032767', 5, 1),
('032767', 6, 5),
('032767', 7, 4),
('032767', 8, 3),
('032767', 9, 2),
('032767', 10, 1),
('032768', 1, 1),
('032768', 2, 4),
('032768', 3, 3),
('032768', 4, 2),
('032768', 5, 1),
('032768', 6, 5),
('032768', 7, 4),
('032768', 8, 3),
('032768', 9, 2),
('032768', 10, 1),
('032769', 1, 5),
('032769', 2, 4),
('032769', 3, 3),
('032769', 4, 2),
('032769', 5, 1),
('032769', 6, 5),
('032769', 7, 4),
('032769', 8, 3),
('032769', 9, 2),
('032769', 10, 1),
('032770', 1, 2),
('032770', 2, 4),
('032770', 3, 3),
('032770', 4, 4),
('032770', 5, 1),
('032770', 6, 5),
('032770', 7, 4),
('032770', 8, 3),
('032770', 9, 2),
('032770', 10, 3),
('032771', 1, 3),
('032771', 2, 5),
('032771', 3, 1),
('032771', 4, 4),
('032771', 5, 2),
('032771', 6, 5),
('032771', 7, 3),
('032771', 8, 1),
('032771', 9, 4),
('032771', 10, 2),
('032772', 1, 4),
('032772', 2, 1),
('032772', 3, 5),
('032772', 4, 2),
('032772', 5, 3),
('032772', 6, 1),
('032772', 7, 4),
('032772', 8, 5),
('032772', 9, 2),
('032772', 10, 3),
('032773', 1, 2),
('032773', 2, 4),
('032773', 3, 1),
('032773', 4, 5),
('032773', 5, 3),
('032773', 6, 2),
('032773', 7, 1),
('032773', 8, 4),
('032773', 9, 5),
('032773', 10, 3),
('032774', 1, 5),
('032774', 2, 3),
('032774', 3, 1),
('032774', 4, 4),
('032774', 5, 2),
('032774', 6, 1),
('032774', 7, 5),
('032774', 8, 3),
('032774', 9, 2),
('032774', 10, 4),
('032775', 1, 3),
('032775', 2, 5),
('032775', 3, 4),
('032775', 4, 1),
('032775', 5, 2),
('032775', 6, 4),
('032775', 7, 3),
('032775', 8, 5),
('032775', 9, 1),
('032775', 10, 2),
('032776', 1, 2),
('032776', 2, 4),
('032776', 3, 5),
('032776', 4, 1),
('032776', 5, 3),
('032776', 6, 5),
('032776', 7, 2),
('032776', 8, 4),
('032776', 9, 1),
('032776', 10, 3),
('032777', 1, 5),
('032777', 2, 3),
('032777', 3, 2),
('032777', 4, 4),
('032777', 5, 1),
('032777', 6, 3),
('032777', 7, 5),
('032777', 8, 1),
('032777', 9, 4),
('032777', 10, 2),
('032778', 1, 3),
('032778', 2, 1),
('032778', 3, 4),
('032778', 4, 5),
('032778', 5, 2),
('032778', 6, 4),
('032778', 7, 3),
('032778', 8, 1),
('032778', 9, 5),
('032778', 10, 2),
('032779', 1, 4),
('032779', 2, 5),
('032779', 3, 3),
('032779', 4, 1),
('032779', 5, 2),
('032779', 6, 1),
('032779', 7, 4),
('032779', 8, 5),
('032779', 9, 3),
('032779', 10, 2),
('032780', 1, 1),
('032780', 2, 3),
('032780', 3, 5),
('032780', 4, 4),
('032780', 5, 2),
('032780', 6, 5),
('032780', 7, 1),
('032780', 8, 3),
('032780', 9, 4),
('032780', 10, 2),
('032781', 1, 2),
('032781', 2, 4),
('032781', 3, 1),
('032781', 4, 5),
('032781', 5, 3),
('032781', 6, 1),
('032781', 7, 2),
('032781', 8, 4),
('032781', 9, 5),
('032781', 10, 3),
('032782', 1, 4),
('032782', 2, 1),
('032782', 3, 3),
('032782', 4, 2),
('032782', 5, 5),
('032782', 6, 3),
('032782', 7, 4),
('032782', 8, 1),
('032782', 9, 2),
('032782', 10, 4),
('032783', 1, 5),
('032783', 2, 3),
('032783', 3, 1),
('032783', 4, 2),
('032783', 5, 4),
('032783', 6, 1),
('032783', 7, 5),
('032783', 8, 3),
('032783', 9, 2),
('032783', 10, 4),
('032784', 1, 3),
('032784', 2, 5),
('032784', 3, 4),
('032784', 4, 1),
('032784', 5, 2),
('032784', 6, 4),
('032784', 7, 3),
('032784', 8, 5),
('032784', 9, 1),
('032784', 10, 2),
('032785', 1, 1),
('032785', 2, 4),
('032785', 3, 5),
('032785', 4, 3),
('032785', 5, 2),
('032785', 6, 5),
('032785', 7, 1),
('032785', 8, 4),
('032785', 9, 3),
('032785', 10, 2),
('032786', 1, 2),
('032786', 2, 1),
('032786', 3, 4),
('032786', 4, 5),
('032786', 5, 3),
('032786', 6, 4),
('032786', 7, 2),
('032786', 8, 1),
('032786', 9, 5),
('032786', 10, 3),
('032787', 1, 5),
('032787', 2, 3),
('032787', 3, 2),
('032787', 4, 4),
('032787', 5, 1),
('032787', 6, 3),
('032787', 7, 5),
('032787', 8, 1),
('032787', 9, 4),
('032787', 10, 2),
('032788', 1, 3),
('032788', 2, 1),
('032788', 3, 5),
('032788', 4, 2),
('032788', 5, 4),
('032788', 6, 1),
('032788', 7, 3),
('032788', 8, 5),
('032788', 9, 2),
('032788', 10, 4),
('032789', 1, 4),
('032789', 2, 5),
('032789', 3, 1),
('032789', 4, 3),
('032789', 5, 2),
('032789', 6, 2),
('032789', 7, 4),
('032789', 8, 5),
('032789', 9, 1),
('032789', 10, 3),
('032790', 1, 1),
('032790', 2, 3),
('032790', 3, 5),
('032790', 4, 4),
('032790', 5, 2),
('032790', 6, 5),
('032790', 7, 1),
('032790', 8, 3),
('032790', 9, 4),
('032790', 10, 2),
('032791', 1, 2),
('032791', 2, 4),
('032791', 3, 1),
('032791', 4, 5),
('032791', 5, 3),
('032791', 6, 1),
('032791', 7, 2),
('032791', 8, 4),
('032791', 9, 5),
('032791', 10, 3),
('032792', 1, 4),
('032792', 2, 1),
('032792', 3, 3),
('032792', 4, 2),
('032792', 5, 5),
('032792', 6, 3),
('032792', 7, 4),
('032792', 8, 1),
('032792', 9, 2),
('032792', 10, 4),
('032793', 1, 5),
('032793', 2, 3),
('032793', 3, 1),
('032793', 4, 2),
('032793', 5, 4),
('032793', 6, 1),
('032793', 7, 5),
('032793', 8, 3),
('032793', 9, 2),
('032793', 10, 4),
('032794', 1, 3),
('032794', 2, 5),
('032794', 3, 4),
('032794', 4, 1),
('032794', 5, 2),
('032794', 6, 4),
('032794', 7, 3),
('032794', 8, 5),
('032794', 9, 1),
('032794', 10, 2),
('032795', 1, 1),
('032795', 2, 4),
('032795', 3, 5),
('032795', 4, 3),
('032795', 5, 2),
('032795', 6, 5),
('032795', 7, 1),
('032795', 8, 4),
('032795', 9, 3),
('032795', 10, 2);



CREATE TABLE availability (
  id SMALLSERIAL PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  day VARCHAR(3) NOT NULL CHECK (day IN ('MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN')),
  start_hour SMALLINT NOT NULL CHECK (start_hour BETWEEN 0 AND 22),
  end_hour SMALLINT NOT NULL CHECK (end_hour BETWEEN 0 AND 23),
  FOREIGN KEY (user_id) REFERENCES student(id)
);

INSERT INTO availability (user_id, day, start_hour, end_hour) VALUES
('032756', 'MON', 9, 11),
('032756', 'TUE', 14, 16),
('032757', 'TUE', 13, 14),
('032757', 'WED', 10, 12),
('032758', 'WED', 9, 18),
('032758', 'THU', 15, 17),
('032759', 'WED', 9, 18),
('032759', 'THU', 16, 18),
('032759', 'FRI', 8, 10),
('032760', 'FRI', 12, 14),
('032760', 'MON', 10, 12),
('032761', 'MON', 14, 16),
('032761', 'TUE', 10, 11),
('032762', 'TUE', 12, 13),
('032762', 'THU', 15, 17),
('032763', 'WED', 18, 20),
('032763', 'FRI', 10, 11),
('032764', 'THU', 20, 22),
('032764', 'MON', 13, 15),
('032765', 'FRI', 11, 13),
('032765', 'TUE', 16, 18),
('032766', 'MON', 15, 17),
('032766', 'WED', 9, 12),
('032767', 'TUE', 9, 11),
('032767', 'THU', 14, 16),
('032768', 'WED', 11, 14),
('032768', 'FRI', 13, 15),
('032769', 'MON', 10, 12),
('032769', 'TUE', 16, 18),
('032770', 'TUE', 12, 14),
('032770', 'THU', 11, 13),
('032771', 'WED', 9, 11),
('032771', 'FRI', 15, 17),
('032772', 'THU', 14, 16),
('032772', 'MON', 10, 12),
('032773', 'FRI', 11, 13),
('032773', 'TUE', 13, 15),
('032774', 'MON', 16, 18),
('032774', 'WED', 9, 12),
('032775', 'TUE', 9, 11),
('032775', 'THU', 17, 19),
('032776', 'WED', 10, 14),
('032776', 'FRI', 11, 13),
('032777', 'MON', 9, 11),
('032777', 'TUE', 14, 17),
('032778', 'THU', 12, 14),
('032778', 'WED', 16, 18),
('032779', 'FRI', 13, 15),
('032779', 'MON', 11, 13),
('032780', 'TUE', 14, 16),
('032780', 'THU', 10, 12),
('032781', 'WED', 9, 11),
('032781', 'FRI', 10, 16),
('032782', 'THU', 11, 13),
('032782', 'MON', 15, 17),
('032783', 'FRI', 10, 12),
('032783', 'TUE', 16, 18),
('032784', 'MON', 13, 15),
('032784', 'WED', 9, 11),
('032785', 'TUE', 11, 13),
('032785', 'THU', 14, 16),
('032786', 'WED', 10, 12),
('032786', 'FRI', 15, 17),
('032787', 'THU', 13, 15),
('032787', 'MON', 10, 12),
('032788', 'FRI', 9, 11),
('032788', 'TUE', 15, 17),
('032789', 'MON', 14, 16),
('032789', 'WED', 11, 13),
('032790', 'TUE', 9, 11),
('032790', 'THU', 16, 18),
('032791', 'WED', 12, 14),
('032791', 'FRI', 10, 12),
('032792', 'MON', 11, 13),
('032792', 'TUE', 14, 16),
('032793', 'THU', 10, 12),
('032793', 'WED', 15, 17),
('032794', 'FRI', 8, 15),
('032794', 'MON', 9, 17),
('032795', 'TUE', 9, 14),
('032795', 'THU', 10, 17);


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

CREATE OR REPLACE FUNCTION update_session_status_to_completed()
RETURNS TRIGGER AS $$
BEGIN
  IF (NEW.date < CURRENT_DATE OR (NEW.date = CURRENT_DATE AND NEW.end_hour < EXTRACT(HOUR FROM CURRENT_TIME))) THEN
    NEW.status := 'COMPLETED';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql; 

CREATE TRIGGER check_session_status
BEFORE INSERT OR UPDATE ON session
FOR EACH ROW
EXECUTE FUNCTION update_session_status_to_completed();

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
(1, '032758', TRUE),
(1, '032759', FALSE),
(2, '032759', TRUE),
(2, '032758', FALSE);
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
