const jwt = require("jsonwebtoken");

// -------------------- jwt functions -----------------//
const createAccessToken = (user) => {
  return jwt.sign(user, process.env.GOOGLE_CLIENT_SECRET, { expiresIn: "1h" });
};
const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.GOOGLE_CLIENT_SECRET, { expiresIn: "30d" });
};

module.exports = { createAccessToken, createRefreshToken };