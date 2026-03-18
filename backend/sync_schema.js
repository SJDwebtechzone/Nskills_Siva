const pool = require("./config/db");

const expectedCols = [
    'gender', 'dob', 'age', 'aadhaar_number', 'passport_number', 'passport_validity', 'photo_url',
    'mobile_number', 'alt_mobile_number', 'whatsapp_number', 'email_id', 'residential_address', 'city', 'state', 'pin_code',
    'parent_name', 'relationship', 'parent_mobile', 'occupation', 'annual_income',
    'highest_qualification', 'year_of_passing', 'institution_name', 'board_university', 'medium_of_study',
    'technical_background', 'total_experience', 'industry_experience', 'skills_known',
    'course_interested', 'course_level', 'mode_of_training', 'batch_preference', 'training_location',
    'career_goal', 'preferred_country', 'expected_salary', 'willing_to_relocate',
    'counsellor_name', 'counsellor_code', 'referral_source', 'counselling_date',
    'course_name', 'course_fees', 'total_fees', 'paid_fees', 'payment_mode', 'payment_ref_no', 'payment_date',
    'instalment_1', 'instalment_2', 'balance_amount',
    'has_aadhaar_file', 'has_edu_certs_file', 'has_passport_file', 'has_resume_file', 'has_address_proof_file', 'has_photos_file',
    'student_declaration', 'parent_declaration', 'placement_ack', 'overseas_disclaimer',
    'discipline_ack', 'photo_consent', 'refund_policy_ack', 'data_privacy_ack', 'final_undertaking',
    'emergency_contact_name', 'emergency_contact_number', 'emergency_authorized',
    'admission_number', 'batch_allotted', 'verified_by', 'authorized_signature_by',
    'created_by_id'
];

async function syncSchema() {
    try {
        const existing = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'student_admissions'");
        const existingSet = new Set(existing.rows.map(r => r.column_name));

        for (const col of expectedCols) {
            if (!existingSet.has(col)) {
                // Determine type based on name or usage
                let type = "VARCHAR(255)";
                if (['dob', 'passport_validity', 'counselling_date', 'payment_date'].includes(col)) type = "DATE";
                if (['course_fees', 'total_fees', 'paid_fees', 'instalment_1', 'instalment_2', 'balance_amount'].includes(col)) type = "DECIMAL(10,2)";
                if (col.startsWith('has_') || col.endsWith('_ack') || col.endsWith('_consent') || col === 'overseas_disclaimer' || col === 'final_undertaking' || col === 'emergency_authorized') type = "BOOLEAN DEFAULT FALSE";
                if (col === 'residential_address' || col === 'skills_known') type = "TEXT";
                if (col === 'created_by_id') type = "INTEGER REFERENCES users(id)";

                console.log(`Adding column ${col} (${type})...`);
                await pool.query(`ALTER TABLE student_admissions ADD COLUMN IF NOT EXISTS ${col} ${type}`);
            }
        }
        console.log("Schema sync complete!");
    } catch (err) {
        console.error("Sync error:", err.message);
    } finally {
        pool.end();
    }
}

syncSchema();
