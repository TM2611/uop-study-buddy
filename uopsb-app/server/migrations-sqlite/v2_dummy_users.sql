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


INSERT OR IGNORE INTO student (id, email, given_name, family_name, picture, course_code, gender, year) 
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