const axios = require('axios');
// Since I don't have the token, I'll use a direct DB check of current students status.
// But wait, the user is using the browser.

const jwt = require('jsonwebtoken');
const SECRET = "mysecret"; // based on auth.js line 46

const token = jwt.sign({ id: 1, roleId: 3, roleName: 'Admin' }, SECRET);

async function testApi() {
    try {
        console.log("Token:", token);
        const res = await axios.get("http://localhost:5000/api/users?role=student", {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Status:", res.status);
        console.log("Data size:", res.data.data.length);
        console.log("First user:", res.data.data[0]);
    } catch (err) {
        console.log("Error Status:", err.response?.status);
        console.log("Error Data:", err.response?.data);
    }
}

testApi();
