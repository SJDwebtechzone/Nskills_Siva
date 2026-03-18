const axios = require("axios");

const API_BASE = "http://localhost:5000/api";
// Add a hardcoded token for test (find one if you can) - Actually, I'll just check if the server is even running.

async function testBackend() {
    try {
        const res = await axios.get(`${API_BASE}/enquiries`); // No auth, likely 401
        console.log("Enquiries GET:", res.status);
    } catch (err) {
        console.log("Enquiries GET failed:", err.response?.status || err.message);
    }

    try {
        const res = await axios.get(`${API_BASE}/admissions`);
        console.log("Admissions GET:", res.status);
    } catch (err) {
        console.log("Admissions GET failed:", err.response?.status || err.message);
    }
}

testBackend();
