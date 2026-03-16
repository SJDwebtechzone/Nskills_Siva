const pool = require("../config/db");

async function run() {
    // Generate the next enquiry ID
    const result = await pool.query("SELECT COUNT(*) FROM student_enquiries");
    const count = parseInt(result.rows[0].count) + 1;
    const enquiry_id = `ENQ${String(count).padStart(5, '0')}`;
    console.log("Next ENQ ID would be:", enquiry_id);

    // Try a minimal test INSERT
    try {
        const res = await pool.query(`
            INSERT INTO student_enquiries (
                enquiry_id, enquiry_date, mode_of_enquiry,
                student_name, gender, age, dob, mobile_number, whatsapp_number, email_id,
                perm_address, perm_city, perm_state, perm_pin,
                curr_address, curr_city, curr_state, curr_pin,
                highest_qualification, year_of_passing, institution_name,
                career_objective, preferred_country, expected_salary, willing_to_work_all_india,
                work_experience, company_name, position, salary, location, skills_trade,
                father_name, mother_name, parent_contact, parent_occupation,
                referred_by, counsellor_name, counsellor_code, will_attend_test,
                course_interested, level_of_course, training_mode, batch_timing,
                counselling_date, counselling_done_by, interest_level, follow_up_date, remarks,
                created_by_id
            ) VALUES (
                $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
                $11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
                $21,$22,$23,$24,$25,$26,$27,$28,$29,$30,
                $31,$32,$33,$34,$35,$36,$37,$38,$39,$40,
                $41,$42,$43,$44,$45,$46,$47,$48,$49
            ) RETURNING enquiry_id, student_name`,
            [
                enquiry_id, new Date(), 'Walk-in',
                'Test Student', 'Male', '22', null, '9876543210', '9876543210', 'test@test.com',
                'Test Address', 'Chennai', 'Tamil Nadu', '600001',
                null, null, null, null,
                'Degree', '2022', 'Test College',
                'Job', null, null, null,
                null, null, null, null, null, null,
                'Test Father', null, '9876543211', null,
                null, 'Test Counsellor', 'CC001', 'Yes',
                'Web Dev', 'Basic', 'Classroom', 'Morning',
                null, null, 'High', null, null,
                5
            ]
        );
        console.log("✅ Test enquiry inserted:", res.rows[0]);
        await pool.query("DELETE FROM student_enquiries WHERE enquiry_id = $1", [enquiry_id]);
        console.log("✅ Cleaned up test record");
    } catch (err) {
        console.error("❌ Insert failed:", err.message);
        console.error("   Code:", err.code);
        console.error("   Detail:", err.detail);
    }

    await pool.end();
}

run().catch(e => { console.error(e.message); process.exit(1); });
