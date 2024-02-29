/*
 * This SQL file is used to create and populate tables for the application.
 * It should be uploaded to the Azure PostgreSQL database for the application (best done by using the Azure Commandline Interface).
 * 
 * Note: The drop_all_tables() function is intended for development stage only
 * and should not be used in a production environment.
 */

CREATE OR REPLACE FUNCTION drop_all_tables() RETURNS VOID AS $$
DECLARE
    table_name RECORD;
BEGIN
    FOR table_name IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS "' || table_name.tablename || '" CASCADE';
    END LOOP;
END;
$$ LANGUAGE plpgsql;

SELECT drop_all_tables();

CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

INSERT INTO department (name) VALUES
('School of Computing'),
('School of Energy and Electronic Engineering');


CREATE TABLE topic (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(id)
);

--School of Computing
INSERT INTO topic (name, department_id) VALUES
('Data Structures and Algorithms', (SELECT id FROM department WHERE name = 'School of Computing')),
('Architecture and Operating Systems', (SELECT id FROM department WHERE name = 'School of Computing')),
('Artificial Intelligence', (SELECT id FROM department WHERE name = 'School of Computing')),
('Machine Learning and Deep Learning', (SELECT id FROM department WHERE name = 'School of Computing')),
('Computer Networks and Protocols', (SELECT id FROM department WHERE name = 'School of Computing')),
('Cybersecurity and Cryptography', (SELECT id FROM department WHERE name = 'School of Computing')),
('Software Engineering and Design Patterns', (SELECT id FROM department WHERE name = 'School of Computing')),
('Web Development and Full Stack Development', (SELECT id FROM department WHERE name = 'School of Computing')),
('Mobile Application Development', (SELECT id FROM department WHERE name = 'School of Computing')),
('Cloud Computing and Distributed Systems', (SELECT id FROM department WHERE name = 'School of Computing')),
('Database Management Systems and Big Data', (SELECT id FROM department WHERE name = 'School of Computing'));

--School of Energy and Electronic Engineering
INSERT INTO topic (name, department_id) VALUES
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

CREATE TABLE course (
    course_code VARCHAR(12) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(id)
);
--School of Computing
INSERT INTO course (course_code, name, department_id) VALUES
('P3439FTC', 'Artificial Intelligence and Machine Learning (MSc)', (SELECT id FROM department WHERE name = 'School of Computing')),
('U2365PYC', 'Computer Networks', (SELECT id FROM department WHERE name = 'School of Computing')),
('U0056PYC', 'Computer Science (BSc)', (SELECT id FROM department WHERE name = 'School of Computing')),
('U2515PYC', 'Computer Science (MEng)', (SELECT id FROM department WHERE name = 'School of Computing')),
('U0580PYC', 'Computing', (SELECT id FROM department WHERE name = 'School of Computing')),
('U2753PYC', 'Cyber Security and Forensic Computing', (SELECT id FROM department WHERE name = 'School of Computing')),
('C3559FTC', 'Data Science and Analytics', (SELECT id FROM department WHERE name = 'School of Computing')),
('U0968PYC', 'Software Engineering', (SELECT id FROM department WHERE name = 'School of Computing'));

--School of Energy and Electronic Engineering
INSERT INTO course (course_code, name, department_id) VALUES
('U2194PYC', 'Engineering and Technology (BEng)', (SELECT id FROM department WHERE name = 'School of Energy and Electronic Engineering')),
('U2174PYC', 'Electronic Engineering (BEng)', (SELECT id FROM department WHERE name = 'School of Energy and Electronic Engineering'));

CREATE TABLE student (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  given_name VARCHAR(255) NOT NULL,
  family_name VARCHAR(255) NOT NULL,
  picture VARCHAR(255),
  course_code VARCHAR(12) NOT NULL,
  gender TEXT CHECK( gender IN ('Male', 'Female', 'Other', 'Prefer not to say') ) NOT NULL,
  year INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (course_code) REFERENCES course(course_code)
);

