const jwt = require("jsonwebtoken");

// -------------------- jwt functions -----------------//
const createAccessToken = (user) => {
  return jwt.sign(user, process.env.TOKEN_ACCESS_SECRET, { expiresIn: "1h" });
};
const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.TOKEN_ACCESS_SECRET, { expiresIn: "30d" });
};

module.exports = { createAccessToken, createRefreshToken };