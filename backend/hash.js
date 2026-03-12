// hash.js
const bcrypt = require("bcryptjs");

bcrypt.hash("Trainee@123", 10).then((hash) => {
  console.log(hash);
});