const jwt = require("jsonwebtoken");

const getTokenPayload = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const getUserId = (req, authToken) => {
  if (req) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      if (!token) {
        throw new Error("No token found");
      }
      const { userId } = getTokenPayload(token);
      return userId;
    }
  } else if (authToken) {
    const { userId } = getTokenPayload(authToken);
    return userId;
  }
  throw new Error("Not authenticated!");
};

module.exports = {
  getUserId,
};
