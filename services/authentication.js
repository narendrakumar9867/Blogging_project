const JWT = require("jsonwebtoken");

const secret = "%qwer0987!!"; // Don't Share any one this password

function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    profileImageURL: user.profileImageURL,
    role: user.role,
  };
  const token = JWT.sign(payload, secret);
  return token;
}

function validateToken(token) {
  
  const payload = JWT.verify(token, secret);

  return payload;
}

module.exports = {
  createTokenForUser,
  validateToken,
};

