const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Get the Authorization header
  const authHeader = req.header("Authorization");

  // Check if the Authorization header is present
  if (!authHeader) {
    return res.status(401).json({ error: "No token, authorization denied" });
  }

  // Extract the token by replacing 'Bearer ' with an empty string
  const token = authHeader.replace("Bearer ", "");

  try {
    // Verify the token and attach the decoded payload to req.user
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(400).json({ error: "Token is not valid" });
  }
};

module.exports = { authMiddleware };
