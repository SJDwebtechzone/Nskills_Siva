const axios = require('axios');
async function test() {
    try {
        const response = await axios.post("https://text.pollinations.ai/", {
            messages: [{ role: "user", content: "hi" }],
            model: "openai"
        });
        console.log(response.data);
    } catch (e) {
        console.error(e.message);
    }
}
test();
