-- Add created_by_id to student_enquiries
ALTER TABLE student_enquiries ADD COLUMN IF NOT EXISTS created_by_id INT REFERENCES users(id);

-- Add created_by_id to student_admissions
ALTER TABLE student_admissions ADD COLUMN IF NOT EXISTS created_by_id INT REFERENCES users(id);

-- Create associate_referral_points table
CREATE TABLE IF NOT EXISTS associate_referral_points (
    id SERIAL PRIMARY KEY,
    associate_id INT REFERENCES users(id),
    admission_id INT REFERENCES student_admissions(id),
    student_name VARCHAR(255),
    course_fee DECIMAL(10,2),
    points_earned DECIMAL(10,2),
    is_settled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Update existing records to link to a default admin if necessary (optional)
-- UPDATE student_enquiries SET created_by_id = (SELECT id FROM users WHERE role_id = (SELECT id FROM roles WHERE name = 'SuperAdmin' LIMIT 1) LIMIT 1) WHERE created_by_id IS NULL;
