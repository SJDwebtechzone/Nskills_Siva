const pool = require("../config/db");

async function setupAdmissionTable() {
  try {
    console.log("🚀 Setting up student_admissions table...");

    // 1. Drop old placeholder if it exists (Optional, but since it was just a placeholder, it's safer)
    // await pool.query("DROP TABLE IF EXISTS student_admissions CASCADE;");

    // 2. Create the full table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS student_admissions (
        id SERIAL PRIMARY KEY,
        enquiry_id VARCHAR(20) UNIQUE REFERENCES student_enquiries(enquiry_id),
        
        -- A. Student Basic Information
        full_name VARCHAR(255) NOT NULL,
        gender VARCHAR(20),
        dob DATE,
        age INT,
        aadhaar_number VARCHAR(20),
        passport_number VARCHAR(50),
        passport_validity DATE,
        photo_url TEXT,

        -- B. Contact Details
        mobile_number VARCHAR(15),
        alt_mobile_number VARCHAR(15),
        whatsapp_number VARCHAR(15),
        email_id VARCHAR(255),
        residential_address TEXT,
        city VARCHAR(100),
        state VARCHAR(100),
        pin_code VARCHAR(10),

        -- C. Parent / Guardian Details
        parent_name VARCHAR(255),
        relationship VARCHAR(50),
        parent_mobile VARCHAR(15),
        occupation VARCHAR(100),
        annual_income VARCHAR(50),

        -- D. Educational Qualification
        highest_qualification VARCHAR(100),
        year_of_passing VARCHAR(50),
        institution_name VARCHAR(255),
        board_university VARCHAR(255),
        medium_of_study VARCHAR(50),

        -- E. Skill & Experience Details
        technical_background TEXT,
        total_experience VARCHAR(50),
        industry_experience TEXT,
        skills_known TEXT,

        -- F. Course Selection
        course_interested VARCHAR(255),
        course_level VARCHAR(100),
        mode_of_training VARCHAR(100),
        batch_preference VARCHAR(100),
        training_location VARCHAR(100),

        -- G. Career Goal Information
        career_goal VARCHAR(100),
        preferred_country VARCHAR(100),
        expected_salary VARCHAR(50),
        willing_to_relocate VARCHAR(10),

        -- I. Counsellor / Referral Details
        counsellor_name VARCHAR(255),
        counsellor_code VARCHAR(50),
        referral_source VARCHAR(100),
        counselling_date DATE,

        -- J. Course Fee & Payment Details
        course_name VARCHAR(255),
        course_fees DECIMAL(12, 2),
        total_fees DECIMAL(12, 2),
        paid_fees DECIMAL(12, 2),
        payment_mode VARCHAR(50),
        payment_ref_no VARCHAR(100),
        payment_date DATE,
        instalment_1 DECIMAL(12, 2),
        instalment_2 DECIMAL(12, 2),
        balance_amount DECIMAL(12, 2),

        -- K. Documents Checklist
        has_aadhaar BOOLEAN DEFAULT FALSE,
        has_education_certs BOOLEAN DEFAULT FALSE,
        has_passport BOOLEAN DEFAULT FALSE,
        has_resume BOOLEAN DEFAULT FALSE,
        has_address_proof BOOLEAN DEFAULT FALSE,
        has_photos BOOLEAN DEFAULT FALSE,

        -- Declarations
        student_declaration BOOLEAN DEFAULT FALSE,
        parent_declaration BOOLEAN DEFAULT FALSE,
        placement_ack BOOLEAN DEFAULT FALSE,
        overseas_disclaimer BOOLEAN DEFAULT FALSE,
        discipline_ack BOOLEAN DEFAULT FALSE,
        photo_consent BOOLEAN DEFAULT FALSE,
        refund_policy_ack BOOLEAN DEFAULT FALSE,
        data_privacy_ack BOOLEAN DEFAULT FALSE,
        final_undertaking BOOLEAN DEFAULT FALSE,

        -- L. Emergency Contact
        emergency_contact_name VARCHAR(255),
        emergency_contact_number VARCHAR(15),

        -- N. Office Use Only
        admission_number VARCHAR(50) UNIQUE,
        batch_allotted VARCHAR(100),
        verified_by VARCHAR(255),
        authorized_signature_by VARCHAR(255),
        
        status VARCHAR(50) DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await pool.query(createTableQuery);

    console.log("✅ student_admissions table created/updated successfully.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error setting up table:", err.message);
    process.exit(1);
  }
}

setupAdmissionTable();
