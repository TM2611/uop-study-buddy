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


