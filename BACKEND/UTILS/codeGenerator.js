const crypto = require("crypto");

function generateInviteCode(length = 8) {
  
  return crypto
    .randomBytes(32)
    .toString("base64")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, length);
};
// console.log(generateInviteCode())

module.exports = generateInviteCode;