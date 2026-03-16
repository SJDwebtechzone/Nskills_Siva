-- Drop table if exists to recreate with full structure
DROP TABLE IF EXISTS student_admissions;

CREATE TABLE student_admissions (
    id SERIAL PRIMARY KEY,
    enquiry_id VARCHAR(20) UNIQUE REFERENCES student_enquiries(enquiry_id),
    admission_date DATE DEFAULT CURRENT_DATE,
    
    -- A. Student Basic Information
    full_name VARCHAR(255) NOT NULL,
    gender VARCHAR(20) NOT NULL,
    dob DATE NOT NULL,
    age INT NOT NULL,
    aadhaar_number VARCHAR(20) NOT NULL,
    passport_number VARCHAR(50),
    passport_validity DATE,
    photo_url TEXT, -- Recent Passport Size Photo

    -- B. Contact Details
    mobile_number VARCHAR(20) NOT NULL,
    alt_mobile_number VARCHAR(20),
    whatsapp_number VARCHAR(20) NOT NULL,
    email_id VARCHAR(255) NOT NULL,
    residential_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pin_code VARCHAR(10) NOT NULL,

    -- C. Parent / Guardian Details
    parent_name VARCHAR(255) NOT NULL,
    relationship VARCHAR(100) NOT NULL,
    parent_mobile VARCHAR(20) NOT NULL,
    occupation VARCHAR(100) NOT NULL,
    annual_income VARCHAR(50),

    -- D. Educational Qualification
    highest_qualification VARCHAR(100) NOT NULL,
    year_of_passing VARCHAR(50) NOT NULL,
    institution_name VARCHAR(255) NOT NULL,
    board_university VARCHAR(255) NOT NULL,
    medium_of_study VARCHAR(100) NOT NULL,

    -- E. Skill & Experience Details
    technical_background TEXT,
    total_experience VARCHAR(50),
    industry_experience TEXT,
    skills_known TEXT,

    -- F. Course Selection
    course_interested VARCHAR(255) NOT NULL,
    course_level VARCHAR(50) NOT NULL, -- Basic / Diploma / Advanced / International
    mode_of_training VARCHAR(50) NOT NULL, -- Classroom / Practical / Hybrid
    batch_preference VARCHAR(100),
    training_location VARCHAR(255),

    -- G. Career Goal Information
    career_goal VARCHAR(100) NOT NULL,
    preferred_country VARCHAR(100),
    expected_salary VARCHAR(50),
    willing_to_relocate VARCHAR(10) NOT NULL,

    -- I. Counsellor / Referral Details
    counsellor_name VARCHAR(255) NOT NULL,
    counsellor_code VARCHAR(50) NOT NULL,
    referral_source VARCHAR(100) NOT NULL,
    counselling_date DATE NOT NULL,

    -- J. Course Fee & Payment Details
    course_name VARCHAR(255) NOT NULL,
    course_fees DECIMAL(15, 2) NOT NULL DEFAULT 0,
    total_fees DECIMAL(15, 2) NOT NULL DEFAULT 0,
    paid_fees DECIMAL(15, 2) NOT NULL DEFAULT 0,
    payment_mode VARCHAR(50) NOT NULL, -- Cash / UPI / Bank Transfer
    payment_ref_no VARCHAR(100),
    payment_date DATE NOT NULL,
    instalment_1 DECIMAL(15, 2) DEFAULT 0,
    instalment_2 DECIMAL(15, 2) DEFAULT 0,
    balance_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,

    -- K. Documents Checklist (Stored as URLs or flags)
    has_aadhaar_file TEXT,
    has_edu_certs_file TEXT,
    has_passport_file TEXT,
    has_resume_file TEXT,
    has_address_proof_file TEXT,
    has_photos_file TEXT,

    -- Special Declarations (Boolean)
    student_declaration BOOLEAN NOT NULL DEFAULT FALSE,
    parent_declaration BOOLEAN NOT NULL DEFAULT FALSE,
    placement_ack BOOLEAN NOT NULL DEFAULT FALSE,
    overseas_disclaimer BOOLEAN DEFAULT FALSE,
    discipline_ack BOOLEAN NOT NULL DEFAULT FALSE,
    photo_consent BOOLEAN NOT NULL DEFAULT FALSE,
    refund_policy_ack BOOLEAN NOT NULL DEFAULT FALSE,
    data_privacy_ack BOOLEAN NOT NULL DEFAULT FALSE,
    final_undertaking BOOLEAN NOT NULL DEFAULT FALSE,

    -- Emergency Contact
    emergency_contact_name VARCHAR(255) NOT NULL,
    emergency_contact_number VARCHAR(20) NOT NULL,
    emergency_authorized BOOLEAN NOT NULL DEFAULT FALSE,

    -- N. Office Use Only
    admission_number VARCHAR(100),
    batch_allotted VARCHAR(100),
    verified_by VARCHAR(255),
    authorized_signature_by VARCHAR(255),

    status VARCHAR(50) DEFAULT 'Approved',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
