const pool = require("../config/db");
const jwt  = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET || "mysecret";

async function run() {
    // Get the first Associate user
    const userRes = await pool.query(`
        SELECT u.id, u.email, r.id as role_id, r.name as role_name 
        FROM users u 
        JOIN roles r ON u.role_id = r.id 
        WHERE r.name = 'Associate' AND u.status = 'Active' 
        LIMIT 1
    `);
    
    if (userRes.rows.length === 0) {
        console.log("❌ No active Associate user found");
        await pool.end();
        return;
    }

    const user = userRes.rows[0];
    const token = jwt.sign({ id: user.id, roleId: user.role_id, roleName: user.role_name }, SECRET, { expiresIn: "1d" });
    console.log("✅ Associate user:", user.email);
    console.log("✅ Token:", token.slice(0, 50) + "...");

    // Now simulate what the backend INSERT would do with minimum fields
    const testDob = "2000-01-01";
    const testPayDate = "2024-03-13";
    const testCDate = "2024-03-13";

    try {
        const result = await pool.query(`
            INSERT INTO student_admissions (
                enquiry_id, full_name, gender, dob, age, aadhaar_number,
                mobile_number, whatsapp_number, email_id, residential_address, city, state, pin_code,
                parent_name, relationship, parent_mobile, occupation,
                highest_qualification, year_of_passing, institution_name, board_university, medium_of_study,
                course_interested, course_level, mode_of_training,
                career_goal, willing_to_relocate,
                counsellor_name, counsellor_code, referral_source, counselling_date,
                course_name, course_fees, total_fees, paid_fees, payment_mode, payment_date,
                balance_amount,
                student_declaration, parent_declaration, placement_ack,
                discipline_ack, photo_consent, refund_policy_ack, data_privacy_ack, final_undertaking,
                emergency_contact_name, emergency_contact_number, emergency_authorized,
                created_by_id
            ) VALUES (
                $1,$2,$3,$4,$5,$6,
                $7,$8,$9,$10,$11,$12,$13,
                $14,$15,$16,$17,
                $18,$19,$20,$21,$22,
                $23,$24,$25,
                $26,$27,
                $28,$29,$30,$31,
                $32,$33,$34,$35,$36,$37,
                $38,
                $39,$40,$41,
                $42,$43,$44,$45,$46,
                $47,$48,$49,
                $50
            ) RETURNING id, full_name`,
            [
                null, 'Test Student 2', 'Male', testDob, '22', '123456789012',
                '9876543210', '9876543210', 'test@test.com', 'Test Address', 'Chennai', 'Tamil Nadu', '600001',
                'Test Father', 'Father', '9876543211', 'Business',
                'Degree', '2022', 'Test College', 'Anna University', 'English',
                'Web Development', 'Basic', 'Classroom',
                'Job in India', 'Yes',
                'Test Counsellor', 'CC001', 'Career Counsellor', testCDate,
                'Full Stack Development', 0, 10000, 5000, 'Cash', testPayDate,
                5000,
                true, true, true,
                true, true, true, true, true,
                'Emergency Person', '9876543212', true,
                user.id
            ]
        );
        console.log("✅ Test admission inserted:", result.rows[0]);
        // Delete the test record
        await pool.query("DELETE FROM student_admissions WHERE id = $1", [result.rows[0].id]);
        console.log("✅ Test record cleaned up");
    } catch (err) {
        console.error("❌ Insert error:", err.message);
    }

    await pool.end();
}

run().catch(e => { console.error(e.message); process.exit(1); });
