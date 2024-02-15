CREATE TABLE IF NOT EXISTS course (
    code VARCHAR(12) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    department VARCHAR(50) NOT NULL
);

INSERT OR IGNORE INTO course (code, name, department) VALUES
('P3439FTC', 'Artificial Intelligence and Machine Learning (MSc)', 'Computer Science'),
('U2365PYC', 'Computer Networks', 'Computer Science'),
('U0056PYC', 'Computer Science (BSc)', 'Computer Science'),
('U2515PYC', 'Computer Science (MEng)', 'Computer Science'),
('U0580PYC', 'Computing', 'Computer Science'),
('U2753PYC', 'Cyber Security and Forensic Computing', 'Computer Science'),
('C3559FTC', 'Data Science and Analytics', 'Computer Science'),
('U0968PYC', 'Software Engineering', 'School of Computing');


CREATE TABLE IF NOT EXISTS student (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  given_name VARCHAR(255) NOT NULL,
  family_name VARCHAR(255) NOT NULL,
  picture VARCHAR(255),
  course_code VARCHAR(12) NOT NULL,
  gender TEXT CHECK( gender IN ('Male', 'Female', 'Other', 'Prefer not to say') ) NOT NULL, -- enum psql
  year INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (course_code) REFERENCES course(code)
);


INSERT OR IGNORE INTO student 
    (id, email, given_name, family_name, picture, course_code, gender, year) 
VALUES
    ('932756', 'up932756@myport.ac.uk', 'John', 'Doe', 'https://randomuser.me/api/portraits/men/0.jpg', 'U0056PYC', 'Male', 1),
    ('932757', 'up932757@myport.ac.uk', 'Kate', 'Doe', 'https://randomuser.me/api/portraits/women/0.jpg', 'U0056PYC', 'Female', 1),
    ('932758', 'up932758@myport.ac.uk', 'Zack', 'Smith', 'https://randomuser.me/api/portraits/men/1.jpg', 'U0968PYC', 'Male', 3),
    ('932759', 'up932759@myport.ac.uk', 'Jenny', 'Smith', 'https://randomuser.me/api/portraits/women/2.jpg', 'U0968PYC', 'Female', 3);