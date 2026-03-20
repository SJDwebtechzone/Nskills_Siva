-- NSKILL2 COMPLETE DATABASE SCHEMA (PostgreSQL)

-- 1. ROLES & AUTHENTICATION
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role_id INT REFERENCES roles(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS permissions (
    id SERIAL PRIMARY KEY,
    role_id INT REFERENCES roles(id) ON DELETE CASCADE,
    module VARCHAR(100) NOT NULL,
    can_view BOOLEAN DEFAULT FALSE,
    can_add BOOLEAN DEFAULT FALSE,
    can_edit BOOLEAN DEFAULT FALSE,
    can_delete BOOLEAN DEFAULT FALSE,
    UNIQUE(role_id, module)
);

CREATE TABLE IF NOT EXISTS modules (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. STUDENT ENQUIRY SYSTEM
CREATE TABLE IF NOT EXISTS student_enquiries (
    id SERIAL PRIMARY KEY,
    enquiry_id VARCHAR(20) UNIQUE,
    enquiry_date DATE DEFAULT CURRENT_DATE,
    mode_of_enquiry VARCHAR(50),
    student_name VARCHAR(255) NOT NULL,
    gender VARCHAR(20),
    age INT,
    dob DATE,
    mobile_number VARCHAR(20),
    whatsapp_number VARCHAR(20),
    email_id VARCHAR(255),
    perm_address TEXT,
    perm_city VARCHAR(100),
    perm_state VARCHAR(100),
    perm_pin VARCHAR(20),
    curr_address TEXT,
    curr_city VARCHAR(100),
    curr_state VARCHAR(100),
    curr_pin VARCHAR(20),
    highest_qualification VARCHAR(100),
    year_of_passing VARCHAR(50),
    institution_name VARCHAR(255),
    career_objective VARCHAR(100),
    preferred_country VARCHAR(100),
    expected_salary VARCHAR(50),
    willing_to_work_all_india VARCHAR(10),
    work_experience VARCHAR(50),
    company_name VARCHAR(255),
    position VARCHAR(100),
    salary VARCHAR(50),
    location VARCHAR(100),
    skills_trade TEXT,
    father_name VARCHAR(255),
    mother_name VARCHAR(255),
    parent_contact VARCHAR(20),
    parent_occupation VARCHAR(100),
    referred_by VARCHAR(100),
    counsellor_name VARCHAR(255),
    counsellor_code VARCHAR(50),
    will_attend_test VARCHAR(10),
    course_interested VARCHAR(255),
    level_of_course VARCHAR(50),
    training_mode VARCHAR(50),
    batch_timing VARCHAR(50),
    counselling_date DATE,
    counselling_done_by VARCHAR(255),
    interest_level VARCHAR(50),
    follow_up_date DATE,
    remarks TEXT,
    created_by_id INT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. STUDENT ADMISSION SYSTEM
CREATE TABLE IF NOT EXISTS student_admissions (
    id SERIAL PRIMARY KEY,
    enquiry_id VARCHAR(20) UNIQUE REFERENCES student_enquiries(enquiry_id) ON DELETE CASCADE,
    admission_number VARCHAR(100),
    admission_date DATE DEFAULT CURRENT_DATE,
    
    -- Student Details
    full_name VARCHAR(255) NOT NULL,
    gender VARCHAR(20) NOT NULL,
    dob DATE NOT NULL,
    age INT NOT NULL,
    aadhaar_number VARCHAR(20) NOT NULL,
    passport_number VARCHAR(50),
    passport_validity DATE,
    photo_url TEXT,

    -- Contact
    mobile_number VARCHAR(20) NOT NULL,
    alt_mobile_number VARCHAR(20),
    whatsapp_number VARCHAR(20) NOT NULL,
    email_id VARCHAR(255) NOT NULL,
    residential_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pin_code VARCHAR(10) NOT NULL,

    -- Parent
    parent_name VARCHAR(255) NOT NULL,
    relationship VARCHAR(100) NOT NULL,
    parent_mobile VARCHAR(20) NOT NULL,
    occupation VARCHAR(100) NOT NULL,
    annual_income VARCHAR(50),

    -- Education & Experience
    highest_qualification VARCHAR(100) NOT NULL,
    year_of_passing VARCHAR(50) NOT NULL,
    institution_name VARCHAR(255) NOT NULL,
    board_university VARCHAR(255) NOT NULL,
    medium_of_study VARCHAR(100) NOT NULL,
    technical_background TEXT,
    total_experience VARCHAR(50),
    industry_experience TEXT,
    skills_known TEXT,

    -- Course Selection
    course_interested VARCHAR(255) NOT NULL,
    course_level VARCHAR(50) NOT NULL,
    mode_of_training VARCHAR(50) NOT NULL,
    batch_preference VARCHAR(100),
    training_location VARCHAR(255),
    career_goal VARCHAR(100) NOT NULL,
    preferred_country VARCHAR(100),
    expected_salary VARCHAR(50),
    willing_to_relocate VARCHAR(10) NOT NULL,

    -- Office / Counsellor
    counsellor_name VARCHAR(255) NOT NULL,
    counsellor_code VARCHAR(50) NOT NULL,
    referral_source VARCHAR(100) NOT NULL,
    counselling_date DATE NOT NULL,

    -- Fees
    course_name VARCHAR(255) NOT NULL,
    course_fees DECIMAL(15, 2) NOT NULL DEFAULT 0,
    total_fees DECIMAL(15, 2) NOT NULL DEFAULT 0,
    paid_fees DECIMAL(15, 2) NOT NULL DEFAULT 0,
    payment_mode VARCHAR(50) NOT NULL,
    payment_ref_no VARCHAR(100),
    payment_date DATE NOT NULL,
    instalment_1 DECIMAL(15, 2) DEFAULT 0,
    instalment_2 DECIMAL(15, 2) DEFAULT 0,
    balance_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,

    -- Document Checks (Flags/URLs)
    has_aadhaar_file TEXT,
    has_edu_certs_file TEXT,
    has_passport_file TEXT,
    has_resume_file TEXT,
    has_address_proof_file TEXT,
    has_photos_file TEXT,

    -- Checklist & Undertakings
    student_declaration BOOLEAN NOT NULL DEFAULT FALSE,
    parent_declaration BOOLEAN NOT NULL DEFAULT FALSE,
    placement_ack BOOLEAN NOT NULL DEFAULT FALSE,
    overseas_disclaimer BOOLEAN DEFAULT FALSE,
    discipline_ack BOOLEAN NOT NULL DEFAULT FALSE,
    photo_consent BOOLEAN NOT NULL DEFAULT FALSE,
    refund_policy_ack BOOLEAN NOT NULL DEFAULT FALSE,
    data_privacy_ack BOOLEAN NOT NULL DEFAULT FALSE,
    final_undertaking BOOLEAN NOT NULL DEFAULT FALSE,

    -- Emergency
    emergency_contact_name VARCHAR(255) NOT NULL,
    emergency_contact_number VARCHAR(20) NOT NULL,
    emergency_authorized BOOLEAN NOT NULL DEFAULT FALSE,

    -- Office Use Only
    batch_allotted VARCHAR(100),
    verified_by VARCHAR(255),
    authorized_signature_by VARCHAR(255),

    status VARCHAR(50) DEFAULT 'Approved',
    created_by_id INT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. ASSOCIATE REFERRAL TRACKING
CREATE TABLE IF NOT EXISTS associate_referral_points (
    id SERIAL PRIMARY KEY,
    associate_id INT REFERENCES users(id) ON DELETE CASCADE,
    admission_id INT REFERENCES student_admissions(id) ON DELETE CASCADE,
    student_name VARCHAR(255),
    course_fee DECIMAL(10,2),
    points_earned DECIMAL(10,2),
    is_settled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. ATTENDANCE MANAGEMENT SYSTEM
CREATE TABLE IF NOT EXISTS attendance (
    id SERIAL PRIMARY KEY,
    admission_id INT REFERENCES student_admissions(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    batch VARCHAR(50) NOT NULL, -- 'Forenoon', 'Afternoon', 'Evening'
    status VARCHAR(20) NOT NULL, -- 'Present', 'Absent', 'Leave'
    punch_in TIME,
    punch_out TIME,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(admission_id, date, batch)
);
