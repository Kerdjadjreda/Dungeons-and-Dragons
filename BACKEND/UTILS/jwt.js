const jwt = require("jsonwebtoken");

function signToken(payload) {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET, { expiresIn: "2h" });
}

module.exports = {
  signToken,
  verifyToken
};