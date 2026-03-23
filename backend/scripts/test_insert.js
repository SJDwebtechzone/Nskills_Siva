const pool = require("../config/db");

async function testInsert() {
    try {
        const query = `
            INSERT INTO student_admissions (
                enquiry_id, full_name, gender, dob, age, aadhaar_number, passport_number, passport_validity, photo_url,
                mobile_number, alt_mobile_number, whatsapp_number, email_id, residential_address, city, state, pin_code,
                parent_name, relationship, parent_mobile, occupation, annual_income,
                highest_qualification, year_of_passing, institution_name, board_university, medium_of_study,
                technical_background, total_experience, industry_experience, skills_known,
                course_interested, course_level, mode_of_training, batch_preference, training_location,
                career_goal, preferred_country, expected_salary, willing_to_relocate,
                counsellor_name, counsellor_code, referral_source, counselling_date,
                course_name, course_fees, total_fees, paid_fees, payment_mode, payment_ref_no, payment_date,
                instalment_1, instalment_2, balance_amount,
                has_aadhaar_file, has_edu_certs_file, has_passport_file, has_resume_file, has_address_proof_file, has_photos_file,
                student_declaration, parent_declaration, placement_ack, overseas_disclaimer,
                discipline_ack, photo_consent, refund_policy_ack, data_privacy_ack, final_undertaking,
                emergency_contact_name, emergency_contact_number, emergency_authorized,
                admission_number, batch_allotted, verified_by, authorized_signature_by,
                created_by_id
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
                $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
                $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
                $31, $32, $33, $34, $35, $36, $37, $38, $39, $40,
                $41, $42, $43, $44, $45, $46, $47, $48, $49, $50,
                $51, $52, $53, $54, $55, $56, $57, $58, $59, $60,
                $61, $62, $63, $64, $65, $66, $67, $68, $69, $70,
                $71, $72, $73, $74, $75, $76, $77
            ) RETURNING *`;

        const values = [
            'ENQ00001', 'John Doe', 'Male', '1990-01-01', '30', '123456789012', '', null, 'dummy.jpg',
            '9123456780', '', '9123456780', 'john@example.com', 'Lane 1', 'City', 'State', '123456',
            'Parent', 'Father', '9988776655', 'Job', '500000',
            'B.E', '2012', 'College', 'University', 'English',
            'None', '0', '0', 'None',
            'DevOps', 'Basic', 'Classroom', 'None', 'Main',
            'Job', 'None', 'None', 'Yes',
            'Counsellor', 'C01', 'Walk-in', '2026-03-01',
            'Full Stack', 10000, 10000, 5000, 'Cash', '', '2026-03-01',
            0, 0, 5000,
            null, null, null, null, null, null,
            true, true, true, true,
            true, true, true, true, true,
            'EC Name', '9123456780', true,
            'ADM001', 'B1', 'Counsellor', 'Sign',
            null
        ];

        console.log("Values count:", values.length);
        const res = await pool.query(query, values);
        console.log("SUCCESS!");
        console.log(res.rows[0]);
        // Rollback or cleanup if needed, but this is a test
        process.exit(0);
    } catch (err) {
        console.error("FAILURE!");
        console.error(err.message);
        process.exit(1);
    }
}

testInsert();
