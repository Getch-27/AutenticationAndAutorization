const jwt = require("jsonwebtoken");

const verifyAccessToken = async (req, res, next) => {
  // Get the authorization header
  const authHeader = req.headers['authorization'];
  
  // Extract token from the authorization header
  const token = authHeader && authHeader.split(' ')[1];

  // Check if the token is missing or invalid
  if (!token || token === "null") {
    return res.status(401).json({ message: 'Access token missing or invalid' });
  }

  try {
    // Verify the token using the secret key
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodedToken.userId; // Attach userId to request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Token verification failed:", error);

    // Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Access token expired' });
    }

    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = {
  verifyAccessToken
};