INSERT INTO student (id, email, given_name, family_name, picture, course_code, gender, year) 
VALUES 
('932756', 'up932756@myport.ac.uk', 'John', 'Doe', 'https://randomuser.me/api/portraits/men/0.jpg', 'U0056PYC', 'Male', 1), 
('932757', 'up932757@myport.ac.uk', 'Kate', 'Doe', 'https://randomuser.me/api/portraits/women/0.jpg', 'U0056PYC', 'Female', 1), 
('932758', 'up932758@myport.ac.uk', 'Zack', 'Smith', 'https://randomuser.me/api/portraits/men/1.jpg', 'U0968PYC', 'Male', 3),
('932759', 'up932759@myport.ac.uk', 'Jenny', 'Smith', 'https://randomuser.me/api/portraits/women/2.jpg', 'U0968PYC', 'Female', 3),
('932760', 'up932760@myport.ac.uk', 'Tom', 'Brown', 'https://randomuser.me/api/portraits/men/3.jpg', 'U0056PYC', 'Male', 2), 
('932761', 'up932761@myport.ac.uk', 'Emma', 'Taylor', 'https://randomuser.me/api/portraits/women/3.jpg', 'P3439FTC', 'Female', 1),
('932762', 'up932762@myport.ac.uk', 'Mark', 'Jones', 'https://randomuser.me/api/portraits/men/4.jpg', 'U2365PYC', 'Male', 2),
('932763', 'up932763@myport.ac.uk', 'Lucy', 'White', 'https://randomuser.me/api/portraits/women/4.jpg', 'U2515PYC', 'Female', 4),
('932764', 'up932764@myport.ac.uk', 'Liam', 'Harris', 'https://randomuser.me/api/portraits/men/5.jpg', 'U0580PYC', 'Male', 1),
('932765', 'up932765@myport.ac.uk', 'Sophie', 'Walker', 'https://randomuser.me/api/portraits/women/5.jpg', 'U2753PYC', 'Female', 3),
('932766', 'up932766@myport.ac.uk', 'Nathan', 'Patel', 'https://randomuser.me/api/portraits/men/6.jpg', 'C3559FTC', 'Male', 1),
('932767', 'up932767@myport.ac.uk', 'Alice', 'Young', 'https://randomuser.me/api/portraits/women/6.jpg', 'U2365PYC', 'Female', 1),
('932768', 'up932768@myport.ac.uk', 'David', 'Thompson', 'https://randomuser.me/api/portraits/men/7.jpg', 'U0056PYC', 'Male', 2),
('932769', 'up932769@myport.ac.uk', 'Claire', 'Martin', 'https://randomuser.me/api/portraits/women/7.jpg', 'U2515PYC', 'Female', 4),
('932770', 'up932770@myport.ac.uk', 'Evan', 'Murphy', 'https://randomuser.me/api/portraits/men/8.jpg', 'C3559FTC', 'Male', 1),
('932771', 'up932771@myport.ac.uk', 'Isla', 'Green', 'https://randomuser.me/api/portraits/women/8.jpg', 'U0968PYC', 'Female', 1),
('932772', 'up932772@myport.ac.uk', 'Sam', 'Alexander', 'https://randomuser.me/api/portraits/men/9.jpg', 'U0968PYC', 'Male', 2),
('932773', 'up932773@myport.ac.uk', 'Ava', 'Adams', 'https://randomuser.me/api/portraits/women/9.jpg', 'U0968PYC', 'Female', 3),
('932774', 'up932774@myport.ac.uk', 'Leon', 'Turner', 'https://randomuser.me/api/portraits/men/10.jpg', 'U0968PYC', 'Male', 4),
('932775', 'up932775@myport.ac.uk', 'Mila', 'Gibson', 'https://randomuser.me/api/portraits/women/10.jpg', 'U0968PYC', 'Female', 2),
('932776', 'up932776@myport.ac.uk', 'Aaron', 'Spencer', 'https://randomuser.me/api/portraits/men/11.jpg', 'U0968PYC', 'Male', 1),
('932777', 'up932777@myport.ac.uk', 'Leah', 'Mason', 'https://randomuser.me/api/portraits/women/11.jpg', 'U0968PYC', 'Female', 3),
('932778', 'up932778@myport.ac.uk', 'Harry', 'Parker', 'https://randomuser.me/api/portraits/men/12.jpg', 'U0968PYC', 'Male', 4),
('932779', 'up932779@myport.ac.uk', 'Amelia', 'Long', 'https://randomuser.me/api/portraits/women/12.jpg', 'U0968PYC', 'Female', 1),
('932780', 'up932780@myport.ac.uk', 'Louis', 'Baker', 'https://randomuser.me/api/portraits/men/13.jpg', 'U0968PYC', 'Male', 2);

CREATE TABLE student_confidence (
  user_id VARCHAR(36) NOT NULL,
  topic_id INTEGER NOT NULL,
  confidence_value INTEGER NOT NULL CHECK (confidence_value BETWEEN 1 AND 5),
  PRIMARY KEY (user_id, topic_id),
  FOREIGN KEY (user_id) REFERENCES student(id),
  FOREIGN KEY (topic_id) REFERENCES topic(id)
);

CREATE TABLE slot (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  day VARCHAR(3) NOT NULL CHECK (day IN ('MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN')),
  start_hour INTEGER NOT NULL,
  end_hour INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES student(id)
);

INSERT INTO slot (user_id, day, start_hour, end_hour) VALUES
('932756', 'MON', 9, 11),
('932756', 'TUE', 14, 16),
('932757', 'TUE', 13, 14),
('932757', 'WED', 10, 12),
('932758', 'WED', 11, 13),
('932758', 'THU', 15, 17),
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
('932780', 'THU', 10, 12);